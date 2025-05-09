import { useEffect, useState } from "react";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBookings();
  }, [token]);

  const fetchBookings = () => {
    fetch("/api/participants/my", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setBookings(data));
  };

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("token");
    await fetch(`/api/participants/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    fetchBookings(); // refresh list
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-green-700">
        My Tour Bookings
      </h2>
      {bookings.map((booking) => (
        <div key={booking.id} className="border p-2 mb-2">
          <div>Tour: {booking.tour_title}</div>
          <div>Date: {new Date(booking.tour_date).toLocaleDateString()}</div>
          <div>Status: {booking.status}</div>
          {booking.status === "Pending" && (
            <>
              <button onClick={() => updateStatus(booking.id, "Accepted")}>
                Accept
              </button>
              <button onClick={() => updateStatus(booking.id, "Declined")}>
                Decline
              </button>
            </>
          )}
          {booking.status === "Accepted" && (
            <button onClick={() => updateStatus(booking.id, "Completed")}>
              Complete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
