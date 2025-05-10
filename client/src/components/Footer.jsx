import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="w-full bg-green-700 text-white mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <img
            src="https://www.vividvilnius.lt/en/wp-content/uploads/sites/2/2016/04/Logo_vivid3-1.png?quality=100.3021072110190"
            alt="Vivid Vilnius Logo"
            className="h-12"
          />
          <span className="font-bold text-xl">Vivid Vilnius</span>
        </div>
        <nav className="flex flex-col md:flex-row gap-4 md:gap-8 text-center">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/tours" className="hover:underline">
            All Tours
          </Link>
          <Link to="/about" className="hover:underline">
            About Us
          </Link>
          <Link to="/reviews" className="hover:underline">
            Reviews
          </Link>
        </nav>
        <div className="text-center text-sm text-green-100">
          &copy; {new Date().getFullYear()} Vivid Vilnius. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
