import React, { useState } from "react";
import "./ProfilePage.css";
import { Bell, LogOut, TrendingUp, BookOpen, Trophy, Feather, ClipboardList, User, BarChart2, Briefcase, FileText } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const spiData = [
  { sem: "1st sem", SPI: 7.57, CPI: 7.57 },
  { sem: "2nd sem", SPI: 7.68, CPI: 7.62 },
  { sem: "3rd sem", SPI: 8.37, CPI: 7.82 },
  { sem: "4th sem", SPI: 7.62, CPI: 7.74 },
];

const grades = {
  "1st sem": ["Physics - A", "Maths I - B+", "Electrical - B", "Graphics - A-"],
  "2nd sem": ["Chemistry - A", "Maths II - B+", "C Programming - A-", "Workshop - B"],
  "3rd sem": ["DSA - A+", "DBMS - A", "COA - B+", "OS - A-"],
  "4th sem": ["DAA - A", "CN - A", "SE - B+", "Probability - B"]
};

const ProfilePage = () => {
  const [selectedSem, setSelectedSem] = useState("4th sem");

  return (
    <div className="profile-page">

      {/* HEADER - No Change */}
      <header className="admin-header">
        <div className="header-left">
          <div className="logo-circle">EV</div>
          <div className="logo-title">
            <h1>SIHnchronize College Management Portal</h1>
            <span>MotiLal Nehru National Institute of Technology</span>
          </div>
        </div>

        <div className="header-right">
          <div className="notification-box">
            <Bell size={18} />
            <p>Notifications</p>
          </div>

          <div className="admin-info-box">
            <div className="admin-avatar">HN</div>
            <div className="admin-text">
              <p className="admin-name">Harsh Negi</p>
              <p className="admin-role">Student</p>
            </div>
          </div>

          <button className="logout-btn">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {/* LAYOUT */}
      <div className="main-body">

        {/* SIDEBAR - No Change */}
        <aside className="sidebar">
          <ul>
            <li className="active">
                <User size={18} />
                Profile
            </li>
            <li onClick={() => document.getElementById("spiGraph").scrollIntoView({ behavior: "smooth" })}>
                <BarChart2 size={18} />
                SPI / CPI Chart
            </li>
            <li onClick={() => document.getElementById("achievements-section").scrollIntoView({ behavior: "smooth" })}>
                <Trophy size={18} />
                Achievements
            </li>
            <li>
                <BookOpen size={18} />
                Academic Record
            </li>
            <li>
                <ClipboardList size={18} />
                Attendance
            </li>
            <li>
                <FileText size={18} />
                Documents
            </li>
          </ul>
        </aside>

        {/* CONTENT */}
        <div className="content-area">

          {/* PROFILE CARD - No Change */}
          <div className="profile-card">
            
            {/* Left Block: Photo and Upload */}
            <div className="photo-upload-block">
              <div className="photo-circle">DS</div>
              <button className="upload-btn">Upload Photo</button>
            </div>

            {/* Middle Block: Key Information */}
            <div className="info-list-container">
                <div className="info-item">
                    <p className="info-label">Name</p>
                    <p className="info-value">Harsh Negi</p>
                </div>
                <div className="info-item">
                    <p className="info-label">Email</p>
                    <p className="info-value">student@SIHnc.edu</p>
                </div>
                <div className="info-item">
                    <p className="info-label">Institution</p>
                    <p className="info-value">MNNIT Allahabad</p>
                </div>
                <div className="info-item">
                    <p className="info-label">AISHE Code</p>
                    <p className="info-value">AISHE-98765</p>
                </div>
                <div className="info-item">
                    <p className="info-label">Contact</p>
                    <p className="info-value">+91 88400 47057</p>
                </div>
                <div className="info-item">
                    <p className="info-label">Role</p>
                    <p className="info-value">Student</p>
                </div>
            </div>

            {/* Right Block: Quick Actions (New Addition) */}
            <div className="profile-actions">
                <button className="action-btn primary">Edit Profile</button>
                <button className="action-btn secondary">Resolve CPI</button>
                <button className="action-btn secondary">Download Resume</button>
            </div>
          </div>

          {/* SPI / CPI GRAPH & GRADE BOX SECTION */}
          <div className="section-card" id="spiGraph">
             <div className="section-header">
                 <TrendingUp size={20} className="header-icon"/>
                 <h2>Academic Performance Trend</h2>
             </div>
             
             <div className="spi-graph-row">
                <div className="spi-graph-container"> {/* Renamed for better clarity */}
                    <p className="graph-source">Source: Office of the Dean Academics</p>

                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={spiData} onMouseMove={(e) => e && e.activeLabel && setSelectedSem(e.activeLabel)}>
                        <XAxis dataKey="sem" tickLine={false} axisLine={false} />
                        <YAxis domain={[7.4, 8.5]} stroke="#94a3b8" />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                        <Line type="monotone" dataKey="SPI" stroke="#0aa5b7" strokeWidth={3} dot={{ stroke: '#0aa5b7', strokeWidth: 2, r: 4 }} />
                        <Line type="monotone" dataKey="CPI" stroke="#36b0ff" strokeWidth={3} dot={{ stroke: '#36b0ff', strokeWidth: 2, r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* GRADE BOX */}
                <div className="grades-box">
                    <div className="grades-header">
                        <ClipboardList size={20} />
                        <h3>{selectedSem} Grades</h3>
                    </div>
                    
                    <ul className="grades-list">
                        {grades[selectedSem].map((g, i) => <li key={i}>{g}</li>)}
                    </ul>
                </div>
            </div>
          </div>

          {/* ACHIEVEMENTS SECTION */}
          <div id="achievements-section" className="section-card"> {/* New wrapping card */}
            <div className="section-header">
                 <Trophy size={20} className="header-icon"/>
                 <h2>Professional & Extra-Curricular Achievements</h2>
             </div>
            <div className="achievements-grid">

              <div className="achievement-block">
                <div className="achievement-icon-wrapper cert"><BookOpen size={24} /></div>
                <h3>Certifications</h3>
                <ul>
                  <li>Python - NPTEL</li>
                  <li>Data Analytics - Coursera</li>
                </ul>
              </div>

              <div className="achievement-block">
                 <div className="achievement-icon-wrapper merit"><Trophy size={24} /></div>
                <h3>Merit Awards</h3>
                <ul>
                  <li>Institute Rank Holder - 2023</li>
                </ul>
              </div>

              <div className="achievement-block">
                 <div className="achievement-icon-wrapper sports"><Feather size={24} /></div>
                <h3>Sports & Culture</h3>
                <ul>
                  <li>Inter-university Football Runner-up</li>
                </ul>
              </div>

              <div className="achievement-block">
                 <div className="achievement-icon-wrapper research"><ClipboardList size={24} /></div>
                <h3>Research & Publications</h3>
                <ul>
                  <li>IEEE Journal Publication - 2024</li>
                </ul>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;