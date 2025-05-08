import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { FaUserCircle } from "react-icons/fa";
import { Navigate } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const dropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Helper to check admin
  const checkAdmin = () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return false;
    try {
      const user = JSON.parse(userStr);
      return user.role === "admin";
    } catch {
      return false;
    }
  };

  // Check login status and role on mount
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    setIsLoggedIn(!!userStr);
    setIsAdmin(checkAdmin());
  }, []);

  // Listen for login/logout events from other tabs/windows
  useEffect(() => {
    const handleStorage = () => {
      const userStr = localStorage.getItem("user");
      setIsLoggedIn(!!userStr);
      setIsAdmin(checkAdmin());
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setIsAdmin(false);
    setMenuOpen(false);
    window.location.href = "/";
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-gray-200 border-b border-gray-300">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link
            to="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img
              src="https://www.vividvilnius.lt/en/wp-content/uploads/sites/2/2016/04/Logo_vivid3-1.png?quality=100.3021072110190"
              className="h-16"
              alt="Logo"
            />
          </Link>

          {/* All buttons on the right */}
          <div className="flex items-center space-x-2 ml-auto">
            {/* Desktop menu */}
            <ul className="hidden md:flex items-center space-x-2">
              <li>
                <Link
                  to="/about"
                  className="py-2 px-4 rounded-md text-white bg-green-600 hover:bg-green-700 font-semibold transition"
                >
                  About Us
                </Link>
              </li>
              <li className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  className="flex items-center py-2 px-4 rounded-md text-white bg-green-600 hover:bg-green-700 font-semibold transition"
                  onClick={() => setDropdownOpen((prev) => !prev)}
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
                        to="/tours"
                        className="block px-4 py-2 text-gray-700 hover:bg-green-100"
                        onClick={() => {
                          setDropdownOpen(false);
                          setMenuOpen(false);
                        }}
                      >
                        All Tours
                      </Link>
                    </li>
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
              {isAdmin && (
                <li>
                  <Link
                    to="/admin"
                    className="py-2 px-4 rounded-md text-white bg-red-600 hover:bg-red-700 font-semibold transition"
                  >
                    AdminPanel
                  </Link>
                </li>
              )}
              {!isLoggedIn ? (
                <li>
                  <Link
                    to="/register"
                    className="py-2 px-4 rounded-md text-white bg-green-600 hover:bg-green-700 font-semibold transition"
                  >
                    Sign Up
                  </Link>
                </li>
              ) : (
                <li className="relative" ref={userDropdownRef}>
                  <button
                    type="button"
                    tabIndex={0}
                    onClick={() => setUserDropdownOpen((prev) => !prev)}
                    onBlur={() =>
                      setTimeout(() => setUserDropdownOpen(false), 150)
                    }
                    className="flex items-center justify-center text-white bg-green-600 hover:bg-green-700 rounded-full w-10 h-10 focus:outline-none transition"
                  >
                    <FaUserCircle size={28} />
                  </button>
                  {/* User dropdown */}
                  <div
                    className={`absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-white border border-gray-200 z-50 ${
                      userDropdownOpen ? "block" : "hidden"
                    }`}
                  >
                    <ul className="py-1">
                      <li>
                        <Link
                          to="/account"
                          className="block px-4 py-2 text-gray-700 hover:bg-green-100"
                          tabIndex={0}
                          onClick={() => {
                            setUserDropdownOpen(false);
                          }}
                        >
                          Account Settings
                        </Link>
                      </li>
                      <li>
                        <button
                          type="button"
                          tabIndex={0}
                          onClick={() => {
                            setUserDropdownOpen(false);
                            handleLogout();
                          }}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-green-100"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <div className="pt-24" />
    </>
  );
}

export default Navbar;
