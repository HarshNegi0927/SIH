import React, { useState, useEffect } from "react";
import { User, Mail, Phone, Github, Linkedin, Camera, Loader, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPut } from "../lib/api";

const EditProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    designation: "",
    institutionEmail: "",
    github: "",
    linkedin: "",
    portfolio: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // ── Load current profile ───────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiGet("/users/profile");
        const u = res.data;
        const p = u.profile || {};
        setFormData({
          firstName: p.firstName || "",
          lastName: p.lastName || "",
          email: u.email || "",
          phone: p.phone || "",
          address: p.address || "",
          designation: p.designation || "",
          institutionEmail: p.institutionEmail || "",
          github: p.socialLinks?.github || "",
          linkedin: p.socialLinks?.linkedin || "",
          portfolio: p.socialLinks?.portfolio || "",
        });
      } catch (err) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccessMsg("");

    const payload = {
      profile: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        designation: formData.designation,
        institutionEmail: formData.institutionEmail,
        socialLinks: {
          github: formData.github,
          linkedin: formData.linkedin,
          portfolio: formData.portfolio,
        },
      },
    };

    try {
      await apiPut("/users/profile", payload);
      setSuccessMsg("Profile updated!");
      setTimeout(() => navigate("/profile"), 800);
    } catch (err) {
      setError(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const fullName = `${formData.firstName} ${formData.lastName}`.trim() || formData.email || "User";

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-500">
          <Loader className="w-5 h-5 animate-spin" /> Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex justify-center py-10">
      <div className="w-full max-w-3xl bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-purple-100 p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
          <button
            onClick={() => navigate("/profile")}
            className="text-sm text-purple-600 hover:underline"
          >
            Cancel
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 text-sm text-red-700 bg-red-50 rounded-lg">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}
        {successMsg && (
          <div className="p-3 mb-4 text-sm text-green-700 bg-green-50 rounded-lg">
            {successMsg}
          </div>
        )}

        {/* Profile Picture */}
        <div className="flex items-center gap-6 mb-8">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <button className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow" title="Photo upload coming soon">
              <Camera className="w-4 h-4 text-purple-600" />
            </button>
          </div>
          <div>
            <p className="font-medium text-gray-900">{fullName}</p>
            <p className="text-sm text-gray-500">{formData.email}</p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">First Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email (read-only)</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input type="email" value={formData.email} disabled
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input type="text" name="phone" value={formData.phone} onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Designation</label>
            <input type="text" name="designation" value={formData.designation} onChange={handleChange}
              placeholder="e.g. B.Tech Student"
              className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Institution Email</label>
            <input type="email" name="institutionEmail" value={formData.institutionEmail} onChange={handleChange}
              className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
            <textarea name="address" value={formData.address} onChange={handleChange} rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">GitHub</label>
            <div className="relative">
              <Github className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input type="text" name="github" value={formData.github} onChange={handleChange}
                placeholder="github.com/username"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">LinkedIn</label>
            <div className="relative">
              <Linkedin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input type="text" name="linkedin" value={formData.linkedin} onChange={handleChange}
                placeholder="linkedin.com/in/username"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none" />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-500 text-white rounded-lg shadow hover:opacity-90 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
