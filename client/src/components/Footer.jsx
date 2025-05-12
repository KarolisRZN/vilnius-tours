import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="w-full bg-green-700 text-white mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <img
            src="https://www.vividvilnius.lt/en/wp-content/uploads/sites/2/2016/04/Logo_vivid3-1.png?quality=100.3021072110190"
            alt="Vivid Vilnius Logo"
            className="h-10 md:h-12"
          />
          <span className="font-bold text-lg md:text-xl">Vivid Vilnius</span>
        </div>
        <nav className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-center">
          <Link
            to="/"
            className="hover:underline px-2 py-1 rounded hover:bg-green-800 transition"
          >
            Home
          </Link>
          <Link
            to="/tours"
            className="hover:underline px-2 py-1 rounded hover:bg-green-800 transition"
          >
            All Tours
          </Link>
          <Link
            to="/about"
            className="hover:underline px-2 py-1 rounded hover:bg-green-800 transition"
          >
            About Us
          </Link>
          <Link
            to="/reviews"
            className="hover:underline px-2 py-1 rounded hover:bg-green-800 transition"
          >
            Reviews
          </Link>
        </nav>
        <div className="text-center text-xs md:text-sm text-green-100">
          &copy; {new Date().getFullYear()} Vivid Vilnius. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
