// src/components/admin/InviteAdmins.jsx
import React, { useState } from "react";
import { useAuth } from "../../context/authContext";
import { CheckCircle, AlertCircle } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

export default function InviteAdmins() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    registrationNo: "",
    role: "faculty",
    department: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const payload = {
        ...formData,
        collegeName: user?.institutionInfo?.collegeName || "",
        collegeType: user?.institutionInfo?.collegeType || "Government",
        aisheCode: user?.institutionInfo?.aisheCode || "",
      };

      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      setResult({ success: true, message: `${formData.role === "faculty" ? "Faculty" : "Admin"} "${formData.firstName} ${formData.lastName}" registered successfully!` });
      setFormData({ firstName: "", lastName: "", email: "", password: "", registrationNo: "", role: "faculty", department: "" });
    } catch (err) {
      setResult({ success: false, message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl p-6 bg-white rounded-lg shadow">
      <h3 className="mb-1 text-lg font-semibold text-gray-800">Register Faculty / Sub-Admin</h3>
      <p className="mb-4 text-sm text-gray-500">
        Add a new faculty or admin to your institution ({user?.institutionInfo?.collegeName || "your college"}).
      </p>

      {result && (
        <div className={`flex items-start gap-2 p-3 rounded-lg mb-4 text-sm ${result.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {result.success ? <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
          {result.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
            <input name="firstName" value={formData.firstName} onChange={handleChange} required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-cyan-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input name="lastName" value={formData.lastName} onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-cyan-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-cyan-500" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
            <input name="registrationNo" value={formData.registrationNo} onChange={handleChange}
              placeholder="e.g. FAC2024001"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-cyan-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select name="department" value={formData.department} onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-cyan-500">
              <option value="">Select</option>
              <option value="CSE">Computer Science & Engg.</option>
              <option value="ECE">Electronics & Comm.</option>
              <option value="ME">Mechanical Engg.</option>
              <option value="CE">Civil Engg.</option>
              <option value="EE">Electrical Engg.</option>
              <option value="Administration">Administration</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
            <select name="role" value={formData.role} onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-cyan-500">
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required
              placeholder="Min 8 chars"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-cyan-500" />
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-2.5 text-white font-medium bg-cyan-600 rounded-lg hover:bg-cyan-700 disabled:opacity-50 transition-colors">
          {loading ? "Registering..." : `Register ${formData.role === "faculty" ? "Faculty" : "Admin"}`}
        </button>
      </form>
    </div>
  );
}
