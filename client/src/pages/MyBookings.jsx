import { useEffect, useState } from "react";
import ReviewForm from "../components/ReviewForm";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("/api/participants/my", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load bookings");
        return res.json();
      })
      .then((data) => setBookings(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message));
  }, [token]);

  const submitReview = (tour_id, rating, comment) => {
    fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ tour_id, rating, comment }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to submit review");
        return res.json();
      })
      .catch((e) => setError(e.message));
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 md:mt-10 bg-white p-4 md:p-8 rounded-2xl shadow-2xl">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-green-700 text-center">
        My Bookings
      </h2>
      {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-2xl shadow text-xs md:text-base">
          <thead>
            <tr>
              <th className="px-2 md:px-4 py-2 text-left">Tour</th>
              <th className="px-2 md:px-4 py-2 text-left">Date</th>
              <th className="px-2 md:px-4 py-2 text-left">Time</th>
              <th className="px-2 md:px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b">
                <td className="px-2 md:px-4 py-2">{b.tour_title}</td>
                <td className="px-2 md:px-4 py-2">
                  {new Date(b.tour_date).toLocaleDateString("ru-RU")}
                </td>
                <td className="px-2 md:px-4 py-2">
                  {(b.tour_time || "").slice(0, 5)}
                </td>
                <td className="px-2 md:px-4 py-2">{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6">
        {bookings
          .filter((b) => b.status === "Completed")
          .map((b) => (
            <ReviewForm key={b.id} tourId={b.tour_id} onSubmit={submitReview} />
          ))}
      </div>
    </div>
  );
}
