import React, { useEffect, useState } from "react";

function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
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

  // Always get token from localStorage
  const token = localStorage.getItem("token") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsImVtYWlsIjoiYWRtaW5AbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDY2OTExNDksImV4cCI6MTc0NjY5NDc0OX0.H_NVFNXDhns8jtVPc-xdwIrR6JsorOb2Hz9hMc21NC8";

  // Check admin role when token changes
  useEffect(() => {
    if (token) {
      const decoded = decodeToken(token);
      setIsAdmin(decoded && decoded.role === "admin");
    } else {
      setIsAdmin(false);
    }
  }, [token]);

  // Fetch tours
  const fetchTours = () => {
    fetch("/api/tours")
      .then((res) => res.json())
      .then(setTours)
      .catch(() => setTours([]));
  };

  useEffect(() => {
    fetchTours();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle file input change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  // Handle add or edit
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

  // Helper to submit tour with image URL or base64
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
      fetchTours();
    } else {
      alert("Error: " + (await res.text()));
    }
  };

  // Handle edit button
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
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this tour?")) return;
    const res = await fetch(`/api/tours/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) fetchTours();
    else alert("Delete failed");
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
    <section className="max-w-3xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-green-700">Admin Panel</h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-3 bg-gray-50 p-4 rounded shadow"
      >
        <input
          name="title"
          placeholder="Title"
          className="w-full p-2 border rounded"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          className="w-full p-2 border rounded"
          value={form.description}
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
        <input
          name="image"
          placeholder="Image URL"
          className="w-full p-2 border rounded"
          value={form.image || ""}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
        />
        <div className="flex items-center gap-2">
          <label className="block">
            <span className="text-gray-700">Or choose a photo:</span>
            <input
              type="file"
              accept="image/*"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              onChange={handleImageChange}
            />
          </label>
          {imageFile && (
            <span className="text-green-700 text-sm">{imageFile.name}</span>
          )}
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {editingId ? "Update Tour" : "Add Tour"}
        </button>
        {editingId && (
          <button
            type="button"
            className="ml-2 px-4 py-2 rounded border"
            onClick={() => {
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
        )}
      </form>
      <h3 className="text-2xl font-semibold mb-4">All Tours</h3>
      <div className="space-y-4">
        {tours.map((tour) => (
          <div
            key={tour.id}
            className="bg-white p-4 rounded shadow flex flex-col md:flex-row md:items-center md:justify-between"
          >
            <div>
              <div className="font-bold">{tour.title}</div>
              <div className="text-gray-700">{tour.description}</div>
              <div className="text-sm text-gray-500">
                {tour.category} | {tour.duration} | {tour.price} €
              </div>
            </div>
            <div className="mt-2 md:mt-0 flex gap-2">
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
