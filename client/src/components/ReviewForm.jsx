import { useState } from "react";

export default function ReviewForm({ tourId, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Review submit:", { tourId, rating, comment });
    onSubmit(tourId, rating, comment);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="mb-2">
        <label className="block mb-1 font-semibold">Your Rating:</label>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            className={star <= rating ? "text-yellow-500" : "text-gray-400"}
            onClick={() => setRating(star)}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        className="w-full border rounded p-2 mb-2"
        rows={3}
        placeholder="Write your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Submit Review
      </button>
    </form>
  );
}
