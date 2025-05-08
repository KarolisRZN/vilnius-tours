import { useEffect, useState } from "react";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("/api/participants", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setBookings(data));
  }, [token, message]);

  const updateStatus = async (id, status) => {
    setMessage("");
    const res = await fetch(`/api/participants/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-green-700">Tour Bookings</h2>
      {message && <div className="mb-4 text-green-700">{message}</div>}
      <table className="w-full border">
        <thead>
          <tr>
            <th>User</th>
            <th>Tour</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.user_name}</td>
              <td>{b.tour_title}</td>
              <td>{new Date(b.tour_date).toLocaleString()}</td>
              <td>{b.status}</td>
              <td>
                {b.status === "Pending" && (
                  <>
                    <button
                      className="bg-green-600 text-white px-2 py-1 rounded mr-2"
                      onClick={() => updateStatus(b.id, "Accepted")}
                    >
                      Accept
                    </button>
                    <button
                      className="bg-red-600 text-white px-2 py-1 rounded"
                      onClick={() => updateStatus(b.id, "Declined")}
                    >
                      Decline
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
