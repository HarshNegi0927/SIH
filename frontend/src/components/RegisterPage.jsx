import React, { useState } from "react";

const plans = [
  {
    name: "Basic",
    price: "₹20,000",
    duration: "1 Year",
    description:
      "Digitize core institutional data and monitor academic performance efficiently.",
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
    description:
      "Gain deeper analytics, scheme integrations, and smart institutional insights.",
    features: [
      "Government scheme & grant tracking (PMSSS, NSP, etc.)",
      "Automated academic & attendance analytics",
      "Priority customer support",
    ],
  },
  {
    name: "Premium",
    price: "₹1,50,000",
    duration: "5 Years",
    description:
      "Full-scale analytics, AI-driven insights, and readiness for national rankings.",
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
  });

  const [showPlans, setShowPlans] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // ✅ allows cookie to be stored
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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-6 sm:px-10">
      {/* Registration Card */}
      <div
        className={`relative w-full max-w-5xl bg-white shadow-xl border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 ${
          showPlans ? "opacity-40 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="grid md:grid-cols-2">
          {/* Left Section */}
          <div className="bg-gray-900 text-white p-12 flex flex-col justify-center">
            <h1 className="text-4xl font-bold mb-4">Register Your Institution</h1>
            <p className="text-gray-300 text-base leading-relaxed">
              Join{" "}
              <span className="text-purple-400 font-semibold">SIHchronize</span>{" "}
              — a unified data platform for institutional management and
              performance tracking.
            </p>
          </div>

          {/* Right Section */}
          <div className="p-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Institution Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {["collegeName", "email", "password", "aisheCode"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700">
                    {field === "collegeName"
                      ? "College Name"
                      : field === "aisheCode"
                      ? "AISHE Code"
                      : field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type={field === "password" ? "password" : "text"}
                    name={field}
                    required
                    value={formData[field]}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    placeholder={
                      field === "collegeName"
                        ? "e.g. Delhi Institute of Technology"
                        : field === "aisheCode"
                        ? "Enter AISHE Code"
                        : ""
                    }
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  College Type
                </label>
                <select
                  name="collegeType"
                  value={formData.collegeType}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                >
                  <option>Government</option>
                  <option>Private</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md transition-all duration-300 disabled:opacity-60"
              >
                {loading ? "Registering..." : "Proceed to Plans"}
              </button>
            </form>

            {/* Message Box */}
            {message && (
              <div
                className={`mt-4 text-sm font-medium ${
                  message.startsWith("✅") ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Subscription Plans Modal */}
      {showPlans && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center backdrop-blur-sm z-50 px-6 py-12">
          <div className="max-w-6xl w-full grid md:grid-cols-3 gap-8 animate-fadeIn">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="rounded-xl border border-gray-200 bg-white shadow-lg hover:shadow-xl transition p-8 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">{plan.description}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-6">
                    {plan.price}
                    <span className="text-base font-medium text-gray-500 ml-1">
                      / {plan.duration}
                    </span>
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start">
                        <svg
                          className="w-4 h-4 text-purple-500 mr-2 mt-[3px]"
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
                  className="mt-8 w-full py-2 rounded-md font-medium text-white bg-purple-600 hover:bg-purple-700 transition"
                >
                  Choose {plan.name}
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowPlans(false)}
            className="absolute top-6 right-6 text-white bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-md text-sm font-medium transition"
          >
            ✕ Close
          </button>
        </div>
      )}
    </div>
  );
}
