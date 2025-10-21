import React, { useState, useEffect } from "react";

const plans = [
  {
    name: "Basic",
    price: "Rs.20,000",
    duration: "1 Year",
    description:
      "Digitize your institution’s core data and track academic progress efficiently.",
    features: [
      "Institution & student data registration",
      "Faculty & student lifecycle tracking",
      "Annual performance reports (PDF export)",
    ],
    style: "basic",
  },
  {
    name: "Gold",
    price: "Rs.80,000",
    duration: "3 Years",
    description:
      "Unlock deeper analytics, government scheme integration, and smart performance insights.",
    features: [
      "Government scheme & grant tracking (PMSSS, NSP, etc.)",
      "Automated academic & attendance analytics",
      "Priority customer support",
    ],
    style: "gold",
  },
  {
    name: "Premium",
    price: "Rs.1,50,000",
    duration: "5 Years",
    description:
      "Experience full-scale institutional analytics, AI-driven insights, and national ranking metrics.",
    features: [
      "NIRF & NAAC ranking readiness metrics",
      "Research & innovation performance tracking",
      "Dedicated success manager (24x7 support)",
    ],
    style: "silver",
  },
];

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    collegeName: "",
    collegeType: "Government",
    email: "",
    userId: "",
    password: "",
    aisheCode: "",
  });

  const [showPlans, setShowPlans] = useState(false);

  // ✅ Disable all scrolling when modal is open
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (showPlans) {
      html.classList.add("no-scroll");
      body.classList.add("no-scroll");
    } else {
      html.classList.remove("no-scroll");
      body.classList.remove("no-scroll");
    }

    return () => {
      html.classList.remove("no-scroll");
      body.classList.remove("no-scroll");
    };
  }, [showPlans]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("College Registration Data:", formData);
    setShowPlans(true);
  };

  const handlePayment = (plan) => {
    console.log("Proceeding to payment for:", plan);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "3rem",
        backgroundImage: "url('/images/18.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      {/* Registration Form */}
      <div
        className={`bg-black/70 backdrop-blur-lg rounded-3xl shadow-2xl flex flex-col md:flex-row w-full max-w-5xl overflow-hidden border border-gray-700 mb-16 transition-all duration-300 ${
          showPlans ? "opacity-40 blur-[1px] pointer-events-none" : ""
        }`}
      >
        <div className="flex-1 flex flex-col justify-center text-white p-14 md:p-16">
          <h1 className="text-5xl font-bold mb-6">Let’s Get Started</h1>
          <p className="text-gray-300 leading-relaxed text-lg">
            Join{" "}
            <span className="text-purple-400 font-semibold">SIHchronize</span>{" "}
            to unify and manage your institution’s educational data. Register
            your college, track performance metrics, and explore integrated
            analytics for smarter education.
          </p>
        </div>

        <div className="flex-1 bg-black/85 p-12 md:p-14">
          <h2 className="text-3xl font-semibold text-white mb-8 text-center">
            Register to SIHchronize!
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2">College Name</label>
              <input
                type="text"
                name="collegeName"
                value={formData.collegeName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-purple-400 outline-none"
                placeholder="Enter your college name"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">College Type</label>
              <select
                name="collegeType"
                value={formData.collegeType}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-purple-400 outline-none"
              >
                <option>Government</option>
                <option>Private</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                College Email ID
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-purple-400 outline-none"
                placeholder="example@college.ac.in"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-purple-400 outline-none"
                placeholder="Enter a secure password"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">AISHE Code</label>
              <input
                type="text"
                name="aisheCode"
                value={formData.aisheCode}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-purple-400 outline-none"
                placeholder="Enter your AISHE code"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-6 bg-purple-700 hover:bg-purple-600 text-white rounded-lg font-semibold transition-all duration-300"
            >
              Proceed to Payment
            </button>
          </form>
        </div>
      </div>

      {/* Subscription Plans Modal */}
      {showPlans && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 overflow-hidden">
          <div className="grid gap-6 max-w-6xl w-full md:grid-cols-3 mx-6">
            {plans.map(({ name, price, duration, description, features, style }) => (
              <div
                key={name}
                className={`flex flex-col rounded-2xl p-8 shadow-2xl border h-[460px] transition-transform duration-300 transform hover:scale-105 ${
                  style === "gold"
                    ? "bg-gradient-to-br from-yellow-300 via-yellow-100 to-yellow-400 text-gray-900 border-yellow-500 shadow-yellow-300"
                    : style === "silver"
                    ? "bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 text-gray-900 border-gray-400 shadow-gray-300"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <h2 className="text-2xl font-bold mb-3">{name}</h2>
                <p className="text-gray-700 text-sm mb-5 leading-snug">
                  {description}
                </p>

                <p className="text-4xl font-extrabold mb-6">{price}</p>

                <ul className="mb-8 space-y-2 flex-grow text-sm">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start leading-tight">
                      <svg
                        className="w-4 h-4 text-purple-700 mr-2 mt-[3px] flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded-lg text-sm font-semibold transition ${
                    style === "gold"
                      ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                      : style === "silver"
                      ? "bg-gray-500 hover:bg-gray-600 text-white"
                      : "bg-gray-900 hover:bg-gray-800 text-white"
                  }`}
                  onClick={() => handlePayment({ name, duration })}
                >
                  {style === "gold"
                    ? "Get Gold Plan"
                    : style === "silver"
                    ? "Get Premium Plan"
                    : `Choose ${name}`}
                </button>
              </div>
            ))}
          </div>

          {/* Close Button */}
          <button
            onClick={() => setShowPlans(false)}
            className="absolute top-8 right-8 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            ✕ Close
          </button>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
