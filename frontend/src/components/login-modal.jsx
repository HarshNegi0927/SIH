"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

export default function LoginModal({ isOpen, onClose }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 18, stiffness: 220 }}
            className="relative w-full max-w-md mx-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-100"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg"
            >
              ✕
            </button>

            {/* Header */}
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Welcome Back 👋
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Login to your{" "}
                <span className="text-purple-600 font-semibold">
                  SIHchronize
                </span>{" "}
                account
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@college.ac.in"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 mt-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Login
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-4 text-center text-sm text-gray-500">
              <button
                type="button"
                onClick={() => alert("Password recovery feature coming soon!")}
                className="text-blue-600 hover:text-blue-700 font-medium mr-3"
              >
                Forgot Password?
              </button>
              <br />
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Register now
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
