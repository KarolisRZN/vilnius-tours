import React, { useEffect, useState } from "react";

function ToursPage() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tours")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched tours:", data);
        setTours(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching tours:", err);
        setTours([]);
        setLoading(false);
      });
  }, []);

  return (
    <section className="w-full bg-white py-10 px-4 flex flex-col items-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-green-700 text-center">
        All Tours In Vilnius
      </h2>
      {loading ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : tours.length === 0 ? (
        <p className="text-gray-500 text-center">No tours available.</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl w-full">
          {tours.map((tour) => (
            <div
              key={tour.id}
              className="bg-gray-50 rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col items-center"
            >
              <h3 className="text-xl font-semibold mb-2 text-green-800 text-center">
                {tour.title}
              </h3>
              <p className="text-gray-700 text-center mb-2">
                {tour.description}
              </p>
              {tour.price && (
                <p className="text-green-700 font-semibold mb-1">
                  Price: {tour.price} €
                </p>
              )}
              {tour.duration && (
                <p className="text-gray-600 mb-1">Duration: {tour.duration}</p>
              )}
              {tour.category && (
                <p className="text-gray-500 text-sm">
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

export default ToursPage;
