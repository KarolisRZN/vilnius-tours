import React, { useEffect, useState } from "react";
import { Link } from "react-router";

export default function ToursPage() {
  const [tours, setTours] = useState([]);
  const [datesByTour, setDatesByTour] = useState({});
  const [selectedDates, setSelectedDates] = useState({});
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token") || "";
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    setLoading(true);
    const res = await fetch("/api/tours");
    const data = await res.json();
    setTours(data);
    setLoading(false);
    // Fetch dates for all tours
    data.forEach((tour) => fetchTourDates(tour.id));
  };

  const fetchTourDates = async (tourId) => {
    const res = await fetch(`/api/tours/${tourId}/dates`);
    const dates = await res.json();
    setDatesByTour((prev) => ({ ...prev, [tourId]: dates }));
  };

  const handleDateChange = (tourId, value) => {
    setSelectedDates((prev) => ({ ...prev, [tourId]: value }));
  };

  const handleAddDate = async (tourId) => {
    const date = selectedDates[tourId];
    if (!date) return;
    const res = await fetch(`/api/tours/${tourId}/dates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ date }),
    });
    if (res.ok) {
      setSelectedDates((prev) => ({ ...prev, [tourId]: "" }));
      fetchTourDates(tourId);
    } else {
      alert("Failed to add date");
    }
  };

  const handleDeleteDate = async (tourId, dateId) => {
    const res = await fetch(`/api/tour-dates/${dateId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      fetchTourDates(tourId);
    } else {
      alert("Failed to delete date");
    }
  };

  return (
    <section className="w-full bg-white py-10 px-4 flex flex-col items-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-green-700 text-center">
        All Tours In Vilnius
      </h2>
      {loading ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : tours.length === 0 ? (
        <p className="text-gray-500 text-center">No tours available.</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl w-full">
          {tours.map((tour) => (
            <div
              key={tour.id}
              className="bg-white p-6 rounded-2xl shadow flex flex-col"
            >
              <Link
                to={`/tours/${tour.id}`}
                className="text-xl font-bold text-green-800 hover:underline mb-2 text-center"
              >
                {tour.title}
              </Link>
              <p className="text-gray-700 mb-2 text-center">
                {tour.description}
              </p>
              {tour.price && (
                <p className="text-green-700 font-semibold mb-1 text-center">
                  Price: {tour.price} €
                </p>
              )}
              {tour.duration && (
                <p className="text-gray-600 mb-1 text-center">
                  Duration: {tour.duration}
                </p>
              )}
              {tour.category && (
                <p className="text-gray-500 text-sm text-center mb-2">
                  Category: {tour.category}
                </p>
              )}
              {tour.image && (
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}

              <div className="mt-2">
                <div className="font-semibold mb-1">Tour Dates:</div>
                <ul className="text-sm text-gray-700 mb-2">
                  {(datesByTour[tour.id] || []).map((d) => {
                    console.log(d);
                    return (
                      <li
                        key={d.id}
                        className="flex items-center justify-between mb-1"
                      >
                        <span>
                          {new Date(d.date).toLocaleDateString("en-CA")}
                          <span className="ml-2 text-gray-500">
                            {(d.time || "").slice(0, 5)}
                          </span>
                        </span>
                        {isAdmin && (
                          <button
                            className="ml-2 text-red-600 underline"
                            onClick={() => handleDeleteDate(tour.id, d.id)}
                          >
                            Delete
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
                {console.log(datesByTour[tour.id])}
                {isAdmin && (
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="date"
                      className="border rounded px-2 py-1"
                      value={selectedDates[tour.id] || ""}
                      onChange={(e) =>
                        handleDateChange(tour.id, e.target.value)
                      }
                    />
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      onClick={() => handleAddDate(tour.id)}
                    >
                      Add Date
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
