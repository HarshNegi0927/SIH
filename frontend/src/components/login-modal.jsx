// components/LoginModal.jsx
"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export default function LoginModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [remember, setRemember] = useState(false);

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // basic client-side validation
    if (!form.email || !form.password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // important: allow httpOnly cookie from backend
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // backend should return { message: "..." } on error
        throw new Error(data?.message || "Login failed");
      }

      // Success
      // Backend sets httpOnly cookie; backend also returns token in body if you configured it.
      // If you want client-side JWT access (not recommended for sensitive use),
      // you can store it in localStorage — optional.
      if (data.token && remember) {
        try {
          localStorage.setItem("token", data.token);
        } catch (err) {
          // ignore storage errors
        }
      }

      // Optionally, you might want to populate global user state here
      // e.g. setUser(data.user) if you have a context/store

      // close modal & redirect to appropriate dashboard based on role
      onClose();

      // choose destination: admin vs faculty/student
      const dest =
        data?.user?.role === "admin" || data?.user?.role === "super_admin"
          ? "/admin"
          : "/profile";

      // small timeout to allow modal close animation
      setTimeout(() => navigate(dest, { replace: true }), 200);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full max-w-md bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-100"
            initial={{ scale: 0.95, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 12 }}
            transition={{ type: "spring", damping: 18, stiffness: 220 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-heading"
          >
            <button
              onClick={onClose}
              aria-label="Close login dialog"
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            <div className="text-center mb-4">
              <h2 id="login-heading" className="text-2xl font-semibold text-gray-800">
                Welcome Back
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Login to your <span className="text-purple-600 font-medium">SIHchronize</span> account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="name@college.ac.in"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="inline-flex items-center text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={() => setRemember((r) => !r)}
                    className="mr-2 h-4 w-4 rounded border-gray-300 focus:ring-purple-500"
                  />
                  Remember token
                </label>

                <button
                  type="button"
                  onClick={() => {
                    // Optionally open a password recovery flow
                    alert("Password recovery coming soon.");
                  }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {error && <div className="text-sm text-red-600">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-md disabled:opacity-60"
              >
                {loading ? "Signing in…" : "Login"}
              </button>
            </form>

            <div className="mt-4 text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link to="/register" onClick={onClose} className="text-purple-600 hover:underline">
                Register now
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
