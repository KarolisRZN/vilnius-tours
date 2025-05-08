import React, { useEffect, useState } from "react";
import { Link } from "react-router";

function ToursPage() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDates, setSelectedDates] = useState({});
  const [datesByTour, setDatesByTour] = useState({});

  useEffect(() => {
    fetch("/api/tours")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched tours:", data);
        setTours(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching tours:", err);
        setTours([]);
        setLoading(false);
      });
  }, []);

  const handleAddDate = async (tourId) => {
    const date = selectedDates[tourId];
    if (!date) return;
    const token =
      localStorage.getItem("token") ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsImVtYWlsIjoiYWRtaW5AbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDY2OTM2MzQsImV4cCI6MTc0NjY5NzIzNH0.ejrmSE3KHUq5lVgiseMhNgfCAQ0QoO6BEhWaRQeN5co";
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

  const fetchTourDates = async (tourId) => {
    const res = await fetch(`/api/tours/${tourId}/dates`);
    const dates = await res.json();
    setDatesByTour((prev) => ({ ...prev, [tourId]: dates }));
  };

  const handleDeleteDate = async (tourId, dateId) => {
    const token = localStorage.getItem("token") || "";
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

  // When the date input changes
  const handleDateChange = (tourId, value) => {
    setSelectedDates((prev) => ({ ...prev, [tourId]: value }));
  };

  function decodeToken(token) {
    try {
      const payload = token.split(".")[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  const token = localStorage.getItem("token") || "";
  const isAdmin = true;

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
              className="bg-white p-4 rounded shadow flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div className="flex-1 mb-4 md:mb-0">
                <h3 className="text-xl font-semibold mb-2 text-green-800 text-center">
                  <Link to={`/tours/${tour.id}`} className="hover:underline">
                    {tour.title}
                  </Link>
                </h3>
                <p className="text-gray-700 text-center mb-2">
                  {tour.description}
                </p>
                {tour.price && (
                  <p className="text-green-700 font-semibold mb-1">
                    Price: {tour.price} €
                  </p>
                )}
                {tour.duration && (
                  <p className="text-gray-600 mb-1">
                    Duration: {tour.duration}
                  </p>
                )}
                {tour.category && (
                  <p className="text-gray-500 text-sm">
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
              </div>
              <div>
                <ul className="mt-2 text-sm text-gray-700">
                  {(datesByTour[tour.id] || []).map((d) => (
                    <li key={d.id} className="flex items-center">
                      {new Date(d.date).toLocaleDateString("en-CA")}
                      {isAdmin && (
                        <button
                          className="ml-2 text-red-600 underline"
                          onClick={() => handleDeleteDate(tour.id, d.id)}
                        >
                          Delete
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default ToursPage;
