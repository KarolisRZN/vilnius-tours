import { useState } from "react";
import { Link } from "react-router";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-gray-200 border-b border-gray-300">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link
            to="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-8"
              alt="Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-gray-900">
              Vilnius Tours
            </span>
          </Link>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-700 rounded-lg md:hidden hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              aria-controls="navbar-cta"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
            <Link
              to="/register"
              className="hidden md:inline-block py-2 px-4 rounded-md text-white bg-green-600 hover:bg-green-700 font-semibold transition"
            >
              Sign Up
            </Link>
          </div>
          <div
            className={`items-center justify-between w-full md:flex md:w-auto ${
              menuOpen ? "flex" : "hidden"
            }`}
            id="navbar-cta"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-300 rounded-lg bg-gray-100 md:space-x-4 md:flex-row md:mt-0 md:border-0 md:bg-gray-200">
              <li>
                <Link
                  to="/"
                  className="block py-2 px-4 rounded-md text-white bg-green-600 hover:bg-green-700 md:bg-green-600 md:hover:bg-green-700 md:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li className="relative">
                <button
                  type="button"
                  className="flex items-center py-2 px-4 rounded-md text-white bg-green-600 hover:bg-green-700 md:bg-green-600 md:hover:bg-green-700 md:text-white"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
                >
                  Tours
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  className={`absolute left-0 z-10 mt-2 w-48 rounded-md shadow-lg bg-white border border-gray-200 ${
                    dropdownOpen ? "block" : "hidden"
                  }`}
                >
                  <ul className="py-1">
                    <li>
                      <Link
                        to="/tours-groups"
                        className="block px-4 py-2 text-gray-700 hover:bg-green-100"
                        onClick={() => {
                          setDropdownOpen(false);
                          setMenuOpen(false);
                        }}
                      >
                        Tours for Groups
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/tours-individuals"
                        className="block px-4 py-2 text-gray-700 hover:bg-green-100"
                        onClick={() => {
                          setDropdownOpen(false);
                          setMenuOpen(false);
                        }}
                      >
                        Tours for Individuals
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <Link
                  to="/about"
                  className="block py-2 px-4 rounded-md text-white bg-green-600 hover:bg-green-700 md:bg-green-600 md:hover:bg-green-700 md:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/reviews"
                  className="block py-2 px-4 rounded-md text-white bg-green-600 hover:bg-green-700 md:bg-green-600 md:hover:bg-green-700 md:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  Reviews
                </Link>
              </li>
              <li className="md:hidden">
                <Link
                  to="/register"
                  className="block py-2 px-4 rounded-md text-white bg-green-600 hover:bg-green-700 font-semibold transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="pt-24" />
    </>
  );
}

export default Navbar;
