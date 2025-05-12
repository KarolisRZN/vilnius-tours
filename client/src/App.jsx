import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import RegisterLogin from "./components/RegisterLogin";
import NotFound from "./components/NotFound";
import ToursPage from "./pages/ToursPage";
import AdminPanel from "./pages/AdminPanel";
import TourDetails from "./pages/TourDetails";
import AccountSettings from "./pages/AccountSettings";
import Wallet from "./pages/Wallet";
import AdminBookingsTable from "./pages/AdminBookingTable";
import MyBookings from "./pages/MyBookings";
import ReviewsPage from "./pages/ReviewsPage";
import ToursGroups from "./pages/ToursGroups";
import ToursIndividuals from "./pages/ToursIndividuals";
import AboutUs from "./components/AboutUs";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";

// Helper to check admin
const isAdmin = () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return false;
  try {
    const user = JSON.parse(userStr);
    return user.role === "admin";
  } catch {
    return false;
  }
};

function App() {
  const [authChanged, setAuthChanged] = useState(0);

  useEffect(() => {
    const handler = () => setAuthChanged((v) => v + 1);
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<RegisterLogin />} />
            <Route path="/tours" element={<ToursPage />} />
            <Route path="/tours/:id" element={<TourDetails />} />
            <Route path="/account" element={<AccountSettings />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/admin-bookings" element={<AdminBookingsTable />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/tours-groups" element={<ToursGroups />} />
            <Route path="/tours-individuals" element={<ToursIndividuals />} />
            <Route path="/about" element={<AboutUs />} />
            <Route
              path="/admin"
              element={isAdmin() ? <AdminPanel /> : <Navigate to="/" replace />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <BackToTop />
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
