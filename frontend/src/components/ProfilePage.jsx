import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import {
  User, Mail, Phone, Github, Linkedin, Award, BookOpen,
  Users, Calendar, Star, TrendingUp, Edit, Plus,
  Bell, Moon, Sun, LogOut, X, Trash2, Loader, Briefcase,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const API = "/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .pp-root {
    min-height: 100vh;
    background: #F4F1FF;
    font-family: 'Sora', sans-serif;
    color: #1A1033;
  }

  .pp-header {
    background: #fff;
    border-bottom: 1px solid #E8E3FF;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 16px rgba(108,61,224,0.06);
  }
  .pp-header-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .pp-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
  }
  .pp-logo-mark {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, #6C3DE0, #9B6DFF);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: 700;
    font-size: 16px;
  }
  .pp-logo-text {
    font-size: 18px;
    font-weight: 700;
    color: #1A1033;
  }
  .pp-nav {
    display: flex;
    gap: 4px;
  }
  .pp-nav a {
    padding: 6px 14px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #6B7280;
    text-decoration: none;
    transition: all 0.15s;
  }
  .pp-nav a:hover { background: #EDE9FF; color: #6C3DE0; }
  .pp-nav a.active { background: #EDE9FF; color: #6C3DE0; }
  .pp-header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .pp-icon-btn {
    width: 36px;
    height: 36px;
    border-radius: 9px;
    border: 1px solid #E8E3FF;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #6B7280;
    transition: all 0.15s;
  }
  .pp-icon-btn:hover { background: #EDE9FF; color: #6C3DE0; border-color: #C4B5FF; }
  .pp-user-chip {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 12px 4px 4px;
    border: 1px solid #E8E3FF;
    border-radius: 99px;
    background: #fff;
    cursor: pointer;
    transition: all 0.15s;
  }
  .pp-user-chip:hover { border-color: #C4B5FF; background: #F9F7FF; }
  .pp-avatar-sm {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6C3DE0, #9B6DFF);
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .pp-avatar-sm img { width: 100%; height: 100%; object-fit: cover; }
  .pp-user-name { font-size: 13px; font-weight: 600; color: #1A1033; }
  .pp-user-role { font-size: 11px; color: #9B6DFF; }

  .pp-body {
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px 24px;
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 24px;
    align-items: start;
  }

  .pp-sidebar { display: flex; flex-direction: column; gap: 16px; }

  .pp-card {
    background: #fff;
    border-radius: 16px;
    border: 1px solid #E8E3FF;
    overflow: hidden;
  }

  .pp-profile-card {
    padding: 28px 24px;
    text-align: center;
    position: relative;
  }
  .pp-profile-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 72px;
    background: linear-gradient(135deg, #6C3DE0, #9B6DFF);
  }
  .pp-avatar-wrap {
    position: relative;
    display: inline-block;
    margin-bottom: 14px;
    margin-top: 24px;
  }
  .pp-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6C3DE0, #9B6DFF);
    border: 4px solid #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(108,61,224,0.25);
    position: relative;
    z-index: 1;
    overflow: hidden;
  }
  .pp-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .pp-online-dot {
    position: absolute;
    bottom: 3px; right: 3px;
    width: 14px; height: 14px;
    background: #10B981;
    border: 2px solid #fff;
    border-radius: 50%;
    z-index: 2;
  }
  .pp-name { font-size: 20px; font-weight: 700; color: #1A1033; margin-bottom: 4px; }
  .pp-roll { font-size: 12px; color: #9B6DFF; font-family: 'JetBrains Mono', monospace; margin-bottom: 6px; }
  .pp-dept { font-size: 13px; color: #6B7280; line-height: 1.5; margin-bottom: 4px; }
  .pp-institute { font-size: 12px; color: #9B6DFF; font-weight: 500; }

  .pp-contact-list { padding: 16px 20px; border-top: 1px solid #F3F0FF; }
  .pp-contact-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 0;
    font-size: 13px;
    color: #4B5563;
    border-bottom: 1px solid #F9F7FF;
  }
  .pp-contact-item:last-child { border-bottom: none; }
  .pp-contact-icon {
    width: 28px; height: 28px;
    background: #EDE9FF;
    border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    color: #6C3DE0;
    flex-shrink: 0;
  }
  .pp-social-row {
    display: flex;
    gap: 8px;
    padding: 12px 20px;
    border-top: 1px solid #F3F0FF;
  }
  .pp-social-btn {
    flex: 1;
    padding: 8px;
    border: 1px solid #E8E3FF;
    border-radius: 9px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 500;
    color: #4B5563;
    cursor: pointer;
    transition: all 0.15s;
    text-decoration: none;
  }
  .pp-social-btn:hover { background: #EDE9FF; border-color: #C4B5FF; color: #6C3DE0; }

  .pp-edit-btn {
    margin: 0 20px 16px;
    width: calc(100% - 40px);
    padding: 10px;
    background: linear-gradient(135deg, #6C3DE0, #9B6DFF);
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    transition: opacity 0.15s;
    font-family: 'Sora', sans-serif;
  }
  .pp-edit-btn:hover { opacity: 0.88; }

  .pp-stats-card { padding: 20px; }
  .pp-stats-title {
    font-size: 12px;
    font-weight: 600;
    color: #9B6DFF;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 14px;
  }
  .pp-stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .pp-stat {
    background: #F9F7FF;
    border: 1px solid #EDE9FF;
    border-radius: 12px;
    padding: 12px;
    text-align: center;
  }
  .pp-stat-value { font-size: 22px; font-weight: 700; line-height: 1; margin-bottom: 4px; }
  .pp-stat-label { font-size: 11px; color: #6B7280; font-weight: 500; }
  .pp-stat.purple .pp-stat-value { color: #6C3DE0; }
  .pp-stat.indigo .pp-stat-value { color: #4F46E5; }
  .pp-stat.green  .pp-stat-value { color: #10B981; }
  .pp-stat.amber  .pp-stat-value { color: #F59E0B; }

  .pp-main { display: flex; flex-direction: column; gap: 16px; }

  .pp-tabs {
    background: #fff;
    border-radius: 14px;
    border: 1px solid #E8E3FF;
    padding: 6px;
    display: flex;
    gap: 4px;
  }
  .pp-tab {
    flex: 1;
    padding: 9px 12px;
    border-radius: 10px;
    border: none;
    background: transparent;
    font-size: 13px;
    font-weight: 500;
    color: #6B7280;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    transition: all 0.15s;
    font-family: 'Sora', sans-serif;
  }
  .pp-tab:hover { background: #F4F1FF; color: #6C3DE0; }
  .pp-tab.active { background: #EDE9FF; color: #6C3DE0; font-weight: 600; }

  .pp-tab-content { display: flex; flex-direction: column; gap: 16px; }

  .pp-section {
    background: #fff;
    border-radius: 16px;
    border: 1px solid #E8E3FF;
    padding: 24px;
  }
  .pp-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
  }
  .pp-section-title {
    display: flex;
    align-items: center;
    gap: 9px;
    font-size: 15px;
    font-weight: 700;
    color: #1A1033;
  }
  .pp-section-icon {
    width: 30px; height: 30px;
    background: #EDE9FF;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    color: #6C3DE0;
  }
  .pp-add-btn {
    width: 28px; height: 28px;
    border-radius: 8px;
    border: 1.5px dashed #C4B5FF;
    background: transparent;
    display: flex; align-items: center; justify-content: center;
    color: #9B6DFF;
    cursor: pointer;
    transition: all 0.15s;
  }
  .pp-add-btn:hover { background: #EDE9FF; border-color: #6C3DE0; color: #6C3DE0; }

  .pp-chart-wrap {
    background: #F9F7FF;
    border-radius: 12px;
    border: 1px solid #EDE9FF;
    padding: 20px;
  }
  .pp-chart-source { font-size: 11px; color: #9CA3AF; text-align: center; margin-top: 10px; }

  .pp-ach-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .pp-ach-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px;
    background: #F9F7FF;
    border: 1px solid #EDE9FF;
    border-radius: 12px;
    transition: all 0.15s;
  }
  .pp-ach-item:hover { border-color: #C4B5FF; box-shadow: 0 2px 12px rgba(108,61,224,0.08); }
  .pp-ach-icon {
    width: 36px; height: 36px;
    background: linear-gradient(135deg, #6C3DE0, #9B6DFF);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .pp-ach-name { font-size: 13px; font-weight: 600; color: #1A1033; margin-bottom: 3px; }
  .pp-ach-meta { font-size: 11px; color: #6B7280; }
  .pp-ach-badge {
    margin-left: auto;
    padding: 3px 8px;
    background: #EDE9FF;
    border-radius: 99px;
    font-size: 10px;
    font-weight: 600;
    color: #6C3DE0;
    white-space: nowrap;
  }

  .pp-list { display: flex; flex-direction: column; gap: 10px; }
  .pp-list-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px;
    background: #F9F7FF;
    border: 1px solid #EDE9FF;
    border-radius: 12px;
    transition: all 0.15s;
  }
  .pp-list-item:hover { border-color: #C4B5FF; box-shadow: 0 2px 12px rgba(108,61,224,0.08); }
  .pp-list-icon {
    width: 36px; height: 36px;
    background: linear-gradient(135deg, #6C3DE0, #9B6DFF);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .pp-list-body { flex: 1; min-width: 0; }
  .pp-list-name { font-size: 13px; font-weight: 600; color: #1A1033; margin-bottom: 3px; }
  .pp-list-meta { font-size: 11px; color: #6B7280; }
  .pp-list-desc { font-size: 12px; color: #9CA3AF; margin-top: 4px; }
  .pp-delete-btn {
    width: 28px; height: 28px;
    border-radius: 7px;
    border: 1px solid #FDE8E8;
    background: #FFF5F5;
    display: flex; align-items: center; justify-content: center;
    color: #EF4444;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.15s;
  }
  .pp-delete-btn:hover { background: #FEE2E2; border-color: #FCA5A5; }

  .pp-empty {
    text-align: center;
    padding: 40px 20px;
    color: #9CA3AF;
  }
  .pp-empty-icon {
    width: 48px; height: 48px;
    background: #F4F1FF;
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 12px;
    color: #C4B5FF;
  }
  .pp-empty p { font-size: 13px; }

  .pp-modal-overlay {
    position: fixed; inset: 0;
    background: rgba(26,16,51,0.45);
    backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    z-index: 999;
    padding: 20px;
  }
  .pp-modal {
    background: #fff;
    border-radius: 20px;
    padding: 28px;
    width: 100%;
    max-width: 440px;
    box-shadow: 0 24px 64px rgba(108,61,224,0.18);
    animation: modal-in 0.2s ease;
  }
  @keyframes modal-in {
    from { opacity: 0; transform: scale(0.95) translateY(8px); }
    to   { opacity: 1; transform: scale(1)    translateY(0);   }
  }
  .pp-modal-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 20px;
  }
  .pp-modal-title { font-size: 17px; font-weight: 700; color: #1A1033; text-transform: capitalize; }
  .pp-modal-close {
    width: 30px; height: 30px;
    border: none; background: #F4F1FF;
    border-radius: 8px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #6B7280; transition: all 0.15s;
  }
  .pp-modal-close:hover { background: #EDE9FF; color: #6C3DE0; }

  .pp-input {
    width: 100%;
    padding: 10px 14px;
    border: 1.5px solid #E8E3FF;
    border-radius: 10px;
    font-size: 14px;
    font-family: 'Sora', sans-serif;
    color: #1A1033;
    background: #FAFAFE;
    margin-bottom: 10px;
    transition: border-color 0.15s;
    outline: none;
  }
  .pp-input:focus { border-color: #9B6DFF; background: #fff; }
  .pp-input::placeholder { color: #9CA3AF; }

  .pp-error {
    font-size: 12px;
    color: #EF4444;
    margin-bottom: 12px;
    padding: 8px 12px;
    background: #FFF5F5;
    border-radius: 8px;
    border: 1px solid #FEE2E2;
  }

  .pp-modal-actions {
    display: flex; gap: 10px;
    margin-top: 6px; justify-content: flex-end;
  }
  .pp-btn-cancel {
    padding: 9px 18px;
    border: 1.5px solid #E8E3FF;
    background: #fff;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    color: #6B7280;
    cursor: pointer;
    font-family: 'Sora', sans-serif;
    transition: all 0.15s;
  }
  .pp-btn-cancel:hover { border-color: #C4B5FF; color: #6C3DE0; }
  .pp-btn-submit {
    padding: 9px 20px;
    background: linear-gradient(135deg, #6C3DE0, #9B6DFF);
    border: none;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    color: #fff;
    cursor: pointer;
    font-family: 'Sora', sans-serif;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: opacity 0.15s;
  }
  .pp-btn-submit:hover { opacity: 0.88; }
  .pp-btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

  .pp-global-error {
    max-width: 1200px;
    margin: 24px auto;
    padding: 0 24px;
  }
  .pp-global-error-box {
    background: #FFF5F5;
    border: 1px solid #FEE2E2;
    border-radius: 12px;
    padding: 20px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
  .pp-global-error-text { font-size: 14px; color: #EF4444; font-weight: 500; }
  .pp-retry-btn {
    padding: 8px 16px;
    background: #EF4444;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Sora', sans-serif;
    white-space: nowrap;
  }

  @keyframes spin { to { transform: rotate(360deg); } }
  .pp-spin { animation: spin 1s linear infinite; }

  @media (max-width: 900px) {
    .pp-body { grid-template-columns: 1fr; }
    .pp-ach-grid { grid-template-columns: 1fr; }
    .pp-tabs { overflow-x: auto; }
    .pp-tab { flex: none; white-space: nowrap; }
  }
`;

// ── Auth helper — reads JWT from localStorage ─────────────────
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});

// ── Derive initials from profile object ───────────────────────
const getInitials = (profile) => {
  if (!profile) return "??";
  const f = profile.profile?.firstName?.[0] || "";
  const l = profile.profile?.lastName?.[0] || "";
  if (f || l) return (f + l).toUpperCase();
  return profile.email?.[0]?.toUpperCase() || "?";
};

// ── Reusable list item card ───────────────────────────────────
const ListItem = ({ icon: Icon, name, meta, desc, link, linkLabel, onDelete }) => (
  <div className="pp-list-item">
    <div className="pp-list-icon">
      <Icon size={16} color="#fff" />
    </div>
    <div className="pp-list-body">
      <div className="pp-list-name">{name}</div>
      {meta && <div className="pp-list-meta">{meta}</div>}
      {desc && <div className="pp-list-desc">{desc}</div>}
      {link && (
        <a href={link} target="_blank" rel="noreferrer"
          style={{ fontSize: "11px", color: "#6C3DE0", textDecoration: "underline", marginTop: "2px", display: "inline-block" }}>
          {linkLabel || "View"}
        </a>
      )}
    </div>
    <button className="pp-delete-btn" onClick={onDelete} title="Remove">
      <Trash2 size={12} />
    </button>
  </div>
);

// ── Verification Badge ───────────────────────────────────────
const VerifyBadge = ({ status }) => {
  const map = {
    pending:  { label: "Pending",  bg: "#FFF7ED", color: "#C2410C" },
    approved: { label: "Verified", bg: "#F0FDF4", color: "#15803D" },
    rejected: { label: "Rejected", bg: "#FEF2F2", color: "#B91C1C" },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "20px", background: s.bg, color: s.color, marginLeft: "6px" }}>
      {s.label}
    </span>
  );
};

// ── Empty state ───────────────────────────────────────────────
const EmptyState = ({ icon: Icon, label }) => (
  <div className="pp-empty">
    <div className="pp-empty-icon"><Icon size={22} /></div>
    <p>No {label} yet. Click <strong>+</strong> to add one.</p>
  </div>
);

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────
const ProfilePage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // UI state
  const [activeTab, setActiveTab]   = useState("academic");
  const [theme, setTheme]           = useState("light");

  // Server / data state
  const [profile, setProfile]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [globalError, setGlobalError] = useState("");

  // Modal state
  const [showModal, setShowModal]   = useState(false);
  const [modalType, setModalType]   = useState("");   // "certification" | "event" | "club"
  const [formData, setFormData]     = useState({});
  const [formError, setFormError]   = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ── Fetch profile ───────────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setGlobalError("");
    try {
      const res  = await fetch(`${API}/users/profile`, { headers: authHeaders() });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed to load profile");
      setProfile(json.data);
    } catch (err) {
      setGlobalError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  // ── Derived values ──────────────────────────────────────────
  const fullName = profile
    ? [profile.profile?.firstName, profile.profile?.lastName].filter(Boolean).join(" ") || profile.email
    : "";

  const academicInfo    = profile?.academicInfo    ?? {};
  const certifications  = profile?.certifications  ?? [];
  const events          = profile?.events          ?? [];
  const clubs           = profile?.clubs           ?? [];
  const projects        = profile?.projects        ?? [];
  const internships     = profile?.internships     ?? [];
  const awards          = profile?.awards          ?? [];
  const placements      = profile?.placements      ?? [];
  const achievements    = academicInfo?.achievements ?? [];


  const spiCpiData = (academicInfo?.pastSemesters ?? []).map((s, i) => ({
    sem: `Sem ${s.semesterNumber ?? i + 1}`,
    SPI: s.sgpa        ?? 0,
    CPI: academicInfo.cgpa ?? 0,
  }));

  // ── Modal helpers ───────────────────────────────────────────
  const openModal = (type) => {
    setModalType(type);
    setFormData({});
    setFormError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({});
    setFormError("");
  };

  const handleInput = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  // ── Submit: add cert / event / club ─────────────────────────
  const endpointOf = {
    certification: "/users/certifications", event: "/users/events", club: "/users/clubs",
    project: "/users/projects", internship: "/users/internships",
    award: "/users/awards", placement: "/users/placements",
  };
  const stateKeyOf = {
    certification: "certifications", event: "events", club: "clubs",
    project: "projects", internship: "internships", award: "awards", placement: "placements",
  };
  const requiredField = {
    certification: "title", event: "name", club: "club",
    project: "title", internship: "company", award: "title", placement: "company",
  };

  const handleSubmit = async () => {
    const reqField = requiredField[modalType];
    if (!formData[reqField]?.trim()) {
      setFormError(`${reqField.charAt(0).toUpperCase() + reqField.slice(1)} is required`);
      return;
    }
    setSubmitting(true);
    setFormError("");
    try {
      const res  = await fetch(`${API}${endpointOf[modalType]}`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Something went wrong");
      // Backend returns the updated full array — swap it in
      setProfile((prev) => ({ ...prev, [stateKeyOf[modalType]]: json.data }));
      closeModal();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete: remove cert / event / club ──────────────────────
  const paramOf = {
    certification: "certId", event: "eventId", club: "clubId",
    project: "projectId", internship: "internshipId", award: "awardId", placement: "placementId",
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm("Remove this entry?")) return;
    try {
      const res  = await fetch(`${API}${endpointOf[type]}/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Delete failed");
      setProfile((prev) => ({ ...prev, [stateKeyOf[type]]: json.data }));
    } catch (err) {
      alert(err.message);
    }
  };

  // ── Tabs config ─────────────────────────────────────────────
  const tabs = [
    { id: "academic",       label: "Academic",       icon: BookOpen  },
    { id: "certifications", label: "Certifications", icon: Award     },
    { id: "events",         label: "Events",         icon: Calendar  },
    { id: "activities",     label: "Clubs",          icon: Users     },
    { id: "projects",       label: "Projects",       icon: TrendingUp },
    { id: "internships",    label: "Internships",    icon: Briefcase  },
    { id: "awards",         label: "Awards",         icon: Star       },
    { id: "placements",     label: "Placements",     icon: Award      },
  ];

  // ── Full-page loading spinner ────────────────────────────────
  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="pp-root" style={{
        display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", flexDirection: "column", gap: 16,
      }}>
        <Loader size={36} color="#6C3DE0" className="pp-spin" />
        <span style={{ fontSize: 14, color: "#6B7280" }}>Loading your profile…</span>
      </div>
    </>
  );

  // ─────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────
  return (
    <>
      <style>{styles}</style>
      <div className="pp-root">

        {/* ══════════════ HEADER ══════════════ */}
        <header className="pp-header">
          <div className="pp-header-inner">
            <a href="#" className="pp-logo">
              <div className="pp-logo-mark">S</div>
              <span className="pp-logo-text">SIHchronize</span>
            </a>

            <nav className="pp-nav">
              <a href="#" onClick={(e) => { e.preventDefault(); navigate(profile?.role === "student" ? "/student" : profile?.role === "faculty" ? "/faculty" : "/"); }} style={{cursor:"pointer"}}>Dashboard</a>
              <a href="#" className="active">Profile</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate(profile?.role === "student" ? "/student" : profile?.role === "faculty" ? "/faculty" : "/"); }} style={{cursor:"pointer"}}>Courses</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab("certifications"); }} style={{cursor:"pointer"}}>Activities</a>
            </nav>

            <div className="pp-header-actions">
              <button className="pp-icon-btn" title="Notifications">
                <Bell size={16} />
              </button>
              <button
                className="pp-icon-btn"
                title="Toggle theme"
                onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
              >
                {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
              </button>

              <div className="pp-user-chip">
                <div className="pp-avatar-sm">
                  {profile?.profile?.profileImage
                    ? <img src={profile.profile.profileImage} alt="avatar" />
                    : getInitials(profile)
                  }
                </div>
                <div>
                  <div className="pp-user-name">{fullName || "—"}</div>
                  <div className="pp-user-role" style={{ textTransform: "capitalize" }}>
                    {profile?.role || ""}
                  </div>
                </div>
              </div>


              <button className="pp-icon-btn" title="Log out" onClick={() => { logout(); navigate("/login"); }}>
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* Global error banner */}
        {globalError && (
          <div className="pp-global-error">
            <div className="pp-global-error-box">
              <span className="pp-global-error-text">⚠ {globalError}</span>
              <button className="pp-retry-btn" onClick={fetchProfile}>Retry</button>
            </div>
          </div>
        )}

        {/* ══════════════ BODY ══════════════ */}
        <div className="pp-body">

          {/* ─── SIDEBAR ─── */}
          <aside className="pp-sidebar">

            {/* Profile card */}
            <div className="pp-card">
              <div className="pp-profile-card">
                <div className="pp-avatar-wrap">
                  <div className="pp-avatar">
                    {profile?.profile?.profileImage
                      ? <img src={profile.profile.profileImage} alt="Profile" />
                      : <User size={32} color="#fff" />
                    }
                  </div>
                  <div className="pp-online-dot" />
                </div>
                <div className="pp-name">{fullName || "—"}</div>
                <div className="pp-roll">{profile?.RegistrationNo || ""}</div>
                <div className="pp-dept">
                  {[academicInfo.program, academicInfo.department].filter(Boolean).join(" · ") || "—"}
                </div>
                <div className="pp-institute">
                  {profile?.institutionInfo?.collegeName || ""}
                </div>
              </div>

              {/* Contact */}
              <div className="pp-contact-list">
                {profile?.email && (
                  <div className="pp-contact-item">
                    <span className="pp-contact-icon"><Mail size={13} /></span>
                    {profile.email}
                  </div>
                )}
                {profile?.profile?.institutionEmail && (
                  <div className="pp-contact-item">
                    <span className="pp-contact-icon"><Mail size={13} /></span>
                    {profile.profile.institutionEmail}
                  </div>
                )}
                {profile?.profile?.phone && (
                  <div className="pp-contact-item">
                    <span className="pp-contact-icon"><Phone size={13} /></span>
                    {profile.profile.phone}
                  </div>
                )}
              </div>

              {/* Social links */}
              {(profile?.profile?.socialLinks?.linkedin || profile?.profile?.socialLinks?.github) && (
                <div className="pp-social-row">
                  {profile.profile.socialLinks.linkedin && (
                    <a
                      href={profile.profile.socialLinks.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="pp-social-btn"
                    >
                      <Linkedin size={13} /> LinkedIn
                    </a>
                  )}
                  {profile.profile.socialLinks.github && (
                    <a
                      href={profile.profile.socialLinks.github}
                      target="_blank"
                      rel="noreferrer"
                      className="pp-social-btn"
                    >
                      <Github size={13} /> GitHub
                    </a>
                  )}
                  {profile.profile.socialLinks.portfolio && (
                    <a
                      href={profile.profile.socialLinks.portfolio}
                      target="_blank"
                      rel="noreferrer"
                      className="pp-social-btn"
                    >
                      🌐 Portfolio
                    </a>
                  )}
                </div>
              )}

              <button className="pp-edit-btn" onClick={() => navigate(profile?.role === "student" ? "/student/edit" : "/profile/edit")}>
                <Edit size={14} /> Edit Profile
              </button>
            </div>

            {/* Stats card */}
            <div className="pp-card">
              <div className="pp-stats-card">
                <div className="pp-stats-title">Quick Stats</div>
                <div className="pp-stats-grid">
                  <div className="pp-stat purple">
                    <div className="pp-stat-value">
                      {academicInfo.cgpa != null ? academicInfo.cgpa.toFixed(2) : "—"}
                    </div>
                    <div className="pp-stat-label">CGPA</div>
                  </div>
                  <div className="pp-stat indigo">
                    <div className="pp-stat-value">
                      {academicInfo.totalCreditsEarned ?? "—"}
                    </div>
                    <div className="pp-stat-label">Credits</div>
                  </div>
                  <div className="pp-stat green">
                    <div className="pp-stat-value">
                      {academicInfo.currentSemester ? `Sem ${academicInfo.currentSemester}` : "—"}
                    </div>
                    <div className="pp-stat-label">Current</div>
                  </div>
                  <div className="pp-stat amber">
                    <div className="pp-stat-value">
                      {certifications.length + events.length + clubs.length}
                    </div>
                    <div className="pp-stat-label">Activities</div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* ─── MAIN ─── */}
          <main className="pp-main">

            {/* Tabs */}
            <div className="pp-tabs">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  className={`pp-tab${activeTab === id ? " active" : ""}`}
                  onClick={() => setActiveTab(id)}
                >
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="pp-tab-content">

              {/* ══ ACADEMIC TAB ══ */}
              {activeTab === "academic" && (
                <>
                  {/* SPI / CPI chart — only if there is semester data */}
                  {spiCpiData.length > 0 && (
                    <div className="pp-section">
                      <div className="pp-section-header">
                        <div className="pp-section-title">
                          <span className="pp-section-icon"><TrendingUp size={15} /></span>
                          SPI &amp; CPI Trend
                        </div>
                      </div>
                      <div className="pp-chart-wrap">
                        <ResponsiveContainer width="100%" height={260}>
                          <LineChart data={spiCpiData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#EDE9FF" />
                            <XAxis
                              dataKey="sem"
                              stroke="#9B6DFF"
                              tick={{ fontSize: 12, fontFamily: "Sora" }}
                            />
                            <YAxis
                              domain={[5, 10]}
                              stroke="#9B6DFF"
                              tick={{ fontSize: 12, fontFamily: "Sora" }}
                            />
                            <Tooltip
                              contentStyle={{
                                background: "#fff",
                                border: "1px solid #EDE9FF",
                                borderRadius: 12,
                                fontSize: 13,
                                fontFamily: "Sora",
                              }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="SPI" stroke="#9B6DFF" strokeWidth={2} />
                            <Line type="monotone" dataKey="CPI" stroke="#4F46E5" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* Achievement Summary */}
                  <div className="pp-section">
                    <div className="pp-section-header">
                      <div className="pp-section-title">
                        <span className="pp-section-icon"><Star size={15} /></span>
                        Achievement Summary
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "12px", marginTop: "8px" }}>
                      {[
                        { label: "Certifications", count: certifications.filter(c => c.verification?.status === "approved").length, total: certifications.length, color: "#7C3AED" },
                        { label: "Projects",       count: projects.filter(p => p.verification?.status === "approved").length,       total: projects.length,       color: "#0AA5B7" },
                        { label: "Internships",    count: internships.filter(i => i.verification?.status === "approved").length,    total: internships.length,    color: "#059669" },
                        { label: "Awards",         count: awards.filter(a => a.verification?.status === "approved").length,         total: awards.length,         color: "#D97706" },
                        { label: "Placements",     count: placements.filter(p => p.verification?.status === "approved").length,     total: placements.length,     color: "#DC2626" },
                        { label: "Events",         count: events.length, total: events.length, color: "#7C3AED" },
                        { label: "Clubs",          count: clubs.length,  total: clubs.length,  color: "#0AA5B7" },
                      ].map(({ label, count, total, color }) => (
                        <div key={label} style={{ background: "#F9F7FF", border: "1px solid #EDE9FF", borderRadius: "12px", padding: "14px 12px", textAlign: "center" }}>
                          <div style={{ fontSize: "22px", fontWeight: 800, color }}>{count}</div>
                          <div style={{ fontSize: "11px", color: "#6B7280", marginTop: "2px" }}>{label}</div>
                          {total > count && <div style={{ fontSize: "10px", color: "#F59E0B", marginTop: "2px" }}>{total - count} pending</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* ══ CERTIFICATIONS TAB ══ */}
              {activeTab === "certifications" && (
                <div className="pp-section">
                  <div className="pp-section-header">
                    <div className="pp-section-title">
                      <span className="pp-section-icon"><Award size={15} /></span>
                      Certifications
                    </div>
                    <button className="pp-add-btn" onClick={() => openModal("certification")}>
                      <Plus size={16} />
                    </button>
                  </div>
                  {certifications.length > 0 ? (
                    <div className="pp-list">
                      {certifications.map((cert) => (
                        <ListItem
                          key={cert._id}
                          icon={Award}
                          name={cert.title}
                          meta={cert.issuedBy || ""}
                          desc={cert.issuedDate ? new Date(cert.issuedDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : ""}
                          link={cert.fileUrl || ""}
                          linkLabel="View Certificate"
                          onDelete={() => handleDelete("certification", cert._id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState icon={Award} label="certifications" />
                  )}
                </div>
              )}

              {/* ══ EVENTS TAB ══ */}
              {activeTab === "events" && (
                <div className="pp-section">
                  <div className="pp-section-header">
                    <div className="pp-section-title">
                      <span className="pp-section-icon"><Calendar size={15} /></span>
                      Events
                    </div>
                    <button className="pp-add-btn" onClick={() => openModal("event")}>
                      <Plus size={16} />
                    </button>
                  </div>
                  {events.length > 0 ? (
                    <div className="pp-list">
                      {events.map((evt) => (
                        <ListItem
                          key={evt._id}
                          icon={Calendar}
                          name={evt.name}
                          meta={evt.role}
                          desc={evt.date}
                          onDelete={() => handleDelete("event", evt._id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState icon={Calendar} label="events" />
                  )}
                </div>
              )}

              {/* ══ CLUBS TAB ══ */}
              {activeTab === "activities" && (
                <div className="pp-section">
                  <div className="pp-section-header">
                    <div className="pp-section-title">
                      <span className="pp-section-icon"><Users size={15} /></span>
                      Clubs
                    </div>
                    <button className="pp-add-btn" onClick={() => openModal("club")}>
                      <Plus size={16} />
                    </button>
                  </div>
                  {clubs.length > 0 ? (
                    <div className="pp-list">
                      {clubs.map((club) => (
                        <ListItem
                          key={club._id}
                          icon={Users}
                          name={club.club}
                          meta={club.role}
                          desc=""
                          onDelete={() => handleDelete("club", club._id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState icon={Users} label="clubs" />
                  )}
                </div>
              )}

              {/* ══ PROJECTS ══ */}
              {activeTab === "projects" && (
                <div className="pp-section">
                  <div className="pp-section-header">
                    <div className="pp-section-title"><span className="pp-section-icon"><TrendingUp size={15} /></span>Projects</div>
                    <button className="pp-add-btn" onClick={() => openModal("project")}><Plus size={16} /></button>
                  </div>
                  {projects.length > 0 ? (
                    <div className="pp-list">
                      {projects.map(p => (
                        <ListItem key={p._id} icon={TrendingUp}
                          name={<span>{p.title} <VerifyBadge status={p.verification?.status} /></span>}
                          meta={p.techStack ? `Tech: ${p.techStack}` : ""}
                          desc={[p.year, p.description].filter(Boolean).join(" · ")}
                          link={p.githubUrl || p.liveUrl || ""}
                          linkLabel={p.githubUrl ? "GitHub" : "Live Demo"}
                          onDelete={() => handleDelete("project", p._id)}
                        />
                      ))}
                    </div>
                  ) : <EmptyState icon={TrendingUp} label="projects" />}
                </div>
              )}

              {/* ══ INTERNSHIPS ══ */}
              {activeTab === "internships" && (
                <div className="pp-section">
                  <div className="pp-section-header">
                    <div className="pp-section-title"><span className="pp-section-icon"><Briefcase size={15} /></span>Internships</div>
                    <button className="pp-add-btn" onClick={() => openModal("internship")}><Plus size={16} /></button>
                  </div>
                  {internships.length > 0 ? (
                    <div className="pp-list">
                      {internships.map(i => (
                        <ListItem key={i._id} icon={Briefcase}
                          name={<span>{i.company} <VerifyBadge status={i.verification?.status} /></span>}
                          meta={[i.role, i.stipend ? `₹${i.stipend}` : ""].filter(Boolean).join(" · ")}
                          desc={[
                            i.startDate ? new Date(i.startDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "",
                            i.endDate   ? new Date(i.endDate).toLocaleDateString("en-IN",   { month: "short", year: "numeric" }) : "",
                          ].filter(Boolean).join(" – ")}
                          link={i.offerLetterUrl || ""}
                          linkLabel="Offer Letter"
                          onDelete={() => handleDelete("internship", i._id)}
                        />
                      ))}
                    </div>
                  ) : <EmptyState icon={Briefcase} label="internships" />}
                </div>
              )}

              {/* ══ AWARDS ══ */}
              {activeTab === "awards" && (
                <div className="pp-section">
                  <div className="pp-section-header">
                    <div className="pp-section-title"><span className="pp-section-icon"><Star size={15} /></span>Awards & Achievements</div>
                    <button className="pp-add-btn" onClick={() => openModal("award")}><Plus size={16} /></button>
                  </div>
                  {awards.length > 0 ? (
                    <div className="pp-list">
                      {awards.map(a => (
                        <ListItem key={a._id} icon={Star}
                          name={<span>{a.title} <VerifyBadge status={a.verification?.status} /></span>}
                          meta={[a.issuedBy, a.year].filter(Boolean).join(", ")}
                          desc={a.description || ""}
                          link={a.proofUrl || ""}
                          linkLabel="View Proof"
                          onDelete={() => handleDelete("award", a._id)}
                        />
                      ))}
                    </div>
                  ) : <EmptyState icon={Star} label="awards" />}
                </div>
              )}

              {/* ══ PLACEMENTS ══ */}
              {activeTab === "placements" && (
                <div className="pp-section">
                  <div className="pp-section-header">
                    <div className="pp-section-title"><span className="pp-section-icon"><Award size={15} /></span>Placements</div>
                    <button className="pp-add-btn" onClick={() => openModal("placement")}><Plus size={16} /></button>
                  </div>
                  {placements.length > 0 ? (
                    <div className="pp-list">
                      {placements.map(pl => (
                        <ListItem key={pl._id} icon={Award}
                          name={<span>{pl.company} <VerifyBadge status={pl.verification?.status} /></span>}
                          meta={[pl.role, pl.package].filter(Boolean).join(" · ")}
                          desc={pl.joiningDate ? `Joining: ${new Date(pl.joiningDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}` : ""}
                          link={pl.offerLetterUrl || ""}
                          linkLabel="Offer Letter"
                          onDelete={() => handleDelete("placement", pl._id)}
                        />
                      ))}
                    </div>
                  ) : <EmptyState icon={Award} label="placements" />}
                </div>
              )}

            </div>
          </main>
        </div>

        {/* ══ MODALS ══ */}
        {showModal && (
          <div className="pp-modal-overlay" onClick={closeModal}>
            <div className="pp-modal" onClick={(e) => e.stopPropagation()}>
              <div className="pp-modal-header">
                <div className="pp-modal-title">Add {modalType}</div>
                <button className="pp-modal-close" onClick={closeModal}>
                  <X size={16} />
                </button>
              </div>

              {formError && <div className="pp-error">{formError}</div>}

              {modalType === "certification" && (
                <>
                  <input className="pp-input" placeholder="Title *" onChange={handleInput("title")} value={formData.title || ""} />
                  <input className="pp-input" placeholder="Issued By (e.g. Coursera, NPTEL)" onChange={handleInput("issuedBy")} value={formData.issuedBy || ""} />
                  <input className="pp-input" type="date" placeholder="Issue Date" onChange={handleInput("issuedDate")} value={formData.issuedDate || ""} />
                  <input className="pp-input" placeholder="Certificate URL (optional)" onChange={handleInput("fileUrl")} value={formData.fileUrl || ""} />
                </>
              )}

              {modalType === "event" && (
                <>
                  <input className="pp-input" placeholder="Event Name *" onChange={handleInput("name")} value={formData.name || ""} />
                  <input className="pp-input" placeholder="Your Role (e.g. Participant, Organizer)" onChange={handleInput("role")} value={formData.role || ""} />
                  <input className="pp-input" placeholder="Year (e.g. 2024)" onChange={handleInput("year")} value={formData.year || ""} />
                  <input className="pp-input" placeholder="Description (optional)" onChange={handleInput("description")} value={formData.description || ""} />
                </>
              )}

              {modalType === "club" && (
                <>
                  <input className="pp-input" placeholder="Club / Society Name *" onChange={handleInput("club")} value={formData.club || ""} />
                  <input className="pp-input" placeholder="Your Role (e.g. Member, President)" onChange={handleInput("role")} value={formData.role || ""} />
                </>
              )}

              {modalType === "project" && (
                <>
                  <input className="pp-input" placeholder="Project Title *" onChange={handleInput("title")} value={formData.title || ""} />
                  <input className="pp-input" placeholder="Tech Stack (e.g. React, Node, MongoDB)" onChange={handleInput("techStack")} value={formData.techStack || ""} />
                  <input className="pp-input" placeholder="Year" onChange={handleInput("year")} value={formData.year || ""} />
                  <input className="pp-input" placeholder="GitHub URL" onChange={handleInput("githubUrl")} value={formData.githubUrl || ""} />
                  <input className="pp-input" placeholder="Live URL (optional)" onChange={handleInput("liveUrl")} value={formData.liveUrl || ""} />
                  <input className="pp-input" placeholder="Description" onChange={handleInput("description")} value={formData.description || ""} />
                </>
              )}

              {modalType === "internship" && (
                <>
                  <input className="pp-input" placeholder="Company Name *" onChange={handleInput("company")} value={formData.company || ""} />
                  <input className="pp-input" placeholder="Your Role (e.g. SDE Intern)" onChange={handleInput("role")} value={formData.role || ""} />
                  <input className="pp-input" type="date" placeholder="Start Date" onChange={handleInput("startDate")} value={formData.startDate || ""} />
                  <input className="pp-input" type="date" placeholder="End Date" onChange={handleInput("endDate")} value={formData.endDate || ""} />
                  <input className="pp-input" placeholder="Stipend (e.g. 15000/month)" onChange={handleInput("stipend")} value={formData.stipend || ""} />
                  <input className="pp-input" placeholder="Offer Letter URL (optional)" onChange={handleInput("offerLetterUrl")} value={formData.offerLetterUrl || ""} />
                  <input className="pp-input" placeholder="Description" onChange={handleInput("description")} value={formData.description || ""} />
                </>
              )}

              {modalType === "award" && (
                <>
                  <input className="pp-input" placeholder="Award / Achievement Title *" onChange={handleInput("title")} value={formData.title || ""} />
                  <input className="pp-input" placeholder="Issued By (e.g. IIT Bombay)" onChange={handleInput("issuedBy")} value={formData.issuedBy || ""} />
                  <input className="pp-input" placeholder="Year" onChange={handleInput("year")} value={formData.year || ""} />
                  <input className="pp-input" placeholder="Proof URL (optional)" onChange={handleInput("proofUrl")} value={formData.proofUrl || ""} />
                  <input className="pp-input" placeholder="Description" onChange={handleInput("description")} value={formData.description || ""} />
                </>
              )}

              {modalType === "placement" && (
                <>
                  <input className="pp-input" placeholder="Company Name *" onChange={handleInput("company")} value={formData.company || ""} />
                  <input className="pp-input" placeholder="Role / Position" onChange={handleInput("role")} value={formData.role || ""} />
                  <input className="pp-input" placeholder="Package (e.g. 12 LPA)" onChange={handleInput("package")} value={formData.package || ""} />
                  <input className="pp-input" type="date" placeholder="Joining Date" onChange={handleInput("joiningDate")} value={formData.joiningDate || ""} />
                  <input className="pp-input" placeholder="Offer Letter URL (optional)" onChange={handleInput("offerLetterUrl")} value={formData.offerLetterUrl || ""} />
                </>
              )}

              {modalType === "project" && (
                <>
                  <input className="pp-input" placeholder="Project Title *" onChange={handleInput("title")} value={formData.title || ""} />
                  <input className="pp-input" placeholder="Tech Stack (e.g. React, Node, MongoDB)" onChange={handleInput("techStack")} value={formData.techStack || ""} />
                  <input className="pp-input" placeholder="GitHub URL" onChange={handleInput("githubUrl")} value={formData.githubUrl || ""} />
                  <input className="pp-input" placeholder="Live URL (optional)" onChange={handleInput("liveUrl")} value={formData.liveUrl || ""} />
                  <input className="pp-input" placeholder="Year" onChange={handleInput("year")} value={formData.year || ""} />
                  <input className="pp-input" placeholder="Description" onChange={handleInput("description")} value={formData.description || ""} />
                </>
              )}

              {modalType === "internship" && (
                <>
                  <input className="pp-input" placeholder="Company Name *" onChange={handleInput("company")} value={formData.company || ""} />
                  <input className="pp-input" placeholder="Role / Position" onChange={handleInput("role")} value={formData.role || ""} />
                  <input className="pp-input" type="date" placeholder="Start Date" onChange={handleInput("startDate")} value={formData.startDate || ""} />
                  <input className="pp-input" type="date" placeholder="End Date" onChange={handleInput("endDate")} value={formData.endDate || ""} />
                  <input className="pp-input" placeholder="Stipend (e.g. 15000/month)" onChange={handleInput("stipend")} value={formData.stipend || ""} />
                  <input className="pp-input" placeholder="Offer Letter URL (optional)" onChange={handleInput("offerLetterUrl")} value={formData.offerLetterUrl || ""} />
                  <input className="pp-input" placeholder="Description" onChange={handleInput("description")} value={formData.description || ""} />
                </>
              )}

              {modalType === "award" && (
                <>
                  <input className="pp-input" placeholder="Award Title *" onChange={handleInput("title")} value={formData.title || ""} />
                  <input className="pp-input" placeholder="Issued By (e.g. AICTE, IIT Delhi)" onChange={handleInput("issuedBy")} value={formData.issuedBy || ""} />
                  <input className="pp-input" placeholder="Year" onChange={handleInput("year")} value={formData.year || ""} />
                  <input className="pp-input" placeholder="Proof URL (optional)" onChange={handleInput("proofUrl")} value={formData.proofUrl || ""} />
                  <input className="pp-input" placeholder="Description" onChange={handleInput("description")} value={formData.description || ""} />
                </>
              )}

              {modalType === "placement" && (
                <>
                  <input className="pp-input" placeholder="Company Name *" onChange={handleInput("company")} value={formData.company || ""} />
                  <input className="pp-input" placeholder="Role / Position" onChange={handleInput("role")} value={formData.role || ""} />
                  <input className="pp-input" placeholder="Package (e.g. 12 LPA)" onChange={handleInput("package")} value={formData.package || ""} />
                  <input className="pp-input" type="date" placeholder="Joining Date" onChange={handleInput("joiningDate")} value={formData.joiningDate || ""} />
                  <input className="pp-input" placeholder="Offer Letter URL (optional)" onChange={handleInput("offerLetterUrl")} value={formData.offerLetterUrl || ""} />
                </>
              )}

              <div className="pp-modal-actions">
                <button className="pp-btn-cancel" onClick={closeModal}>Cancel</button>
                <button className="pp-btn-submit" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? <Loader size={14} className="pp-spin" /> : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default ProfilePage;