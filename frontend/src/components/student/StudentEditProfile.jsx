// src/components/student/StudentEditProfile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { apiGet, apiPut } from "../../lib/api";
import {
  User, Mail, Phone, BookOpen, GraduationCap,
  Github, Linkedin, Globe, Lock, Eye, EyeOff,
  CheckCircle, AlertCircle, Loader, Save, ArrowLeft
} from "lucide-react";

export default function StudentEditProfile() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState(null);

  // Personal info
  const [personal, setPersonal] = useState({
    firstName: "", lastName: "", phone: "", address: "",
    github: "", linkedin: "", portfolio: "",
  });

  // Academic info
  const [academic, setAcademic] = useState({
    program: "", department: "", yearOfAdmission: "",
    currentSemester: "", cgpa: "", totalCreditsEarned: "",
  });

  // Password
  const [pwOpen, setPwOpen]     = useState(false);
  const [pw, setPw]             = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw]     = useState({ current: false, next: false, confirm: false });
  const [pwSaving, setPwSaving] = useState(false);

  // Read-only display
  const [email, setEmail]       = useState("");

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    apiGet("/users/profile")
      .then(res => {
        const u = res.data;
        const p = u.profile || {};
        const a = u.academicInfo || {};
        setEmail(u.email || "");
        setPersonal({
          firstName:  p.firstName  || "",
          lastName:   p.lastName   || "",
          phone:      p.phone      || "",
          address:    p.address    || "",
          github:     p.socialLinks?.github    || "",
          linkedin:   p.socialLinks?.linkedin  || "",
          portfolio:  p.socialLinks?.portfolio || "",
        });
        setAcademic({
          program:            a.program            || "",
          department:         a.department         || "",
          yearOfAdmission:    a.yearOfAdmission    || "",
          currentSemester:    a.currentSemester    || "",
          cgpa:               a.cgpa               || "",
          totalCreditsEarned: a.totalCreditsEarned || "",
        });
      })
      .catch(err => showToast("error", err.message))
      .finally(() => setLoading(false));
  }, []);

  // Save personal info
  const savePersonal = async () => {
    setSaving(true);
    try {
      const payload = {};
      if (personal.firstName) payload.firstName = personal.firstName;
      if (personal.lastName)  payload.lastName  = personal.lastName;
      if (personal.phone)     payload.phone     = personal.phone;
      if (personal.address)   payload.address   = personal.address;
      payload.socialLinks = {
        github:    personal.github    || undefined,
        linkedin:  personal.linkedin  || undefined,
        portfolio: personal.portfolio || undefined,
      };
      await apiPut("/users/profile", { profile: payload });
      showToast("success", "Personal info updated!");
    } catch (err) {
      showToast("error", err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  // Save academic info
  const saveAcademic = async () => {
    setSaving(true);
    try {
      await apiPut("/users/profile/academic", {
        academicInfo: {
          program:            academic.program            || undefined,
          department:         academic.department         || undefined,
          yearOfAdmission:    academic.yearOfAdmission    ? Number(academic.yearOfAdmission)    : undefined,
          currentSemester:    academic.currentSemester    ? Number(academic.currentSemester)    : undefined,
          cgpa:               academic.cgpa               ? Number(academic.cgpa)               : undefined,
          totalCreditsEarned: academic.totalCreditsEarned ? Number(academic.totalCreditsEarned) : undefined,
        },
      });
      showToast("success", "Academic info updated!");
    } catch (err) {
      showToast("error", err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  // Change password
  const savePassword = async () => {
    if (!pw.current || !pw.next) return showToast("error", "All fields required");
    if (pw.next !== pw.confirm)  return showToast("error", "Passwords don't match");
    if (pw.next.length < 8)      return showToast("error", "Min 8 characters");
    setPwSaving(true);
    try {
      await apiPut("/users/profile/password", {
        currentPassword: pw.current,
        newPassword:     pw.next,
      });
      setPw({ current: "", next: "", confirm: "" });
      setPwOpen(false);
      showToast("success", "Password changed!");
    } catch (err) {
      showToast("error", err.message || "Failed to change password");
    } finally {
      setPwSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader className="w-6 h-6 animate-spin text-purple-600 mr-2" />
      <span className="text-gray-500">Loading profile...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium border
          ${toast.type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
          {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate("/profile")}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Profile
          </button>
          <span className="text-gray-300">|</span>
          <h1 className="text-sm font-semibold text-gray-800">Edit Profile</h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">

        {/* ── Personal Info ─────────────────────────────────── */}
        <Section title="Personal Information" icon={User}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="First Name" icon={User}
              value={personal.firstName}
              onChange={e => setPersonal(p => ({ ...p, firstName: e.target.value }))} />
            <Field label="Last Name" icon={User}
              value={personal.lastName}
              onChange={e => setPersonal(p => ({ ...p, lastName: e.target.value }))} />
            <Field label="Email (read-only)" icon={Mail} value={email} disabled />
            <Field label="Phone" icon={Phone}
              value={personal.phone}
              onChange={e => setPersonal(p => ({ ...p, phone: e.target.value }))}
              placeholder="+91 XXXXX XXXXX" />
            <div className="md:col-span-2">
              <Field label="Address" icon={User}
                value={personal.address}
                onChange={e => setPersonal(p => ({ ...p, address: e.target.value }))}
                placeholder="City, State" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Field label="GitHub" icon={Github}
              value={personal.github}
              onChange={e => setPersonal(p => ({ ...p, github: e.target.value }))}
              placeholder="github.com/username" />
            <Field label="LinkedIn" icon={Linkedin}
              value={personal.linkedin}
              onChange={e => setPersonal(p => ({ ...p, linkedin: e.target.value }))}
              placeholder="linkedin.com/in/..." />
            <Field label="Portfolio" icon={Globe}
              value={personal.portfolio}
              onChange={e => setPersonal(p => ({ ...p, portfolio: e.target.value }))}
              placeholder="yoursite.com" />
          </div>
          <div className="flex justify-end mt-4">
            <SaveBtn onClick={savePersonal} saving={saving} />
          </div>
        </Section>

        {/* ── Academic Info ─────────────────────────────────── */}
        <Section title="Academic Information" icon={GraduationCap}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Program</label>
              <select value={academic.program}
                onChange={e => setAcademic(p => ({ ...p, program: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-500 bg-white">
                <option value="">Select</option>
                {["B.Tech","M.Tech","BCA","MCA","MBA","B.Sc","M.Sc","PhD"].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Department</label>
              <select value={academic.department}
                onChange={e => setAcademic(p => ({ ...p, department: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-500 bg-white">
                <option value="">Select</option>
                {["CSE","ECE","ME","CE","EE","IT","MCA","MBA"].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Current Semester</label>
              <select value={academic.currentSemester}
                onChange={e => setAcademic(p => ({ ...p, currentSemester: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-500 bg-white">
                <option value="">Select</option>
                {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <Field label="Year of Admission" icon={BookOpen}
              type="number" value={academic.yearOfAdmission}
              onChange={e => setAcademic(p => ({ ...p, yearOfAdmission: e.target.value }))}
              placeholder="e.g. 2024" />
            <Field label="CGPA" icon={TrendingUpIcon}
              type="number" value={academic.cgpa}
              onChange={e => setAcademic(p => ({ ...p, cgpa: e.target.value }))}
              placeholder="e.g. 8.5" />
            <Field label="Total Credits Earned" icon={BookOpen}
              type="number" value={academic.totalCreditsEarned}
              onChange={e => setAcademic(p => ({ ...p, totalCreditsEarned: e.target.value }))}
              placeholder="e.g. 60" />
          </div>
          <div className="flex justify-end mt-4">
            <SaveBtn onClick={saveAcademic} saving={saving} />
          </div>
        </Section>

        {/* ── Change Password ────────────────────────────────── */}
        <Section title="Change Password" icon={Lock}>
          {!pwOpen ? (
            <button onClick={() => setPwOpen(true)}
              className="text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1.5">
              <Lock className="w-4 h-4" /> Change Password
            </button>
          ) : (
            <div className="space-y-3">
              {[
                { key: "current", label: "Current Password" },
                { key: "next",    label: "New Password" },
                { key: "confirm", label: "Confirm New Password" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPw[key] ? "text" : "password"}
                      value={pw[key]}
                      onChange={e => setPw(p => ({ ...p, [key]: e.target.value }))}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-500"
                    />
                    <button type="button"
                      onClick={() => setShowPw(p => ({ ...p, [key]: !p[key] }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPw[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex gap-2 pt-1">
                <SaveBtn onClick={savePassword} saving={pwSaving} label="Update Password" />
                <button onClick={() => { setPwOpen(false); setPw({ current: "", next: "", confirm: "" }); }}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </Section>

      </div>
    </div>
  );
}

// ─── Small reusable components ────────────────────────────────

function Section({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-5">
        <Icon className="w-4 h-4 text-purple-600" />
        <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Field({ label, icon: Icon, value, onChange, disabled, type = "text", placeholder = "" }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />}
        <input
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full ${Icon ? "pl-10" : "pl-4"} pr-4 py-2.5 border rounded-lg text-sm transition-colors
            ${disabled
              ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
              : "bg-white text-gray-800 border-gray-300 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200"
            }`}
        />
      </div>
    </div>
  );
}

function SaveBtn({ onClick, saving, label = "Save Changes" }) {
  return (
    <button onClick={onClick} disabled={saving}
      className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition"
      style={{ background: "#7c3aed" }}>
      {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
      {saving ? "Saving..." : label}
    </button>
  );
}

// Inline TrendingUp icon (avoiding import conflict)
function TrendingUpIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}