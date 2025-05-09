import React, { useEffect, useState } from "react";

function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

function addOneDay(dateStr) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

function AdminPanel() {
  const [tours, setTours] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "group",
    price: "",
    duration: "",
    image: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [datesByTour, setDatesByTour] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editDates, setEditDates] = useState([]); // Dates for the tour being edited
  const [editDateInput, setEditDateInput] = useState(""); // New date input
  const [editDateId, setEditDateId] = useState(null); // If editing an existing date
  const [date, setDate] = useState(""); // New date for form
  const [time, setTime] = useState(""); // New time for form

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0Njc4NjI3MCwiZXhwIjoxNzQ2Nzg5ODcwfQ.h7WKWey0Z9NXEBx_fJ9km1X4kBfPYEcnkXlzXdt2d3c";

  useEffect(() => {
    if (token) {
      const decoded = decodeToken(token);
      setIsAdmin(decoded && decoded.role === "admin");
    } else {
      setIsAdmin(false);
    }
  }, [token]);

  const fetchTours = () => {
    fetch("/api/tours")
      .then((res) => res.json())
      .then(setTours)
      .catch(() => setTours([]));
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTourDates = async (tourId) => {
    const res = await fetch(`/api/tours/${tourId}/dates`);
    const dates = await res.json();
    setDatesByTour((prev) => ({ ...prev, [tourId]: dates }));
  };

  // Fetch dates for a tour (for modal)
  const fetchEditDates = async (tourId) => {
    const res = await fetch(`/api/tours/${tourId}/dates`);
    const dates = await res.json();
    setEditDates(dates);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = form.image || "";
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        imageUrl = reader.result;
        await submitTour(imageUrl);
      };
      reader.readAsDataURL(imageFile);
      return;
    } else {
      await submitTour(imageUrl);
    }
  };

  const submitTour = async (imageUrl) => {
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/tours/${editingId}` : "/api/tours";
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...form, image: imageUrl }),
    });
    if (res.ok) {
      setForm({
        title: "",
        description: "",
        category: "group",
        price: "",
        duration: "",
        image: "",
      });
      setEditingId(null);
      setImageFile(null);
      setShowModal(false);
      fetchTours();
    } else {
      alert("Error: " + (await res.text()));
    }
  };

  // When opening modal for edit
  const handleEdit = (tour) => {
    setForm({
      title: tour.title,
      description: tour.description,
      category: tour.category,
      price: tour.price,
      duration: tour.duration,
      image: tour.image || "",
    });
    setEditingId(tour.id);
    setShowModal(true);
    fetchEditDates(tour.id);
    setEditDateInput("");
    setEditDateId(null);
  };

  // Add or update a date in modal
  const handleSaveDate = async () => {
    if (!editDateInput) return;
    if (editDateId) {
      // Update existing date
      const res = await fetch(`/api/tour-dates/${editDateId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ date: editDateInput, time }),
      });
      if (res.ok) {
        setEditDateId(null);
        setEditDateInput("");
        setTime("");
        fetchEditDates(editingId);
      } else {
        alert("Failed to update date");
      }
    } else {
      // Add new date
      const res = await fetch("/api/tour-dates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tour_id: editingId, // <-- add this!
          date: editDateInput,
          time,
        }),
      });
      if (res.ok) {
        setEditDateInput("");
        setTime("");
        fetchEditDates(editingId);
      } else {
        alert("Failed to add date");
      }
    }
  };

  // Edit a date (fill input)
  const handleEditDateClick = (dateObj) => {
    setEditDateInput(dateObj.date.slice(0, 10));
    setEditDateId(dateObj.id);
    setTime(dateObj.time ? dateObj.time.slice(0, 5) : "");
  };

  // Delete a date
  const handleDeleteDate = async (dateId) => {
    if (!window.confirm("Delete this date?")) return;
    const res = await fetch(`/api/tour-dates/${dateId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) fetchEditDates(editingId);
    else alert("Delete failed");
  };

  const handleDelete = async (tourId) => {
    if (!window.confirm("Are you sure you want to delete this tour?")) return;
    const res = await fetch(`/api/tours/${tourId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      fetchTours();
    } else {
      alert("Failed to delete tour");
    }
  };

  const fetchTourById = async (id) => {
    const res = await fetch(`/api/tours/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.json();
  };

  if (!isAdmin) {
    return (
      <section className="max-w-3xl mx-auto py-10 px-4">
        <h2 className="text-3xl font-bold mb-6 text-green-700">Admin Panel</h2>
        <div className="text-red-600 font-semibold">
          Access denied. Admins only.
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-green-700 text-center">
        Admin Panel
      </h2>
      {/* Modal for editing */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl"
              onClick={() => {
                setShowModal(false);
                setEditingId(null);
                setForm({
                  title: "",
                  description: "",
                  category: "group",
                  price: "",
                  duration: "",
                  image: "",
                });
                setImageFile(null);
                setEditDates([]);
                setEditDateInput("");
                setEditDateId(null);
                setTime("");
              }}
              title="Close"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold mb-4 text-green-700">
              {editingId ? "Edit Tour" : "Add Tour"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="title"
                placeholder="Title"
                className="w-full p-2 border rounded"
                value={form.title}
                onChange={handleChange}
                required
              />
              <input
                name="price"
                type="number"
                step="0.01"
                placeholder="Price"
                className="w-full p-2 border rounded"
                value={form.price}
                onChange={handleChange}
                required
              />
              <input
                name="duration"
                placeholder="Duration"
                className="w-full p-2 border rounded"
                value={form.duration}
                onChange={handleChange}
                required
              />
              <select
                name="category"
                className="w-full p-2 border rounded"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="group">Group</option>
                <option value="individual">Individual</option>
              </select>
              <textarea
                name="description"
                placeholder="Description"
                className="w-full p-2 border rounded"
                value={form.description}
                onChange={handleChange}
                required
              />
              <input
                name="image"
                placeholder="Image URL"
                className="w-full p-2 border rounded"
                value={form.image || ""}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
              <label className="block">
                <span className="text-gray-700">Or choose a photo:</span>
                <input
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-gray-500"
                  onChange={handleImageChange}
                />
              </label>
              {imageFile && (
                <span className="text-green-700 text-sm">{imageFile.name}</span>
              )}
              <div className="flex gap-4 mt-2">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded border"
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                    setForm({
                      title: "",
                      description: "",
                      category: "group",
                      price: "",
                      duration: "",
                      image: "",
                    });
                    setImageFile(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
            {/* Date management in modal */}
            {editingId && (
              <div className="mt-6">
                <h4 className="font-semibold mb-2">Tour Dates</h4>
                <div className="flex gap-2 mb-2">
                  <input
                    type="date"
                    value={editDateInput}
                    onChange={(e) => setEditDateInput(e.target.value)}
                    className="border rounded p-1"
                  />
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="border rounded p-1"
                    placeholder="Time"
                  />
                  <button
                    className="bg-green-600 text-white px-2 py-1 rounded"
                    onClick={handleSaveDate}
                    type="button"
                  >
                    {editDateId ? "Update Date" : "Add Date"}
                  </button>
                  {editDateId && (
                    <button
                      className="px-2 py-1 rounded border"
                      onClick={() => {
                        setEditDateInput("");
                        setEditDateId(null);
                        setTime("");
                      }}
                      type="button"
                    >
                      Cancel
                    </button>
                  )}
                </div>
                <ul className="mt-2 text-sm text-gray-700">
                  {editDates.map((d) => (
                    <li key={d.id} className="flex items-center gap-2">
                      <span>
                        {new Date(d.date).toLocaleDateString()}{" "}
                        {d.time ? d.time.slice(0, 5) : ""}
                      </span>
                      <button
                        className="text-blue-600 underline text-xs"
                        onClick={() => {
                          handleEditDateClick(d);
                          setTime(d.time ? d.time.slice(0, 5) : "");
                        }}
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 underline text-xs"
                        onClick={() => handleDeleteDate(d.id)}
                        type="button"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
      {/* List of tours */}
      <h3 className="text-2xl font-semibold mb-4 text-center">All Tours</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tours.map((tour) => (
          <div
            key={tour.id}
            className="bg-white p-4 rounded-xl shadow flex flex-col items-center"
          >
            {tour.image && (
              <img
                src={tour.image}
                alt={tour.title}
                className="w-full h-40 object-cover rounded mb-3"
                style={{ maxWidth: "320px" }}
              />
            )}
            <div className="w-full">
              <div className="font-bold text-lg mb-1 text-green-800">
                {tour.title}
              </div>
              <div className="text-gray-700 mb-1">{tour.description}</div>
              <div className="text-sm text-gray-500 mb-2">
                {tour.category} | {tour.duration} | {tour.price} €
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded"
                onClick={() => handleEdit(tour)}
              >
                Edit
              </button>
              <button
                className="px-3 py-1 bg-red-600 text-white rounded"
                onClick={() => handleDelete(tour.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AdminPanel;
