import React, { useState } from "react";
import { FaUniversity, FaEnvelope, FaLock, FaCode, FaEye, FaEyeSlash } from "react-icons/fa";

const plans = [
  {
    name: "Basic",
    price: "₹20,000",
    duration: "1 Year",
    description: "Digitize core institutional data and monitor academic performance efficiently.",
    features: [
      "Institution & student data registration",
      "Faculty & student lifecycle tracking",
      "Annual performance reports (PDF export)",
    ],
  },
  {
    name: "Gold",
    price: "₹80,000",
    duration: "3 Years",
    description: "Gain deeper analytics, scheme integrations, and smart institutional insights.",
    features: [
      "Government scheme & grant tracking (PMSSS, NSP, etc.)",
      "Automated academic & attendance analytics",
      "Priority customer support",
    ],
    popular: true,
  },
  {
    name: "Premium",
    price: "₹1,50,000",
    duration: "5 Years",
    description: "Full-scale analytics, AI-driven insights, and readiness for national rankings.",
    features: [
      "NIRF & NAAC ranking readiness metrics",
      "Research & innovation performance tracking",
      "Dedicated success manager (24x7 support)",
    ],
  },
];

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    collegeName: "",
    collegeType: "Government",
    email: "",
    password: "",
    aisheCode: "",
    role: "admin"
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPlans, setShowPlans] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      setMessage("✅ Institution registered successfully!");
      console.log("Registration success:", data);
      setShowPlans(true);
    } catch (error) {
      console.error("Registration error:", error);
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = (plan) => {
    console.log("Proceeding to payment for:", plan);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8fafc]">
      {/* Left Section - Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative h-full bg-gradient-to-br from-blue-900 via-blue-700 to-purple-600">
        <img
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
          alt="Educational institution"
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
        />
        <div className="relative z-10 flex flex-col justify-center px-24 text-white">
          <div className="mb-8 inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full w-fit border border-white/20 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span>Trusted by 500+ Institutions</span>
          </div>
          <h1 className="text-6xl font-extrabold mb-6 leading-tight tracking-tighter">
            Transform Your <br />
            <span className="text-blue-300">Institution.</span>
          </h1>
          <p className="text-xl text-blue-100/80 max-w-md leading-relaxed">
            Join SIHchronize — a unified data platform for institutional management and performance tracking.
          </p>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white relative overflow-y-auto">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10 opacity-60"></div>

        <div className="w-full max-w-[480px] space-y-6 py-10">
          <div className="space-y-2 text-left">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Register Institution</h2>
            <p className="text-slate-500 font-medium">Create your institutional account with SIHchronize.</p>
          </div>

          {/* College Type Toggle */}
          <div className="flex p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/50">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, collegeType: "Government" })}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
                formData.collegeType === "Government"
                  ? 'bg-white text-blue-700 shadow-[0_4px_12px_rgba(0,0,0,0.05)]'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Government
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, collegeType: "Private" })}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
                formData.collegeType === "Private"
                  ? 'bg-white text-blue-700 shadow-[0_4px_12px_rgba(0,0,0,0.05)]'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Private
            </button>
          </div>

          <div className="space-y-4">
            {/* College Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">College Name</label>
              <div className="relative group">
                <FaUniversity className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600" />
                <input
                  type="text"
                  name="collegeName"
                  placeholder="e.g. Delhi Institute of Technology"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all"
                  value={formData.collegeName}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* AISHE Code */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">AISHE Code</label>
              <div className="relative group">
                <FaCode className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600" />
                <input
                  type="text"
                  name="aisheCode"
                  placeholder="Enter AISHE Code"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all"
                  value={formData.aisheCode}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email</label>
              <div className="relative group">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600" />
                <input
                  type="email"
                  name="email"
                  placeholder="admin@institution.edu"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Message */}
            {message && (
              <div
                className={`p-3 rounded-xl text-sm font-medium ${
                  message.startsWith("✅")
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 mt-2 rounded-2xl shadow-lg shadow-blue-900/10 font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
            >
              {loading ? "Registering..." : "Proceed to Plans"}
            </button>
          </div>

          <p className="text-center text-sm text-slate-500 font-medium pt-2">
            Already registered?{" "}
            <a href="/login" className="text-blue-600 font-bold hover:underline underline-offset-4">
              Log In
            </a>
          </p>
        </div>
      </div>

      {/* Subscription Plans Modal */}
      {showPlans && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center backdrop-blur-sm z-50 px-6 py-12 overflow-y-auto">
          <div className="max-w-6xl w-full my-auto">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-2">Choose Your Plan</h2>
              <p className="text-blue-200">Select the perfect plan for your institution</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all p-8 flex flex-col justify-between relative ${
                    plan.popular ? "ring-4 ring-blue-400 scale-105" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-slate-500 text-sm mb-4 min-h-[40px]">{plan.description}</p>
                    <p className="text-4xl font-bold text-slate-900 mb-6">
                      {plan.price}
                      <span className="text-base font-medium text-slate-500 ml-1">
                        / {plan.duration}
                      </span>
                    </p>
                    <ul className="space-y-3 text-sm text-slate-700">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start">
                          <svg
                            className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handlePayment(plan)}
                    className={`mt-8 w-full py-3 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] ${
                      plan.popular
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-900/30"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                    }`}
                  >
                    Choose {plan.name}
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowPlans(false)}
              className="mt-8 mx-auto block text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6 py-2.5 rounded-xl text-sm font-bold transition-all border border-white/20"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
