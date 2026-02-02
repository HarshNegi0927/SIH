import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Github,
  Linkedin,
  Award,
  BookOpen,
  Users,
  Calendar,
  Star,
  TrendingUp,
  Edit,
  Plus,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("academic");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [formData, setFormData] = useState({});

  const spiCpiData = [
    { sem: "1st Sem", SPI: 8.2, CPI: 8.2 },
    { sem: "2nd Sem", SPI: 8.8, CPI: 8.4 },
    { sem: "3rd Sem", SPI: 8.6, CPI: 8.5 },
    { sem: "4th Sem", SPI: 9.1, CPI: 8.7 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="ml-2 text-xl font-semibold text-purple-800">
                SIHchronize
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-purple-600">
                Dashboard
              </a>
              <a href="#" className="text-purple-600 font-medium">
                Profile
              </a>
              <a href="#" className="text-gray-600 hover:text-purple-600">
                Courses
              </a>
              <a href="#" className="text-gray-600 hover:text-purple-600">
                Activities
              </a>
            </nav>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md border border-purple-100 p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            {/* Profile Photo */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
            </div>

            {/* Basic Info + Edit Button */}
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">
                    Arjun Sharma
                  </h1>
                  <p className="text-lg text-gray-600 mb-2">
                    Roll No: CSE2021045
                  </p>
                  <p className="text-gray-600">
                    B.Tech Computer Science Engineering • Final Year
                  </p>
                  <p className="text-gray-600">
                    Indian Institute of Technology, Delhi
                  </p>
                </div>

                

              <div className="mt-4 flex flex-col lg:flex-row lg:justify-end gap-4">
                <div className="flex flex-col gap-2">
                                                      
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>arjun.sharma@iitd.ac.in</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>+91 98765 43210</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 justify-start lg:justify-end">
                    <Linkedin className="w-5 h-5 text-purple-600 cursor-pointer hover:text-purple-700" />
                    <Github className="w-5 h-5 text-gray-700 cursor-pointer hover:text-gray-900" />
                  </div>
                  <div className="flex items-center gap-3 mt-2 justify-start lg:justify-end"><Edit className="w-6 h-6 text-green-600 cursor-pointer hover:text-purple-700 transition"
                     onClick={() => navigate("/profile/edit")}
                      />
                
                  
                   
                  </div>

                </div>  
                              
              </div>
             
              {/* Contact Info */}

              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-purple-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">8.7</div>
              <div className="text-sm text-gray-600">CGPA</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">142</div>
              <div className="text-sm text-gray-600">Credits Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">94%</div>
              <div className="text-sm text-gray-600">Attendance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">15</div>
              <div className="text-sm text-gray-600">Activities</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/80 backdrop-blur-md rounded-t-xl shadow-sm border border-purple-100 border-b-0">
          <div className="flex overflow-x-auto">
            {[
              { id: "academic", label: "Academic Info", icon: BookOpen },
              { id: "certifications", label: "Certifications", icon: Award },
              { id: "events", label: "Events & Workshops", icon: Calendar },
              { id: "activities", label: "Clubs & Activities", icon: Users },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === id
                    ? "border-purple-600 text-purple-600 bg-purple-50"
                    : "border-transparent text-gray-600 hover:text-purple-700 hover:bg-purple-50/40"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white/80 backdrop-blur-md rounded-b-xl shadow-sm border border-purple-100 p-6">
          {/* Academic Info */}
          {activeTab === "academic" && (
            <div className="space-y-6">
              {/* SPI-CPI Graph */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Semester-wise SPI & CPI Graph
                </h3>

                <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-purple-100 p-6 shadow-md">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={spiCpiData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E9D8FD" />
                      <XAxis dataKey="sem" stroke="#7C3AED" />
                      <YAxis domain={[8, 9.5]} stroke="#7C3AED" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255,255,255,0.95)",
                          border: "1px solid #E9D8FD",
                          borderRadius: "10px",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="SPI"
                        stroke="#7C3AED"
                        strokeWidth={3}
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="CPI"
                        stroke="#A855F7"
                        strokeDasharray="4 2"
                        strokeWidth={3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <p className="text-center text-xs text-gray-500 mt-2">
                    Source: Office of the Dean Academics
                  </p>
                </div>
              </div>

              {/* Achievements */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-600" />
                    Academic Achievements
                  </h3>
                  <Plus
                    className="w-5 h-5 text-purple-400 cursor-pointer"
                    onClick={() => {
                      setModalType("achievement");
                      setShowModal(true);
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      title: "Dean's List",
                      period: "2022-2023",
                      type: "Academic Excellence",
                    },
                    {
                      title: "Merit Scholarship",
                      period: "2021-2024",
                      type: "Financial Award",
                    },
                    {
                      title: "Best Project Award",
                      period: "2023",
                      type: "Project Recognition",
                    },
                    {
                      title: "Research Paper Publication",
                      period: "2024",
                      type: "Research Achievement",
                    },
                  ].map((achievement, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100"
                    >
                      <Award className="w-6 h-6 text-purple-600" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {achievement.title}
                        </div>
                        <div className="text-sm text-gray-600">
                          {achievement.type} • {achievement.period}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Certifications */}
          {activeTab === "certifications" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  Certifications
                </h3>
                <Plus
                  className="w-5 h-5 text-purple-400 cursor-pointer"
                  onClick={() => {
                    setModalType("certification");
                    setShowModal(true);
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* List of uploaded certificates can go here */}
              </div>
            </div>
          )}

          {/* Events & Workshops */}
          {activeTab === "events" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Events & Workshops
                </h3>
                <Plus
                  className="w-5 h-5 text-purple-400 cursor-pointer"
                  onClick={() => {
                    setModalType("event");
                    setShowModal(true);
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* List of events can go here */}
              </div>
            </div>
          )}

          {/* Clubs & Activities */}
          {activeTab === "activities" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  Clubs & Activities
                </h3>
                <Plus
                  className="w-5 h-5 text-purple-400 cursor-pointer"
                  onClick={() => {
                    setModalType("club");
                    setShowModal(true);
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* List of clubs can go here */}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-4 capitalize">
              Add {modalType}
            </h3>

            {/* ACHIEVEMENTS */}
            {modalType === "achievement" && (
              <>
                <input
                  placeholder="Title"
                  className="w-full border p-2 rounded mb-2"
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
                <input
                  placeholder="Subtitle"
                  className="w-full border p-2 rounded mb-2"
                  onChange={(e) =>
                    setFormData({ ...formData, subtitle: e.target.value })
                  }
                />
                <input
                  placeholder="Year"
                  className="w-full border p-2 rounded mb-4"
                  onChange={(e) =>
                    setFormData({ ...formData, year: e.target.value })
                  }
                />
              </>
            )}

            {/* CERTIFICATIONS */}
            {modalType === "certification" && (
              <>
                <input
                  placeholder="Certification Title"
                  className="w-full border p-2 rounded mb-3"
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  className="mb-4"
                  onChange={(e) =>
                    setFormData({ ...formData, file: e.target.files[0] })
                  }
                />
              </>
            )}

            {/* EVENTS */}
            {modalType === "event" && (
              <>
                <input
                  placeholder="Event Name"
                  className="w-full border p-2 rounded mb-2"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <input
                  placeholder="Role"
                  className="w-full border p-2 rounded mb-2"
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                />
                <input
                  placeholder="Year"
                  className="w-full border p-2 rounded mb-4"
                  onChange={(e) =>
                    setFormData({ ...formData, year: e.target.value })
                  }
                />
              </>
            )}

            {/* CLUBS */}
            {modalType === "club" && (
              <>
                <input
                  placeholder="Club Name"
                  className="w-full border p-2 rounded mb-2"
                  onChange={(e) =>
                    setFormData({ ...formData, club: e.target.value })
                  }
                />
                <input
                  placeholder="Designation"
                  className="w-full border p-2 rounded mb-2"
                  onChange={(e) =>
                    setFormData({ ...formData, designation: e.target.value })
                  }
                />
                <input
                  placeholder="Duration"
                  className="w-full border p-2 rounded mb-4"
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                />
              </>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log(formData); // later connect to backend
                  setShowModal(false);
                  setFormData({});
                }}
                className="bg-purple-600 text-white px-4 py-2 rounded text-sm"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
