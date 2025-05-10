import { Link } from "react-router";
import { FaCompass } from "react-icons/fa";

export default function TourCategoriesCards() {
  return (
    <section className="w-full flex flex-col items-center py-10 bg-white">
      <h2 className="text-3xl md:text-4xl font-bold mb-10 text-black text-center">
        Explore Our Tours
      </h2>
      <div className="flex flex-col md:flex-row gap-8 justify-center w-full max-w-5xl">
        {/* Group Tours */}
        <div className="flex-1 bg-gray-100 border rounded-xl shadow p-6 flex flex-col items-center">
          <div className="w-full flex justify-center mb-4">
            <div className="bg-green-500 rounded-t-md w-full flex justify-center py-4">
              <FaCompass size={32} className="text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-center mb-2">Group Tours</h3>
          <p className="text-center mb-4 text-gray-700">
            Book a tour for your group, event, or just for a fun time together!
          </p>
          <Link
            to="/tours-groups"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded shadow font-semibold transition"
          >
            Learn More
          </Link>
        </div>
        {/* Individual Tours */}
        <div className="flex-1 bg-gray-100 border rounded-xl shadow p-6 flex flex-col items-center">
          <div className="w-full flex justify-center mb-4">
            <div className="bg-green-500 rounded-t-md w-full flex justify-center py-4">
              <FaCompass size={32} className="text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-center mb-2">
            Individual Tours
          </h3>
          <p className="text-center mb-4 text-gray-700">
            Join a group as an individual and discover Vilnius with new friends!
          </p>
          <Link
            to="/tours-individuals"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded shadow font-semibold transition"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
