"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import "./Profilepage.css"
import {
  Bell,
  LogOut,
  TrendingUp,
  BookOpen,
  Trophy,
  Feather,
  ClipboardList,
  User,
  BarChart2,
  FileText,
  Sun,
  Moon,
  Edit3,
  Download,
  Menu,
  X,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"

const spiData = [
  { sem: "1st sem", SPI: 7.57, CPI: 7.57 },
  { sem: "2nd sem", SPI: 7.68, CPI: 7.62 },
  { sem: "3rd sem", SPI: 8.37, CPI: 7.82 },
  { sem: "4th sem", SPI: 7.62, CPI: 7.74 },
]

const grades = {
  "1st sem": ["Physics - A", "Maths I - B+", "Electrical - B", "Graphics - A-"],
  "2nd sem": ["Chemistry - A", "Maths II - B+", "C Programming - A-", "Workshop - B"],
  "3rd sem": ["DSA - A+", "DBMS - A", "COA - B+", "OS - A-"],
  "4th sem": ["DAA - A", "CN - A", "SE - B+", "Probability - B"],
}

export default function ProfilePage() {
  const [selectedSem, setSelectedSem] = useState("4th sem")
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light"
    }
    return "light"
  })
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [form, setForm] = useState({
    name: "Harsh Negi",
    email: "student@SIHnc.edu",
    institution: "MNNIT Allahabad",
    aishe: "AISHE-98765",
    contact: "+91 88400 47057",
    role: "Student",
  })

  const revealRefs = useRef([])
  revealRefs.current = []
  const addToRefs = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el)
  }

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme)
      localStorage.setItem("theme", theme)
    }
  }, [theme])

  useEffect(() => {
    const onScroll = () => {
      revealRefs.current.forEach((el) => {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight - 80) el.classList.add("reveal-in")
      })
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const graphYAxisDomain = useMemo(() => {
    const spi = spiData.map((d) => d.SPI)
    const cpi = spiData.map((d) => d.CPI)
    const all = spi.concat(cpi)
    const min = Math.min(...all)
    const max = Math.max(...all)
    const pad = 0.2
    return [Math.floor((min - pad) * 10) / 10, Math.ceil((max + pad) * 10) / 10]
  }, [])

  const handleThemeToggle = () => setTheme((t) => (t === "light" ? "dark" : "light"))
  const handleEditOpen = () => setIsEditOpen(true)
  const handleEditClose = () => setIsEditOpen(false)

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleFormSave = (e) => {
    e.preventDefault()
    handleEditClose()
  }

  const handleResolveCPI = () => {
    alert("CPI recalculated successfully from SPI records.")
  }

  const handleDownloadResume = () => {
    const lines = [
      "===== Resume =====",
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Contact: ${form.contact}`,
      `Institution: ${form.institution}`,
      `AISHE Code: ${form.aishe}`,
      `Role: ${form.role}`,
      "",
      "Academic Performance:",
      ...spiData.map((d) => `  ${d.sem}: SPI ${d.SPI} | CPI ${d.CPI}`),
      "",
      `Recent Grades (${selectedSem}):`,
      ...(grades[selectedSem] || []).map((x) => `  - ${x}`),
      "",
      "Achievements:",
      "  Certifications: Python - NPTEL; Data Analytics - Coursera",
      "  Merit Awards: Institute Rank Holder - 2023",
      "  Sports & Culture: Inter-university Football Runner-up",
      "  Research & Publications: IEEE Journal Publication - 2024",
    ].join("\n")

    const blob = new Blob([lines], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${form.name.split(" ").join("_")}_Resume.txt`
    document.body.appendChild(a)
    a.click()
    URL.revokeObjectURL(url)
    a.remove()
  }

  return (
    <div className="profile-page">
      {/* HEADER */}
      <header className="admin-header">
        <div className="header-left">
          <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle menu">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="logo-circle">EV</div>
          <div className="logo-title">
            <h1>SIHnchronize</h1>
            <span>College Management Portal</span>
          </div>
        </div>

        <div className="header-right">
          <div className="notification-box" title="View notifications">
            <Bell size={18} />
          </div>

          <button
            className="theme-toggle"
            aria-label="Toggle theme"
            onClick={handleThemeToggle}
            title="Toggle Light/Dark"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <div className="admin-info-box">
            <div className="admin-avatar">HN</div>
            <div className="admin-text">
              <p className="admin-name">{form.name}</p>
              <p className="admin-role">{form.role}</p>
            </div>
          </div>

          <button className="logout-btn" title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* LAYOUT */}
      <div className="main-body">
        {/* SIDEBAR */}
        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <ul>
            <li className="active" title="Profile">
              <User size={18} />
              <span>Profile</span>
            </li>
            <li
              title="Go to SPI / CPI Chart"
              onClick={() => {
                document.getElementById("spiGraph").scrollIntoView({ behavior: "smooth" })
                setSidebarOpen(false)
              }}
            >
              <BarChart2 size={18} />
              <span>SPI / CPI Chart</span>
            </li>
            <li
              title="See Achievements"
              onClick={() => {
                document.getElementById("achievements-section").scrollIntoView({ behavior: "smooth" })
                setSidebarOpen(false)
              }}
            >
              <Trophy size={18} />
              <span>Achievements</span>
            </li>
            <li title="Academic Record">
              <BookOpen size={18} />
              <span>Academic Record</span>
            </li>
            <li title="Attendance">
              <ClipboardList size={18} />
              <span>Attendance</span>
            </li>
            <li title="Documents">
              <FileText size={18} />
              <span>Documents</span>
            </li>
          </ul>
        </aside>

        {/* CONTENT */}
        <div className="content-area">
          {/* PROFILE CARD */}
          <div className="profile-card card reveal" ref={addToRefs}>
            <div className="photo-upload-block">
              <div className="photo-circle" aria-label="Profile photo">
                DS
              </div>
              <button className="btn btn-secondary" title="Upload photo">
                Upload Photo
              </button>
            </div>

            <div className="info-list-container">
              <div className="info-item">
                <p className="info-label">Full Name</p>
                <p className="info-value">{form.name}</p>
              </div>
              <div className="info-item">
                <p className="info-label">Email Address</p>
                <p className="info-value">{form.email}</p>
              </div>
              <div className="info-item">
                <p className="info-label">Institution</p>
                <p className="info-value">{form.institution}</p>
              </div>
              <div className="info-item">
                <p className="info-label">AISHE Code</p>
                <p className="info-value">{form.aishe}</p>
              </div>
              <div className="info-item">
                <p className="info-label">Contact Number</p>
                <p className="info-value">{form.contact}</p>
              </div>
              <div className="info-item">
                <p className="info-label">Role</p>
                <p className="info-value">{form.role}</p>
              </div>
            </div>

            <div className="profile-actions">
              <button className="action-btn primary" onClick={handleEditOpen}>
                <Edit3 size={16} />
                Edit Profile
              </button>
              <button className="action-btn outline" onClick={handleResolveCPI}>
                Resolve CPI
              </button>
              <button className="action-btn outline" onClick={handleDownloadResume}>
                <Download size={16} />
                Resume
              </button>
            </div>
          </div>

          {/* SPI / CPI GRAPH & GRADE BOX SECTION */}
          <div className="section-card card reveal" id="spiGraph" ref={addToRefs}>
            <div className="section-header">
              <TrendingUp size={22} className="header-icon" />
              <h2>Academic Performance Trend</h2>
            </div>

            <div className="spi-graph-row">
              <div className="spi-graph-container">
                <p className="graph-source">📊 Source: Office of the Dean Academics</p>

                <ResponsiveContainer width="100%" height={340}>
                  <LineChart
                    data={spiData}
                    onMouseMove={(e) => e && e.activeLabel && setSelectedSem(e.activeLabel)}
                    margin={{ top: 10, right: 24, left: 0, bottom: 0 }}
                  >
                    <XAxis dataKey="sem" tickLine={false} axisLine={false} stroke="var(--text-muted)" />
                    <YAxis domain={graphYAxisDomain} stroke="var(--text-muted)" />
                    <Tooltip
                      wrapperStyle={{
                        borderRadius: 12,
                        border: "1px solid var(--border-color)",
                      }}
                      contentStyle={{
                        borderRadius: 12,
                        backgroundColor: "var(--bg-card)",
                        border: "1px solid var(--border-color)",
                      }}
                      cursor={{
                        stroke: "var(--accent-blue)",
                        strokeDasharray: "5 5",
                      }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: 10 }} />
                    <Line
                      type="monotone"
                      dataKey="SPI"
                      stroke="var(--accent-blue)"
                      strokeWidth={3}
                      dot={{
                        stroke: "var(--accent-blue)",
                        strokeWidth: 2,
                        r: 5,
                      }}
                      activeDot={{ r: 7 }}
                      animationDuration={600}
                    />
                    <Line
                      type="monotone"
                      dataKey="CPI"
                      stroke="var(--accent-teal)"
                      strokeWidth={3}
                      dot={{
                        stroke: "var(--accent-teal)",
                        strokeWidth: 2,
                        r: 5,
                      }}
                      activeDot={{ r: 7 }}
                      animationDuration={600}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* GRADE BOX */}
              <div className="grades-box card-subtle">
                <div className="grades-header">
                  <ClipboardList size={20} />
                  <h3>
                    <span className="sem-badge">{selectedSem}</span> Grades
                  </h3>
                </div>

                <ul className="grades-list">
                  {(grades[selectedSem] || []).map((g, i) => (
                    <li key={i}>
                      <span className="grade-dot"></span>
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ACHIEVEMENTS SECTION */}
          <div id="achievements-section" className="section-card card reveal" ref={addToRefs}>
            <div className="section-header">
              <Trophy size={22} className="header-icon" />
              <h2>Achievements & Recognition</h2>
            </div>
            <div className="achievements-grid">
              <div className="achievement-block card-subtle">
                <div className="achievement-icon-wrapper cert">
                  <BookOpen size={28} />
                </div>
                <h3>Certifications</h3>
                <ul>
                  <li>Python - NPTEL</li>
                  <li>Data Analytics - Coursera</li>
                </ul>
              </div>

              <div className="achievement-block card-subtle">
                <div className="achievement-icon-wrapper merit">
                  <Trophy size={28} />
                </div>
                <h3>Merit Awards</h3>
                <ul>
                  <li>Institute Rank Holder - 2023</li>
                </ul>
              </div>

              <div className="achievement-block card-subtle">
                <div className="achievement-icon-wrapper sports">
                  <Feather size={28} />
                </div>
                <h3>Sports & Culture</h3>
                <ul>
                  <li>Inter-university Football Runner-up</li>
                </ul>
              </div>

              <div className="achievement-block card-subtle">
                <div className="achievement-icon-wrapper research">
                  <ClipboardList size={28} />
                </div>
                <h3>Research & Publications</h3>
                <ul>
                  <li>IEEE Journal Publication - 2024</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditOpen && (
        <div className="modal-backdrop" onClick={handleEditClose}>
          <div className="modal-card card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Your Profile</h3>
              <button className="modal-close" onClick={handleEditClose} aria-label="Close">
                ✕
              </button>
            </div>
            <form className="modal-body" onSubmit={handleFormSave}>
              <div className="form-row">
                <label>Full Name</label>
                <input name="name" value={form.name} onChange={handleFormChange} placeholder="Enter your name" />
              </div>
              <div className="form-row">
                <label>Email Address</label>
                <input name="email" value={form.email} onChange={handleFormChange} placeholder="your@email.com" />
              </div>
              <div className="form-row">
                <label>Institution</label>
                <input
                  name="institution"
                  value={form.institution}
                  onChange={handleFormChange}
                  placeholder="Your Institution"
                />
              </div>
              <div className="form-row">
                <label>AISHE Code</label>
                <input name="aishe" value={form.aishe} onChange={handleFormChange} placeholder="AISHE-XXXXX" />
              </div>
              <div className="form-row">
                <label>Contact Number</label>
                <input name="contact" value={form.contact} onChange={handleFormChange} placeholder="+91 XXXXX XXXXX" />
              </div>
              <div className="form-row">
                <label>Role</label>
                <input name="role" value={form.role} onChange={handleFormChange} placeholder="Your Role" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn ghost" onClick={handleEditClose}>
                  Cancel
                </button>
                <button type="submit" className="btn primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
