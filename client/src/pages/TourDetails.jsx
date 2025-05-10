import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export default function TourDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [message, setMessage] = useState("");
  const [bookingStatus, setBookingStatus] = useState(null);

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    fetch(`/api/tours/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTour(data);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !selectedDate) return;
    fetch(`/api/participants/my?tour_id=${id}&date_id=${selectedDate}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.status) setBookingStatus(data.status);
        else setBookingStatus(null);
      });
  }, [id, selectedDate]);

  const handleBook = async () => {
    setMessage("");
    setBookingStatus(null);
    const token = localStorage.getItem("token");
    const res = await fetch("/api/participants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        tour_id: tour.id,
        date_id: selectedDate,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setBookingStatus("Pending");
      setMessage("Booking submitted! Status: Pending");
    } else {
      setMessage(data.message || "Booking failed");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!tour)
    return <div className="p-8 text-center text-red-600">Tour not found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded shadow mt-8">
      <h1 className="text-3xl font-bold mb-4 text-green-700">{tour.title}</h1>
      {tour.image && (
        <img
          src={tour.image}
          alt={tour.title}
          className="w-full h-64 object-cover rounded mb-4"
        />
      )}
      <p className="mb-2 text-gray-700">{tour.description}</p>
      <p className="mb-2 text-green-700 font-semibold">Price: {tour.price} €</p>
      <p className="mb-2 text-gray-600">Duration: {tour.duration}</p>
      <p className="mb-2 text-gray-500">Category: {tour.category}</p>

      {/* Booking UI */}
      {tour.dates && tour.dates.length > 0 && (
        <div className="mt-6">
          <label className="block mb-2 font-semibold">Select Date:</label>
          <div className="flex flex-col gap-2 mb-2">
            {tour.dates.map((date) => (
              <label key={date.id} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="date"
                  value={date.id}
                  checked={selectedDate === String(date.id)}
                  onChange={() => setSelectedDate(String(date.id))}
                />
                {new Date(date.date).toLocaleDateString()}{" "}
                {date.time ? date.time.slice(0, 5) : ""}
              </label>
            ))}
          </div>
          {isLoggedIn ? (
            <button
              className="ml-2 bg-green-600 text-white px-4 py-2 rounded"
              disabled={!selectedDate || bookingStatus === "Pending"}
              onClick={handleBook}
            >
              Book
            </button>
          ) : (
            <button
              className="ml-2 bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => navigate("/register")}
              disabled={!selectedDate}
            >
              Register to book
            </button>
          )}
        </div>
      )}
      {message && <div className="mt-4 text-green-700">{message}</div>}
      {bookingStatus && (
        <div className="mt-2">
          Booking status:{" "}
          <span
            className={
              bookingStatus === "Accepted"
                ? "text-green-600"
                : bookingStatus === "Declined"
                ? "text-red-600"
                : "text-yellow-600"
            }
          >
            {bookingStatus}
          </span>
        </div>
      )}
    </div>
  );
}
