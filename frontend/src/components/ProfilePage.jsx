import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Mail, Phone, Github, Linkedin, Award, BookOpen,
  Users, Calendar, Star, TrendingUp, Edit, Plus,
  Bell, Moon, Sun, LogOut, X, ChevronRight,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const COLORS = {
  primary: "#6C3DE0",
  primaryLight: "#EDE9FF",
  primaryMid: "#9B6DFF",
  accent: "#F59E0B",
  accentGreen: "#10B981",
  accentPink: "#EC4899",
  text: "#1A1033",
  textMuted: "#6B7280",
  border: "#E8E3FF",
  cardBg: "#FFFFFF",
  pageBg: "#F4F1FF",
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .pp-root {
    min-height: 100vh;
    background: #F4F1FF;
    font-family: 'Sora', sans-serif;
    color: #1A1033;
  }

  /* ── HEADER ── */
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
    letter-spacing: -0.5px;
  }
  .pp-logo-text {
    font-size: 18px;
    font-weight: 700;
    color: #1A1033;
    letter-spacing: -0.3px;
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
  }
  .pp-user-name { font-size: 13px; font-weight: 600; color: #1A1033; }
  .pp-user-role { font-size: 11px; color: #9B6DFF; }

  /* ── PAGE BODY ── */
  .pp-body {
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px 24px;
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 24px;
    align-items: start;
  }

  /* ── SIDEBAR ── */
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
  }
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

  /* Stats card */
  .pp-stats-card { padding: 20px; }
  .pp-stats-title { font-size: 12px; font-weight: 600; color: #9B6DFF; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 14px; }
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
  .pp-stat.green .pp-stat-value { color: #10B981; }
  .pp-stat.amber .pp-stat-value { color: #F59E0B; }

  /* ── MAIN CONTENT ── */
  .pp-main { display: flex; flex-direction: column; gap: 16px; }

  /* Tabs */
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

  /* Tab content */
  .pp-tab-content { display: flex; flex-direction: column; gap: 16px; }

  /* Section card */
  .pp-section { background: #fff; border-radius: 16px; border: 1px solid #E8E3FF; padding: 24px; }
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

  /* Chart */
  .pp-chart-wrap {
    background: #F9F7FF;
    border-radius: 12px;
    border: 1px solid #EDE9FF;
    padding: 20px;
  }
  .pp-chart-source { font-size: 11px; color: #9CA3AF; text-align: center; margin-top: 10px; }

  /* Achievement grid */
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
    cursor: default;
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

  /* Empty state */
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

  /* ── MODAL ── */
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
    to { opacity: 1; transform: scale(1) translateY(0); }
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
    color: #6B7280;
    transition: all 0.15s;
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
  .pp-modal-actions { display: flex; gap: 10px; margin-top: 6px; justify-content: flex-end; }
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
    transition: opacity 0.15s;
  }
  .pp-btn-submit:hover { opacity: 0.88; }

  @media (max-width: 900px) {
    .pp-body { grid-template-columns: 1fr; }
    .pp-ach-grid { grid-template-columns: 1fr; }
    .pp-tabs { overflow-x: auto; }
    .pp-tab { flex: none; white-space: nowrap; }
  }
`;

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("academic");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [formData, setFormData] = useState({});
  const [theme, setTheme] = useState("light");
  const handleThemeToggle = () => setTheme(p => p === "light" ? "dark" : "light");
  const [form] = useState({ name: "Arjun Sharma", role: "Student" });

  const spiCpiData = [
    { sem: "Sem 1", SPI: 8.2, CPI: 8.2 },
    { sem: "Sem 2", SPI: 8.8, CPI: 8.4 },
    { sem: "Sem 3", SPI: 8.6, CPI: 8.5 },
    { sem: "Sem 4", SPI: 9.1, CPI: 8.7 },
  ];

  const tabs = [
    { id: "academic", label: "Academic", icon: BookOpen },
    { id: "certifications", label: "Certifications", icon: Award },
    { id: "events", label: "Events", icon: Calendar },
    { id: "activities", label: "Clubs", icon: Users },
  ];

  const achievements = [
    { title: "Dean's List", type: "Academic Excellence", period: "2022–23" },
    { title: "Merit Scholarship", type: "Financial Award", period: "2021–24" },
    { title: "Best Project Award", type: "Project Recognition", period: "2023" },
    { title: "Research Publication", type: "Research Achievement", period: "2024" },
  ];

  const openModal = (type) => { setModalType(type); setShowModal(true); };

  return (
    <>
      <style>{styles}</style>
      <div className="pp-root">
        {/* Header */}
        <header className="pp-header">
          <div className="pp-header-inner">
            <a href="#" className="pp-logo">
              <div className="pp-logo-mark">S</div>
              <span className="pp-logo-text">SIHchronize</span>
            </a>
            <nav className="pp-nav">
              <a href="#">Dashboard</a>
              <a href="#" className="active">Profile</a>
              <a href="#">Courses</a>
              <a href="#">Activities</a>
            </nav>
            <div className="pp-header-actions">
              <button className="pp-icon-btn"><Bell size={16} /></button>
              <button className="pp-icon-btn" onClick={handleThemeToggle}>
                {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
              </button>
              <div className="pp-user-chip">
                <div className="pp-avatar-sm">HN</div>
                <div>
                  <div className="pp-user-name">{form.name}</div>
                  <div className="pp-user-role">{form.role}</div>
                </div>
              </div>
              <button className="pp-icon-btn"><LogOut size={16} /></button>
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="pp-body">
          {/* Sidebar */}
          <aside className="pp-sidebar">
            {/* Profile card */}
            <div className="pp-card">
              <div className="pp-profile-card">
                <div className="pp-avatar-wrap">
                  <div className="pp-avatar"><User size={32} color="#fff" /></div>
                  <div className="pp-online-dot" />
                </div>
                <div className="pp-name">Arjun Sharma</div>
                <div className="pp-roll">CSE2021045</div>
                <div className="pp-dept">B.Tech Computer Science Engineering · Final Year</div>
                <div className="pp-institute">IIT Delhi</div>
              </div>

              <div className="pp-contact-list">
                <div className="pp-contact-item">
                  <span className="pp-contact-icon"><Mail size={13} /></span>
                  arjun.sharma@iitd.ac.in
                </div>
                <div className="pp-contact-item">
                  <span className="pp-contact-icon"><Phone size={13} /></span>
                  +91 98765 43210
                </div>
              </div>

              <div className="pp-social-row">
                <a href="#" className="pp-social-btn"><Linkedin size={13} /> LinkedIn</a>
                <a href="#" className="pp-social-btn"><Github size={13} /> GitHub</a>
              </div>

              <button className="pp-edit-btn" onClick={() => navigate("/profile/edit")}>
                <Edit size={14} /> Edit Profile
              </button>
            </div>

            {/* Stats card */}
            <div className="pp-card">
              <div className="pp-stats-card">
                <div className="pp-stats-title">Quick Stats</div>
                <div className="pp-stats-grid">
                  <div className="pp-stat purple">
                    <div className="pp-stat-value">8.7</div>
                    <div className="pp-stat-label">CGPA</div>
                  </div>
                  <div className="pp-stat indigo">
                    <div className="pp-stat-value">142</div>
                    <div className="pp-stat-label">Credits</div>
                  </div>
                  <div className="pp-stat green">
                    <div className="pp-stat-value">94%</div>
                    <div className="pp-stat-label">Attendance</div>
                  </div>
                  <div className="pp-stat amber">
                    <div className="pp-stat-value">15</div>
                    <div className="pp-stat-label">Activities</div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main */}
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

            {/* Tab Content */}
            <div className="pp-tab-content">
              {/* Academic */}
              {activeTab === "academic" && (
                <>
                  <div className="pp-section">
                    <div className="pp-section-header">
                      <div className="pp-section-title">
                        <span className="pp-section-icon"><TrendingUp size={15} /></span>
                        SPI & CPI Trend
                      </div>
                    </div>
                    <div className="pp-chart-wrap">
                      <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={spiCpiData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#EDE9FF" />
                          <XAxis dataKey="sem" stroke="#9B6DFF" tick={{ fontSize: 12, fontFamily: 'Sora' }} />
                          <YAxis domain={[7.8, 9.5]} stroke="#9B6DFF" tick={{ fontSize: 12, fontFamily: 'Sora' }} />
                          <Tooltip
                            contentStyle={{
                              background: "#fff",
                              border: "1px solid #EDE9FF",
                              borderRadius: 12,
                              fontSize: 13,
                              fontFamily: 'Sora',
                              boxShadow: "0 4px 20px rgba(108,61,224,0.12)"
                            }}
                          />
                          <Legend wrapperStyle={{ fontSize: 13, fontFamily: 'Sora' }} />
                          <Line type="monotone" dataKey="SPI" stroke="#6C3DE0" strokeWidth={2.5} dot={{ r: 5, fill: "#6C3DE0" }} activeDot={{ r: 7 }} />
                          <Line type="monotone" dataKey="CPI" stroke="#9B6DFF" strokeDasharray="5 3" strokeWidth={2.5} dot={{ r: 5, fill: "#9B6DFF" }} />
                        </LineChart>
                      </ResponsiveContainer>
                      <div className="pp-chart-source">Source: Office of the Dean Academics</div>
                    </div>
                  </div>

                  <div className="pp-section">
                    <div className="pp-section-header">
                      <div className="pp-section-title">
                        <span className="pp-section-icon"><Star size={15} /></span>
                        Academic Achievements
                      </div>
                      <button className="pp-add-btn" onClick={() => openModal("achievement")}><Plus size={14} /></button>
                    </div>
                    <div className="pp-ach-grid">
                      {achievements.map((a, i) => (
                        <div className="pp-ach-item" key={i}>
                          <div className="pp-ach-icon"><Award size={16} color="#fff" /></div>
                          <div>
                            <div className="pp-ach-name">{a.title}</div>
                            <div className="pp-ach-meta">{a.type}</div>
                          </div>
                          <div className="pp-ach-badge">{a.period}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Other tabs */}
              {["certifications", "events", "activities"].includes(activeTab) && (
                <div className="pp-section">
                  <div className="pp-section-header">
                    <div className="pp-section-title">
                      <span className="pp-section-icon">
                        {activeTab === "certifications" && <Award size={15} />}
                        {activeTab === "events" && <Calendar size={15} />}
                        {activeTab === "activities" && <Users size={15} />}
                      </span>
                      {activeTab === "certifications" && "Certifications"}
                      {activeTab === "events" && "Events & Workshops"}
                      {activeTab === "activities" && "Clubs & Activities"}
                    </div>
                    <button className="pp-add-btn" onClick={() => openModal(activeTab === "activities" ? "club" : activeTab.slice(0, -1))}>
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="pp-empty">
                    <div className="pp-empty-icon">
                      {activeTab === "certifications" && <Award size={22} />}
                      {activeTab === "events" && <Calendar size={22} />}
                      {activeTab === "activities" && <Users size={22} />}
                    </div>
                    <p>No entries yet. Click <strong>+</strong> to add one.</p>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="pp-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
            <div className="pp-modal">
              <div className="pp-modal-header">
                <div className="pp-modal-title">Add {modalType}</div>
                <button className="pp-modal-close" onClick={() => setShowModal(false)}><X size={14} /></button>
              </div>

              {modalType === "achievement" && (
                <>
                  <input className="pp-input" placeholder="Title" onChange={e => setFormData({ ...formData, title: e.target.value })} />
                  <input className="pp-input" placeholder="Subtitle / Type" onChange={e => setFormData({ ...formData, subtitle: e.target.value })} />
                  <input className="pp-input" placeholder="Year" onChange={e => setFormData({ ...formData, year: e.target.value })} />
                </>
              )}
              {modalType === "certification" && (
                <>
                  <input className="pp-input" placeholder="Certification Title" onChange={e => setFormData({ ...formData, title: e.target.value })} />
                  <input type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" className="pp-input" onChange={e => setFormData({ ...formData, file: e.target.files[0] })} />
                </>
              )}
              {modalType === "event" && (
                <>
                  <input className="pp-input" placeholder="Event Name" onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  <input className="pp-input" placeholder="Your Role" onChange={e => setFormData({ ...formData, role: e.target.value })} />
                  <input className="pp-input" placeholder="Year" onChange={e => setFormData({ ...formData, year: e.target.value })} />
                </>
              )}
              {modalType === "club" && (
                <>
                  <input className="pp-input" placeholder="Club Name" onChange={e => setFormData({ ...formData, club: e.target.value })} />
                  <input className="pp-input" placeholder="Designation" onChange={e => setFormData({ ...formData, designation: e.target.value })} />
                  <input className="pp-input" placeholder="Duration (e.g. 2022–24)" onChange={e => setFormData({ ...formData, duration: e.target.value })} />
                </>
              )}

              <div className="pp-modal-actions">
                <button className="pp-btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="pp-btn-submit" onClick={() => { console.log(formData); setShowModal(false); setFormData({}); }}>
                  Add Entry
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