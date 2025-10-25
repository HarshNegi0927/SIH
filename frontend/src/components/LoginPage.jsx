import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const API_BASE = import.meta.env.VITE_API_URL || "";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const fetchPath = API_BASE
        ? `${API_BASE}/api/auth/login`
        : `/api/auth/login`;

      const res = await fetch(fetchPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");
      auth.login(data.user, data.token);

      navigate("/admin");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="grid flex-1 grid-cols-1 md:grid-cols-2">
        {/* Left side with cover image + overlay */}
        <div className="relative hidden md:block">
          <img
            src="/images/sih2-Picsart-AiImageEnhancer.jpg"
            alt="Login illustration"
            className="absolute inset-0 object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-purple-700/30 to-black/60"></div>

          <div className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center">
            <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">
              Welcome Back 🚀
            </h1>
            <p className="max-w-lg mt-4 text-lg text-gray-200">
              Log in to continue your journey with{" "}
              <span className="font-bold text-purple-300">SIHchronize</span>
            </p>
          </div>
        </div>

        {/* Right side with login form */}
        <div className="flex items-center justify-center px-6 bg-gradient-to-br from-gray-50 via-white to-gray-100">
          <div className="w-full max-w-lg p-12 space-y-8 transition duration-500 border border-gray-300 shadow-2xl rounded-3xl bg-white/90 backdrop-blur-md hover:shadow-purple-300/40">
            {/* Title */}
            <h2 className="text-4xl font-extrabold text-center text-transparent bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text">
              Login
            </h2>

            <p className="text-lg font-medium text-center text-gray-600">
              Welcome to{" "}
              <span className="font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                SIHchronize
              </span>
            </p>

            {error && (
              <p className="px-3 py-2 text-sm font-medium text-center text-red-600 rounded-md bg-red-50">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">
                  Email
                </label>
                <div className="flex items-center px-3 py-2 border rounded-xl focus-within:ring-2 focus-within:ring-purple-500 bg-gray-50">
                  <Mail className="w-5 h-5 text-purple-600" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-1 text-gray-800 placeholder-gray-400 bg-transparent outline-none"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="flex items-center px-3 py-2 border rounded-xl focus-within:ring-2 focus-within:ring-purple-500 bg-gray-50">
                  <Lock className="w-5 h-5 text-purple-600" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-1 text-gray-800 placeholder-gray-400 bg-transparent outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 font-semibold text-white transition-transform transform shadow-md rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* Footer link */}
            <p className="text-sm text-center text-gray-600">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-purple-600 hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Page footer */}
      <footer className="py-4 text-center border-t border-gray-300 bg-gradient-to-r from-gray-100 to-gray-200">
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} SIHchronize. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
