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
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-black text-center">
        Available Tours
      </h2>
      <div className="container mx-auto px-2">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center items-stretch">
          {tours.map((tour) => (
            <Link
              to={`/tours/${tour.id}`}
              key={tour.id}
              className="relative max-w-xs w-full h-56 rounded shadow-lg overflow-hidden mx-auto flex flex-col"
            >
              <img
                src={tour.image}
                alt={tour.title}
                className="w-full h-full object-cover"
                style={{ minHeight: 180, maxHeight: 224 }}
              />
              <div className="absolute bottom-0 left-0 w-full bg-black/50 py-3 px-2">
                <span className="text-white text-lg font-semibold drop-shadow text-center w-full block">
                  {tour.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
