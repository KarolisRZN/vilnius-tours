import { useEffect, useState } from "react";
import { Link } from "react-router";

export default function AvailableToursCards() {
  const [tours, setTours] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/tours?limit=4")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load tours");
        return res.json();
      })
      .then((data) => setTours(Array.isArray(data) ? data : []))
      .catch(() => setError("Failed to load tours"));
  }, []);

  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <section className="w-full flex flex-col items-center py-10 bg-white">
      <div className="flex flex-col md:flex-row gap-8 justify-center w-full max-w-6xl">
        {tours.map((tour) => (
          <Link
            to={`/tours/${tour.id}`}
            key={tour.id}
            className="relative w-72 h-48 rounded shadow-lg overflow-hidden"
            style={{ minWidth: "260px" }}
          >
            <img
              src={tour.image}
              alt={tour.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 w-full bg-black/40 py-3 px-2">
              <span className="text-white text-xl font-semibold drop-shadow text-center w-full block">
                {tour.title}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
