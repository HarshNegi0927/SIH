import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Github,
  Linkedin,
  Camera,
  Edit3,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f9fb",
    display: "flex",
    justifyContent: "center",
    padding: "40px 20px",
    fontFamily: "Inter, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "850px",
    background: "#fff",
    borderRadius: "16px",
    padding: "28px",
    border: "1px solid #d5dfe3",
    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #eef2f6",
    paddingBottom: "16px",
    marginBottom: "20px",
  },
  title: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#054b58",
  },
  backBtn: {
    background: "transparent",
    border: "none",
    color: "#0aa5b7",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
    fontWeight: 500,
  },
  avatarRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
  },
  avatar: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0aa5b7, #00768e)",
    display: "grid",
    placeItems: "center",
    color: "#fff",
    fontSize: "28px",
    fontWeight: 700,
    position: "relative",
  },
  cameraBtn: {
    position: "absolute",
    bottom: "-4px",
    right: "-4px",
    background: "#fff",
    borderRadius: "50%",
    border: "1px solid #d5dfe3",
    padding: "6px",
    cursor: "pointer",
  },
  hint: {
    color: "#64748b",
    fontSize: "14px",
  },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "18px 24px",
  },
  group: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "12px",
    color: "#64748b",
    marginBottom: "6px",
    textTransform: "uppercase",
    fontWeight: 500,
  },
  inputWrap: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    border: "1px solid #d5dfe3",
    borderRadius: "8px",
    padding: "8px 10px",
  },
  input: {
    border: "none",
    outline: "none",
    width: "100%",
    fontSize: "14px",
  },
  textarea: {
    border: "1px solid #d5dfe3",
    borderRadius: "8px",
    padding: "10px",
    fontSize: "14px",
    resize: "none",
  },
  saveRow: {
    marginTop: "28px",
    display: "flex",
    justifyContent: "flex-end",
  },
  saveBtn: {
    background: "#0aa5b7",
    color: "#fff",
    border: "none",
    padding: "10px 26px",
    borderRadius: "8px",
    fontWeight: 500,
    cursor: "pointer",
  },
};

const EditProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "Harsh Negi",
    roll: "ME2022041",
    email: "student@SIHnc.edu",
    phone: "+91 88400 47057",
    branch: "Mechanical Engineering",
    year: "2nd Year",
    college: "MNNIT Allahabad",
    github: "",
    linkedin: "",
    bio: "Aspiring engineer with interest in software & analytics",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.title}>
            <User size={20} />
            <h2>Edit Profile</h2>
          </div>
          <button style={styles.backBtn} onClick={() => navigate("/profile")}>
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        {/* Avatar */}
        <div style={styles.avatarRow}>
          <div style={styles.avatar}>
            HN
            <button style={styles.cameraBtn}>
              <Edit3  size={14} color="#0aa5b7" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div style={styles.form}>
          {[
            ["Full Name", "name", User],
            ["Roll Number", "roll"],
            ["Email", "email", Mail],
            ["Phone", "phone", Phone],
            ["Branch", "branch"],
            ["Year", "year"],
            ["College", "college"],
            ["GitHub", "github", Github],
            ["LinkedIn", "linkedin", Linkedin],
          ].map(([label, name, Icon]) => (
            <div key={name} style={styles.group}>
              <label style={styles.label}>{label}</label>
              <div style={styles.inputWrap}>
                {Icon && <Icon size={16} />}
                <input
                  style={styles.input}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                />
              </div>
            </div>
          ))}

          <div style={{ ...styles.group, gridColumn: "span 2" }}>
            <label style={styles.label}>Bio</label>
            <textarea
              rows={3}
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              style={styles.textarea}
            />
          </div>
        </div>

        {/* Save */}
        <div style={styles.saveRow}>
          <button style={styles.saveBtn} onClick={() => navigate("/profile")}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
