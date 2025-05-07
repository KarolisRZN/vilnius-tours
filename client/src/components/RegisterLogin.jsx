import { useState } from "react";

function RegisterLogin() {
  const [tab, setTab] = useState("login");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Login successful!");
        // Save token or user info if needed
      } else {
        setError(data.message || "Login failed.");
      }
    } catch {
      setError("Network error.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Registration successful!");
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch {
      setError("Network error.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh] pt-24">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 rounded-l-lg font-semibold ${
              tab === "login"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setTab("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 rounded-r-lg font-semibold ${
              tab === "register"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setTab("register")}
          >
            Register
          </button>
        </div>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        {success && <div className="mb-4 text-green-600">{success}</div>}
        {tab === "login" ? (
          <form className="space-y-4" onSubmit={handleLogin}>
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <button
              type="submit"
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
            >
              Login
            </button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleRegister}>
            <input
              name="name"
              type="text"
              placeholder="Name"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <button
              type="submit"
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
            >
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default RegisterLogin;
