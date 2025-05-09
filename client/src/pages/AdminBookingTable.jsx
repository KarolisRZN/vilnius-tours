import { useEffect, useState } from "react";

export default function AdminBookingsTable() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line
  }, []);

  const fetchBookings = async () => {
    setError("");
    const res = await fetch("/api/participants", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      setError("Failed to load bookings");
      setBookings([]);
      return;
    }
    const data = await res.json();
    setBookings(Array.isArray(data) ? data : []);
  };

  const updateStatus = async (id, status) => {
    setError("");
    const res = await fetch(`/api/participants/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      setError("Failed to update status");
    }
    fetchBookings();
  };

  const deleteBooking = async (id) => {
    setError("");
    const res = await fetch(`/api/participants/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      setError("Failed to delete booking");
    }
    fetchBookings();
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-2xl">
      <h2 className="text-3xl font-bold mb-6 text-green-700 text-center">
        Admin Bookings
      </h2>
      {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-2xl shadow">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Tour</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Time</th>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b">
                <td className="px-4 py-2">{b.tour_title}</td>
                <td className="px-4 py-2">
                  {new Date(b.tour_date).toLocaleDateString("ru-RU")}
                </td>
                <td className="px-4 py-2">
                  {(b.tour_time || b.time || "").slice(0, 5)}
                </td>
                <td className="px-4 py-2">{b.user_name}</td>
                <td className="px-4 py-2">{b.status}</td>
                <td className="px-4 py-2 space-x-2">
                  {b.status === "Pending" && (
                    <>
                      <button
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        onClick={() => updateStatus(b.id, "Accepted")}
                      >
                        Accept
                      </button>
                      <button
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        onClick={() => updateStatus(b.id, "Declined")}
                      >
                        Decline
                      </button>
                    </>
                  )}
                  {b.status === "Accepted" && (
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      onClick={() => updateStatus(b.id, "Completed")}
                    >
                      Complete
                    </button>
                  )}
                  {(b.status === "Declined" || b.status === "Completed") && (
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                      onClick={() => deleteBooking(b.id)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
