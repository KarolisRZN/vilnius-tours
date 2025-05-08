import { useEffect, useState } from "react";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("/api/participants/my", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setBookings(data));
  }, [token]);

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-green-700">
        My Tour Bookings
      </h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th>Tour</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.tour_title}</td>
              <td>{new Date(b.tour_date).toLocaleString()}</td>
              <td>
                <span
                  className={
                    b.status === "Accepted"
                      ? "text-green-600"
                      : b.status === "Declined"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }
                >
                  {b.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
