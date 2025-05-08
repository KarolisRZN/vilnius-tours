import { useParams } from "react-router";
import { useEffect, useState } from "react";

export default function TourDetails() {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/tours/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTour(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!tour)
    return <div className="p-8 text-center text-red-600">Tour not found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded shadow mt-8">
      <h1 className="text-3xl font-bold mb-4 text-green-700">{tour.title}</h1>
      {tour.image && (
        <img
          src={tour.image}
          alt={tour.title}
          className="w-full h-64 object-cover rounded mb-4"
        />
      )}
      <p className="mb-2 text-gray-700">{tour.description}</p>
      <p className="mb-2 text-green-700 font-semibold">Price: {tour.price} €</p>
      <p className="mb-2 text-gray-600">Duration: {tour.duration}</p>
      <p className="mb-2 text-gray-500">Category: {tour.category}</p>
      {/* Add more fields as needed */}
    </div>
  );
}
