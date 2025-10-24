import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  User,
  Upload,
  FileText,
  ClipboardCheck,
  UploadCloud,
  Bell,
  LogOut,
  Mail,
  Settings,
  PlusCircle,
} from "lucide-react";
import { useAuth } from "../../context/authContext";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [admin, setAdmin] = useState({
    name: "",
    email: "",
    institution: "",
    role: "",
    aishe: "",
    contact: "",
    profileUrl: "",
  });
  useEffect(() => {
    // Only try to set admin data if a user object actually exists
    if (user) {
      setAdmin({
        name:
          `${user.profile?.firstName || ""} ${
            user.profile?.lastName || ""
          }`.trim() || user.email,
        email: user.email || "N/A",
        institution: user.institutionInfo?.collegeName || "Institution N/A",
        role: user.role === "admin" ? "Platform Admin" : user.role,
        aishe: user.institutionInfo?.aisheCode || "AISHE N/A",
        contact: user.profile?.phone || "Contact N/A",
        profileUrl: user.profile?.profilePictureUrl || "",
      });
    }
  }, [user]);
  const [stats] = useState({
    students: 1245,
    faculty: 87,
    pendingProofs: 32,
    attendanceToday: 145,
    activeWorkshops: 3,
  });

  const handleLogout = () => {
    logout(); // Clears context and localStorage
    navigate("/login"); // Redirects to login page
  };
  useEffect(() => {
    // If the context has checked and found no token, redirect.
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const [activity, setActivity] = useState([
    { id: 1, text: "Bulk upload completed: 120 students", time: "2h ago" },
    { id: 2, text: "Faculty profile updated: Prof. R. Singh", time: "6h ago" },
    { id: 3, text: "Report generated: NAAC Snapshot", time: "1d ago" },
  ]);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    department: "",
  });

  const [inviteStatus, setInviteStatus] = useState(null);

  const handleProfileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAdmin((prev) => ({ ...prev, profileUrl: reader.result }));
      setActivity((prev) => [
        { id: Date.now(), text: "Profile picture updated", time: "just now" },
        ...prev,
      ]);
    };
    reader.readAsDataURL(file);
  };

  const openInvite = () => {
    setInviteForm({ name: "", email: "", department: "" });
    setInviteStatus(null);
    setShowInviteModal(true);
  };

  const sendInvite = (e) => {
    e.preventDefault();
    if (!inviteForm.name || !inviteForm.email) {
      setInviteStatus("error");
      return;
    }
    setInviteStatus("sending");
    setTimeout(() => {
      setInviteStatus("sent");
      setActivity((prev) => [
        {
          id: Date.now(),
          text: `Invitation sent to ${inviteForm.name} (${inviteForm.email})`,
          time: "just now",
        },
        ...prev,
      ]);
      setInviteForm({ name: "", email: "", department: "" });
      setTimeout(() => setShowInviteModal(false), 900);
    }, 900);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Redirecting to login...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen text-gray-900 bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-md">
        <div className="flex items-center px-6 py-6 space-x-3 border-b">
          <div className="flex items-center justify-center w-12 h-12 text-lg font-bold text-white rounded-md bg-cyan-500">
            EV
          </div>
          <div>
            <div className="text-sm font-semibold">SIHnchronize</div>
            <div className="text-xs text-gray-500">Admin Panel</div>
          </div>
        </div>

        <nav className="px-4 py-6 space-y-1">
          <Link
            to="/admin/edit"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-100 ${
              location.pathname === "/admin/edit"
                ? "bg-gray-100 font-semibold"
                : ""
            }`}
          >
            <User size={18} /> Edit Profile
          </Link>

          <Link
            to="/admin/bulk-upload"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-100 ${
              location.pathname === "/admin/bulk-upload"
                ? "bg-gray-100 font-semibold"
                : ""
            }`}
          >
            <Upload size={18} /> Bulk Upload Students
          </Link>

          <button className="flex items-center w-full gap-3 px-4 py-3 rounded hover:bg-gray-100">
            <UploadCloud size={18} /> NAAC /AICTE Upload
          </button>

          <button className="flex items-center w-full gap-3 px-4 py-3 rounded hover:bg-gray-100">
            <FileText size={18} /> View Reports
          </button>

          <Link
            to="/admin/students"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-100 ${
              location.pathname === "/admin/students"
                ? "bg-gray-100 font-semibold"
                : ""
            }`}
          >
            <ClipboardCheck size={18} />
            Student List
          </Link>

          <Link
            to="/admin/invite-admins"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-100 ${
              location.pathname === "/admin/invite-admins"
                ? "bg-gray-100 font-semibold"
                : ""
            }`}
          >
            <PlusCircle size={18} /> Invite Faculty
          </Link>

          <button className="flex items-center w-full gap-3 px-4 py-3 rounded hover:bg-gray-100">
            <Settings size={18} /> Settings
          </button>
        </nav>

        <div className="px-4 py-6 mt-auto text-xs text-gray-500 border-t">
          &copy; {new Date().getFullYear()} SIHnchronize
        </div>
      </aside>

      {/* Right side */}
      <div className="flex flex-col flex-1">
        <header className="flex items-center justify-between px-8 py-4 bg-white border-b">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-cyan-600">
              SIHnchronize College Management Portal
            </div>
            <div className="hidden text-sm text-gray-500 md:block">
              {admin.institution}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100">
              <Bell size={16} /> <span className="text-sm">Notifications</span>
            </button>

            <div className="flex items-center gap-3 px-3 py-2 bg-white border rounded">
              <img
                src={
                  admin.profileUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    admin.name || "A"
                  )}&background=0D9488&color=fff`
                }
                alt="admin"
                className="rounded-full w-9 h-9"
              />
              <div className="text-sm text-left">
                <div className="font-medium">{admin.name}</div>
                <div className="text-xs text-gray-500">{admin.role}</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>

        {/* Page body */}
        <main className="p-8 overflow-auto">
          <Outlet />
        </main>
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Invite Faculty</h3>
              <button
                className="text-gray-500"
                onClick={() => setShowInviteModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={sendInvite} className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Faculty Name</label>
                <input
                  type="text"
                  value={inviteForm.name}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 mt-1 border rounded"
                  placeholder="e.g. Prof. Rajesh Kumar"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Email Address</label>
                <div className="relative">
                  <Mail
                    size={14}
                    className="absolute text-gray-400 left-3 top-3"
                  />
                  <input
                    type="email"
                    value={inviteForm.email}
                    onChange={(e) =>
                      setInviteForm({ ...inviteForm, email: e.target.value })
                    }
                    className="w-full px-10 py-2 mt-1 border rounded"
                    placeholder="faculty@college.edu"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600">Department</label>
                <select
                  value={inviteForm.department}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, department: e.target.value })
                  }
                  className="w-full px-3 py-2 mt-1 border rounded"
                >
                  <option value="">Select Department</option>
                  <option value="CSE">Computer Science & Engg.</option>
                  <option value="ECE">Electronics & Comm.</option>
                  <option value="ME">Mechanical Engg.</option>
                  <option value="CE">Civil Engg.</option>
                </select>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                  {inviteStatus === "error" && (
                    <span className="text-red-600">
                      Please add name & email.
                    </span>
                  )}
                  {inviteStatus === "sending" && <span>Sending invite...</span>}
                  {inviteStatus === "sent" && (
                    <span className="text-green-600">Invite sent!</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-2 border rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white rounded bg-cyan-600 hover:bg-cyan-700"
                  >
                    Send Invite
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
