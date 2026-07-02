// src/components/faculty/FacultyProfile.jsx
import { useState, useEffect } from "react";
import {
  User, Mail, Phone, Building, Briefcase, Github, Linkedin,
  Edit2, Save, X, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader,
  BookOpen, Users
} from "lucide-react";
import { apiGet, apiPut } from "../../lib/api";

// ─────────────────────────────────────────────────────────────
// Small reusable field
// ─────────────────────────────────────────────────────────────
const Field = ({ label, icon: Icon, value, name, onChange, disabled, type = "text", placeholder = "" }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
      {label}
    </label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full ${Icon ? "pl-10" : "pl-4"} pr-4 py-2.5 border rounded-lg text-sm transition-colors
          ${disabled
            ? "bg-gray-50 text-gray-500 border-gray-200 cursor-not-allowed"
            : "bg-white text-gray-800 border-gray-300 focus:outline-none focus:border-[#0aa5b7] focus:ring-1 focus:ring-[#0aa5b7]"
          }`}
      />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────
export default function FacultyProfile() {
  const [profile, setProfile]       = useState(null);
  const [courses, setCourses]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [editing, setEditing]       = useState(false);
  const [saving, setSaving]         = useState(false);
  const [toast, setToast]           = useState(null); // { type: 'success'|'error', msg }

  // Password change state
  const [pwSection, setPwSection]   = useState(false);
  const [pwForm, setPwForm]         = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw]         = useState({ current: false, next: false, confirm: false });
  const [pwSaving, setPwSaving]     = useState(false);

  // Editable form state (mirrors what backend PUT /api/users/profile accepts)
  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "",
    designation: "", institutionEmail: "",
    address: "",
    github: "", linkedin: "", portfolio: "",
  });

  // ── Show toast then auto-dismiss ──────────────────────────
  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch profile + courses on mount ─────────────────────
  useEffect(() => {
    Promise.all([
      apiGet("/users/profile"),
      apiGet("/courses"),
    ])
      .then(([profileRes, coursesRes]) => {
        const u = profileRes.data;
        setProfile(u);
        setCourses(coursesRes.data || []);

        const p = u.profile || {};
        setForm({
          firstName:        p.firstName        || "",
          lastName:         p.lastName         || "",
          phone:            p.phone            || "",
          designation:      p.designation      || "",
          institutionEmail: p.institutionEmail  || "",
          address:          p.address          || "",
          github:           p.socialLinks?.github    || "",
          linkedin:         p.socialLinks?.linkedin  || "",
          portfolio:        p.socialLinks?.portfolio || "",
        });
      })
      .catch((err) => showToast("error", err.message || "Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // ── Save profile ─────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    try {
      // Only send fields that have a value — empty string fails backend min:2 validation
      const profilePayload = {};
      if (form.firstName)        profilePayload.firstName        = form.firstName;
      if (form.lastName)         profilePayload.lastName         = form.lastName;
      if (form.phone)            profilePayload.phone            = form.phone;
      if (form.designation)      profilePayload.designation      = form.designation;
      if (form.institutionEmail) profilePayload.institutionEmail = form.institutionEmail;
      if (form.address)          profilePayload.address          = form.address;
      profilePayload.socialLinks = {
        github:    form.github    || undefined,
        linkedin:  form.linkedin  || undefined,
        portfolio: form.portfolio || undefined,
      };

      const res = await apiPut("/users/profile", { profile: profilePayload });
      setProfile(res.data);
      setEditing(false);
      showToast("success", "Profile updated successfully!");
    } catch (err) {
      showToast("error", err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset form to current profile data
    const p = profile?.profile || {};
    setForm({
      firstName:        p.firstName        || "",
      lastName:         p.lastName         || "",
      phone:            p.phone            || "",
      designation:      p.designation      || "",
      institutionEmail: p.institutionEmail  || "",
      address:          p.address          || "",
      github:           p.socialLinks?.github    || "",
      linkedin:         p.socialLinks?.linkedin  || "",
      portfolio:        p.socialLinks?.portfolio || "",
    });
    setEditing(false);
  };

  // ── Change password ──────────────────────────────────────
  const handlePasswordChange = async () => {
    if (!pwForm.current || !pwForm.next) {
      showToast("error", "All password fields are required");
      return;
    }
    if (pwForm.next !== pwForm.confirm) {
      showToast("error", "New passwords do not match");
      return;
    }
    if (pwForm.next.length < 8) {
      showToast("error", "New password must be at least 8 characters");
      return;
    }
    setPwSaving(true);
    try {
      await apiPut("/users/profile/password", {
        currentPassword: pwForm.current,
        newPassword:     pwForm.next,
      });
      setPwForm({ current: "", next: "", confirm: "" });
      setPwSection(false);
      showToast("success", "Password changed successfully!");
    } catch (err) {
      showToast("error", err.message || "Failed to change password");
    } finally {
      setPwSaving(false);
    }
  };

  // ── Derived values ───────────────────────────────────────
  const fullName = profile
    ? `${profile.profile?.firstName || ""} ${profile.profile?.lastName || ""}`.trim() || profile.email
    : "";

  const totalStudents = courses.reduce((acc, c) => acc + (c.enrolledStudents?.length || 0), 0);
  const initials = fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "F";

  // ── Loading state ────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        <Loader className="w-6 h-6 animate-spin mr-2" />
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">

      {/* ── Toast ──────────────────────────────────────────── */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all
          ${toast.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {toast.type === "success"
            ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
            : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          {toast.msg}
        </div>
      )}

      {/* ── Header card with avatar + stats ────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Cover strip */}
        <div className="h-20 w-full" style={{ background: "linear-gradient(135deg, #0aa5b7 0%, #0d7f8f 100%)" }} />

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div className="w-20 h-20 rounded-full border-4 border-white shadow flex items-center justify-center text-white text-2xl font-bold"
              style={{ background: "#0aa5b7" }}>
              {initials}
            </div>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 transition"
                style={{ background: "#0aa5b7" }}
              >
                <Edit2 className="w-4 h-4" /> Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={handleCancelEdit}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 disabled:opacity-50"
                  style={{ background: "#0aa5b7" }}>
                  <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>

          {/* Name + role */}
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">{fullName}</h2>
            <p className="text-sm text-gray-500">
              {profile?.profile?.designation || "Faculty"} ·{" "}
              {profile?.institutionInfo?.collegeName || "Institution"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{profile?.email}</p>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 bg-cyan-50 rounded-lg border border-cyan-100">
              <div className="w-9 h-9 rounded-full bg-cyan-100 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-cyan-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-cyan-700">{courses.length}</p>
                <p className="text-xs text-gray-500">Courses Assigned</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
              <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">
                <Users className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-purple-700">{totalStudents}</p>
                <p className="text-xs text-gray-500">Students (electives)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Personal Info ───────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="First Name"    icon={User}     name="firstName"        value={form.firstName}        onChange={handleChange} disabled={!editing} />
          <Field label="Last Name"     icon={User}     name="lastName"         value={form.lastName}         onChange={handleChange} disabled={!editing} />
          <Field label="Email"         icon={Mail}     name="email"            value={profile?.email || ""}  onChange={() => {}}     disabled={true} />
          <Field label="Phone"         icon={Phone}    name="phone"            value={form.phone}            onChange={handleChange} disabled={!editing} placeholder="+91 XXXXX XXXXX" />
          <Field label="Designation"   icon={Briefcase} name="designation"     value={form.designation}      onChange={handleChange} disabled={!editing} placeholder="e.g. Assistant Professor" />
          <Field label="Institution Email" icon={Mail} name="institutionEmail" value={form.institutionEmail} onChange={handleChange} disabled={!editing} placeholder="faculty@college.edu" />
          <div className="md:col-span-2">
            <Field label="Address"     icon={Building} name="address"          value={form.address}          onChange={handleChange} disabled={!editing} placeholder="City, State" />
          </div>
        </div>
      </div>

      {/* ── Institution Info (read-only) ─────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
          Institution
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="College Name"  icon={Building} name="collegeName"  value={profile?.institutionInfo?.collegeName  || "—"} onChange={() => {}} disabled={true} />
          <Field label="College Type"  icon={Building} name="collegeType"  value={profile?.institutionInfo?.collegeType  || "—"} onChange={() => {}} disabled={true} />
          <Field label="AISHE Code"    icon={Building} name="aisheCode"    value={profile?.institutionInfo?.aisheCode    || "—"} onChange={() => {}} disabled={true} />
        </div>
      </div>

      {/* ── Social Links ─────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
          Social Links
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="GitHub"    icon={Github}   name="github"    value={form.github}    onChange={handleChange} disabled={!editing} placeholder="github.com/username" />
          <Field label="LinkedIn"  icon={Linkedin} name="linkedin"  value={form.linkedin}  onChange={handleChange} disabled={!editing} placeholder="linkedin.com/in/username" />
          <Field label="Portfolio" icon={Linkedin} name="portfolio" value={form.portfolio} onChange={handleChange} disabled={!editing} placeholder="yoursite.com" />
        </div>
      </div>

      {/* ── My Courses Summary ──────────────────────────────── */}
      {courses.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
            My Courses
          </h3>
          <div className="space-y-2">
            {courses.map((c) => (
              <div key={c._id} className="flex items-center justify-between px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                  <span className="text-sm font-semibold text-gray-800">{c.code}</span>
                  <span className="mx-2 text-gray-300">·</span>
                  <span className="text-sm text-gray-600">{c.name}</span>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded-full">Sem {c.semester}</span>
                  <span className={`px-2 py-0.5 rounded-full ${c.type === "core" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                    {c.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Change Password ──────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Change Password
          </h3>
          <button
            onClick={() => setPwSection((v) => !v)}
            className="text-sm font-medium flex items-center gap-1.5 text-gray-500 hover:text-gray-800"
          >
            <Lock className="w-4 h-4" />
            {pwSection ? "Cancel" : "Change"}
          </button>
        </div>

        {pwSection && (
          <div className="mt-4 space-y-3">
            {[
              { key: "current", label: "Current Password" },
              { key: "next",    label: "New Password" },
              { key: "confirm", label: "Confirm New Password" },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  {label}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPw[key] ? "text" : "password"}
                    value={pwForm[key]}
                    onChange={(e) => setPwForm((p) => ({ ...p, [key]: e.target.value }))}
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0aa5b7] focus:ring-1 focus:ring-[#0aa5b7]"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((p) => ({ ...p, [key]: !p[key] }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPw[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={handlePasswordChange}
              disabled={pwSaving}
              className="w-full py-2.5 text-sm font-medium text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition"
              style={{ background: "#0aa5b7" }}
            >
              {pwSaving ? "Updating..." : "Update Password"}
            </button>
          </div>
        )}
      </div>

    </div>
  );
}