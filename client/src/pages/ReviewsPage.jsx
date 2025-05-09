import { useEffect, useState } from "react";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load reviews");
        return res.json();
      })
      .then((data) => setReviews(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-2xl">
      <h2 className="text-3xl font-bold mb-6 text-green-700 text-center">
        Tour Reviews
      </h2>
      {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
      <ul>
        {reviews.map((r) => (
          <li key={r.id} className="mb-6 border-b pb-4">
            <div className="flex items-center mb-1">
              <span className="font-semibold">{r.tour_title}</span>
              <span className="ml-4 text-yellow-500">
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
              </span>
            </div>
            <div className="text-gray-700 mb-1">{r.comment}</div>
            <div className="text-gray-400 text-sm">
              by {r.user_name} on{" "}
              {new Date(r.created_at).toLocaleDateString("ru-RU")}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
