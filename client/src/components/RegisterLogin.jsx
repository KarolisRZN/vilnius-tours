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
        localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("storage"));
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
        localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("storage"));
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch {
      setError("Network error.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4 bg-white">
      <div className="grid md:grid-cols-2 items-center gap-10 max-w-6xl max-md:max-w-md w-full">
        {/* Left side: Info and switch */}
        <div>
          <h2 className="lg:text-5xl text-3xl font-bold lg:leading-[57px] text-slate-900">
            Seamless {tab === "login" ? "Login" : "Registration"} for Exclusive
            Access
          </h2>
          <p className="text-sm mt-6 text-slate-500 leading-relaxed">
            Immerse yourself in a hassle-free{" "}
            {tab === "login" ? "login" : "registration"} journey with our
            intuitively designed form. Effortlessly access your account.
          </p>
          <p className="text-sm mt-12 text-slate-500">
            {tab === "login" ? (
              <>
                Don't have an account?
                <button
                  className="text-green-600 font-medium hover:underline ml-1"
                  onClick={() => setTab("register")}
                >
                  Register here
                </button>
              </>
            ) : (
              <>
                Already have an account?
                <button
                  className="text-green-600 font-medium hover:underline ml-1"
                  onClick={() => setTab("login")}
                >
                  Login here
                </button>
              </>
            )}
          </p>
        </div>

        {/* Right side: Form */}
        <form
          className="max-w-md md:ml-auto w-full bg-white rounded-lg shadow p-8"
          onSubmit={tab === "login" ? handleLogin : handleRegister}
        >
          <h3 className="text-slate-900 lg:text-3xl text-2xl font-bold mb-8">
            {tab === "login" ? "Sign in" : "Sign up"}
          </h3>

          {error && <div className="mb-4 text-red-600">{error}</div>}
          {success && <div className="mb-4 text-green-600">{success}</div>}

          <div className="space-y-6">
            {tab === "register" && (
              <div>
                <label className="text-sm text-slate-800 font-medium mb-2 block">
                  Name
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  className="bg-slate-100 w-full text-sm text-slate-800 px-4 py-3 rounded-md outline-none border focus:border-green-600 focus:bg-transparent"
                  placeholder="Enter Name"
                />
              </div>
            )}
            <div>
              <label className="text-sm text-slate-800 font-medium mb-2 block">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                className="bg-slate-100 w-full text-sm text-slate-800 px-4 py-3 rounded-md outline-none border focus:border-green-600 focus:bg-transparent"
                placeholder="Enter Email"
              />
            </div>
            <div>
              <label className="text-sm text-slate-800 font-medium mb-2 block">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                className="bg-slate-100 w-full text-sm text-slate-800 px-4 py-3 rounded-md outline-none border focus:border-green-600 focus:bg-transparent"
                placeholder="Enter Password"
              />
            </div>
            {tab === "login" && (
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-slate-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 block text-sm text-slate-500"
                  >
                    Remember me
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="!mt-12">
            <button
              type="submit"
              className="w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none"
            >
              {tab === "login" ? "Log in" : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterLogin;
