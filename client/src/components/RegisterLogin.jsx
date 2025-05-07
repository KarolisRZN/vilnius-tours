import { useState } from "react";
import { useNavigate } from "react-router";

function RegisterLogin() {
  const [tab, setTab] = useState("login");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    const newErrors = {};

    if (tab === "register" && formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (tab === "register" && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");

    if (!validate()) return;

    const url =
      tab === "login"
        ? "http://localhost:5000/api/login"
        : "http://localhost:5000/api/register";

    const payload =
      tab === "login"
        ? {
            email: formData.email,
            password: formData.password,
          }
        : {
            name: formData.name,
            email: formData.email,
            password: formData.password,
          };

    setLoading(true);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setSuccess(
          tab === "login" ? "Login successful!" : "Registration successful!"
        );
        localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("storage"));
        setTimeout(() => navigate("/"), 1000);
      } else {
        setErrors({ server: data.message || "Submission failed." });
      }
    } catch {
      setLoading(false);
      setErrors({ server: "Network error. Please try again." });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4 bg-white">
      <div className="grid md:grid-cols-2 items-center gap-10 max-w-6xl max-md:max-w-md w-full">
        <div>
          <h2 className="lg:text-5xl text-3xl font-bold text-slate-900">
            Seamless {tab === "login" ? "Login" : "Registration"} for Exclusive
            Access
          </h2>
          <p className="text-sm mt-6 text-slate-500">
            Enjoy a smooth {tab === "login" ? "login" : "sign-up"} experience.
          </p>
          <p className="text-sm mt-12 text-slate-500">
            {tab === "login" ? (
              <>
                Don’t have an account?
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

        <form
          onSubmit={handleSubmit}
          className="max-w-md md:ml-auto w-full bg-white rounded-lg shadow p-8"
        >
          <h3 className="text-slate-900 lg:text-3xl text-2xl font-bold mb-8">
            {tab === "login" ? "Sign in" : "Sign up"}
          </h3>

          {errors.server && (
            <div className="mb-4 text-red-600">{errors.server}</div>
          )}
          {success && <div className="mb-4 text-green-600">{success}</div>}

          <div className="space-y-6">
            {tab === "register" && (
              <div>
                <label className="text-sm font-medium text-slate-800 block mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 text-sm rounded-md border outline-none ${
                    errors.name
                      ? "border-red-500"
                      : "border-slate-300 focus:border-green-600"
                  }`}
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-slate-800 block mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 text-sm rounded-md border outline-none ${
                  errors.email
                    ? "border-red-500"
                    : "border-slate-300 focus:border-green-600"
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="relative">
              <label className="text-sm font-medium text-slate-800 block mb-2">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 text-sm rounded-md border outline-none ${
                  errors.password
                    ? "border-red-500"
                    : "border-slate-300 focus:border-green-600"
                }`}
                placeholder="Enter password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {tab === "register" && (
              <div>
                <label className="text-sm font-medium text-slate-800 block mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 text-sm rounded-md border outline-none ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-slate-300 focus:border-green-600"
                  }`}
                  placeholder="Confirm password"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="mt-10">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 text-sm font-semibold rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none"
            >
              {loading ? "Loading..." : tab === "login" ? "Log in" : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterLogin;
