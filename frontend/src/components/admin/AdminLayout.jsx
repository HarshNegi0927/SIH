import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  User, Upload, BarChart, UserPlus, CheckCircle, Building,
  FileText, ClipboardCheck, UploadCloud, Bell, LogOut, Mail,
  Building2, Settings, PlusCircle
} from "lucide-react";

const AdminLayout = () => {
  const location = useLocation();

  const [admin, setAdmin] = useState({
    name: "Dr. Ananya Sharma",
    email: "admin@SIHnc.edu",
    institution: "MotiLal Nehru National Institute of Technology",
    role: "Platform Admin",
    aishe: "AISHE-98765",
    contact: "+91 88400 47057",
    profileUrl: "",
  });

  const [stats] = useState({
    students: 1245,
    faculty: 87,
    pendingProofs: 32,
    attendanceToday: 145,
    activeWorkshops: 3,
  });

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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md border-r">
        <div className="px-6 py-6 flex items-center space-x-3 border-b">
          <div className="w-12 h-12 bg-cyan-500 rounded-md flex items-center justify-center text-white font-bold text-lg">
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
              location.pathname === "/admin/edit" ? "bg-gray-100 font-semibold" : ""
            }`}
          >
            <User size={18} /> Edit Profile
          </Link>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-100">
            <Upload size={18} /> Bulk Upload Students
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-100">
            <UploadCloud size={18} /> NAAC /AICTE Upload
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-100">
            <FileText size={18} /> View Reports
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-100">
            <ClipboardCheck size={18} />Courses
          </button>

          <button
            onClick={openInvite}
            className="w-full flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-100"
          >
            <PlusCircle size={18} /> Invite Faculty
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-100">
            <Settings size={18} /> Settings
          </button>
        </nav>

        <div className="px-4 mt-auto py-6 border-t text-xs text-gray-500">
          &copy; {new Date().getFullYear()} SIHnchronize
        </div>
      </aside>

      {/* Right side */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between bg-white border-b px-8 py-4">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-cyan-600">
              SIHnchronize College Management Portal
            </div>
            <div className="text-sm text-gray-500 hidden md:block">
              {admin.institution}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100">
              <Bell size={16} /> <span className="text-sm">Notifications</span>
            </button>

            <div className="flex items-center gap-3 px-3 py-2 rounded bg-white border">
              <img
                src={
                  admin.profileUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(admin.name)}&background=0D9488&color=fff`
                }
                alt="admin"
                className="w-9 h-9 rounded-full"
              />
              <div className="text-sm text-left">
                <div className="font-medium">{admin.name}</div>
                <div className="text-xs text-gray-500">{admin.role}</div>
              </div>
            </div>

            <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>

        {/* Page body */}
        <main className="p-8 overflow-auto">
          {location.pathname === "/admin" ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Section */}
                <div className="col-span-1 bg-white rounded shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Profile</h2>
                  <div className="flex flex-col items-center">
                    <div className="w-40 h-40 rounded border overflow-hidden flex items-center justify-center mb-4">
                      <img
                        src={
                          admin.profileUrl ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(admin.name)}&background=0D9488&color=fff&size=256`
                        }
                        alt="profile"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <label className="inline-flex flex-col items-center">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfileUpload}
                      />
                      <span className="px-4 py-2 bg-cyan-600 text-white rounded cursor-pointer text-sm">
                        Upload Photo
                      </span>
                    </label>

                    <div className="mt-5 w-full">
                      <div className="text-sm text-gray-500">Name</div>
                      <div className="font-medium">{admin.name}</div>

                      <div className="mt-3 text-sm text-gray-500">Email</div>
                      <div className="font-medium">{admin.email}</div>

                      <div className="mt-3 text-sm text-gray-500">Institution</div>
                      <div className="font-medium">{admin.institution}</div>

                      <div className="mt-3 text-sm text-gray-500">AISHE Code</div>
                      <div className="font-medium">{admin.aishe}</div>

                      <div className="mt-3 text-sm text-gray-500">Contact</div>
                      <div className="font-medium">{admin.contact}</div>
                    </div>
                  </div>
                </div>

                <div className="col-span-1 lg:col-span-2 space-y-6">
                  <div className="bg-white p-4 rounded shadow">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Quick Actions</h3>
                      <div className="text-sm text-gray-500">One-click admin tools</div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <button className="flex items-center gap-2 border px-4 py-3 rounded hover:bg-gray-50">
                        <Upload size={16} /> Bulk Upload Students
                      </button>

                      <button className="flex items-center gap-2 border px-4 py-3 rounded hover:bg-gray-50">
                        <UploadCloud size={16} /> NAAC/AICTE Upload
                      </button>

                      <button className="flex items-center gap-2 border px-4 py-3 rounded hover:bg-gray-50">
                        <FileText size={16} /> View Reports
                      </button>

                      <button
                        className="flex items-center gap-2 border px-4 py-3 rounded hover:bg-gray-50"
                        onClick={openInvite}
                      >
                        <PlusCircle size={16} /> Invite Faculty
                      </button>

                      <button className="flex items-center gap-2 border px-4 py-3 rounded hover:bg-gray-50">
                        <Building2 size={16} /> Institution Settings
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded shadow">
                      <h4 className="font-semibold mb-3">Recent Activity</h4>
                      <ul className="space-y-3 text-sm text-gray-700">
                        {activity.map((act) => (
                          <li key={act.id} className="flex justify-between items-start">
                            <div>{act.text}</div>
                            <div className="text-xs text-gray-400">{act.time}</div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white p-4 rounded shadow">
                      <h4 className="font-semibold mb-3">Reports & Readiness</h4>
                      <div className="text-sm text-gray-700 space-y-2">
                        <div>
                          <strong>NAAC/NIRF readiness:</strong> Snapshot available for export.
                        </div>
                        <div>
                          <strong>Faculty APAR linkage:</strong> {stats.faculty} faculty linked.
                        </div>
                        <div>
                          <strong>Exportable portfolios:</strong> Verified student portfolios available.
                        </div>
                        <div className="mt-3">
                          <button className="border px-3 py-2 rounded text-sm">
                            Generate NAAC Report
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <Outlet />
          )}
        </main>
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg w-full max-w-md shadow-lg p-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Invite Faculty</h3>
              <button className="text-gray-500" onClick={() => setShowInviteModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={sendInvite} className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Faculty Name</label>
                <input
                  type="text"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                  className="w-full border rounded px-3 py-2 mt-1"
                  placeholder="e.g. Prof. Rajesh Kumar"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Email Address</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    className="w-full border rounded px-10 py-2 mt-1"
                    placeholder="faculty@college.edu"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600">Department</label>
                <select
                  value={inviteForm.department}
                  onChange={(e) => setInviteForm({ ...inviteForm, department: e.target.value })}
                  className="w-full border rounded px-3 py-2 mt-1"
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
                  {inviteStatus === "error" && <span className="text-red-600">Please add name & email.</span>}
                  {inviteStatus === "sending" && <span>Sending invite...</span>}
                  {inviteStatus === "sent" && <span className="text-green-600">Invite sent!</span>}
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
                    className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700"
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
