import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ToursIndividuals() {
  const [tours, setTours] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/tours?category=individual")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load tours");
        return res.json();
      })
      .then((data) => setTours(Array.isArray(data) ? data : []))
      .catch(() => setError("Failed to load tours"));
  }, []);

  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <section className="w-full bg-white py-10 px-4 flex flex-col items-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-green-700 text-center">
        Individual Tours In Vilnius
      </h2>
      {tours.length === 0 ? (
        <p className="text-gray-500 text-center">
          No individual tours available.
        </p>
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
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
