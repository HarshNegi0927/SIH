// src/components/student/StudentDashboard.jsx
import { useState, useEffect } from "react";
import {
  BookOpen, Calendar, FileText, LogOut, Bell, Menu, X,
  CheckCircle, XCircle, Clock, AlertTriangle, Loader,
  Upload, ChevronRight, TrendingUp, User
} from "lucide-react";
import { useAuth } from "../../context/authContext";
import { apiGet } from "../../lib/api";
import { useNavigate } from "react-router-dom";

// ─── Attendance % badge ──────────────────────────────────────
function AttBadge({ pct }) {
  if (pct === null || pct === undefined)
    return <span className="text-xs text-gray-400">No data</span>;
  const color =
    pct >= 75 ? "bg-green-100 text-green-700" :
    pct >= 60 ? "bg-yellow-100 text-yellow-700" :
                "bg-red-100 text-red-700";
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>
      {pct}%
    </span>
  );
}

// ─── Mini progress bar ────────────────────────────────────────
function ProgressBar({ pct }) {
  const color = pct >= 75 ? "#16a34a" : pct >= 60 ? "#d97706" : "#dc2626";
  return (
    <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1">
      <div className="h-1.5 rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%`, background: color }} />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [menuOpen, setMenuOpen] = useState(false);

  // Courses
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Attendance
  const [attData, setAttData] = useState(null);   // { records, summary }
  const [attLoading, setAttLoading] = useState(false);

  // Assignments
  const [assignments, setAssignments] = useState([]);
  const [assLoading, setAssLoading] = useState(false);

  // All-courses attendance summary (for overview)
  const [attSummaries, setAttSummaries] = useState({}); // courseId → summary

  const fullName =
    `${user?.profile?.firstName || ""} ${user?.profile?.lastName || ""}`.trim() ||
    user?.email || "Student";
  const initials = fullName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const dept = user?.academicInfo?.department || "—";
  const sem  = user?.academicInfo?.currentSemester || "—";
  const regNo = user?.profile?.registrationNo || "—";

  // ── Fetch courses on mount ────────────────────────────────
  useEffect(() => {
    const d = user?.academicInfo?.department;
    const s = user?.academicInfo?.currentSemester;
    const params = d && s ? `?department=${d}&semester=${s}` : "";

    apiGet(`/courses${params}`)
      .then(res => {
        const list = res.data || [];
        setCourses(list);
        if (list.length > 0) setSelectedCourse(list[0]);

        // Fetch attendance summary for each course (for overview cards)
        list.forEach(c => {
          apiGet(`/attendance/my?courseId=${c._id}`)
            .then(r => {
              setAttSummaries(prev => ({
                ...prev,
                [c._id]: r.data?.summary || null,
              }));
            })
            .catch(() => {});
        });
      })
      .catch(err => console.error("Courses fetch failed:", err))
      .finally(() => setCoursesLoading(false));
  }, []);

  // ── Fetch attendance when course/tab changes ──────────────
  useEffect(() => {
    if (!selectedCourse || activeTab !== "attendance") return;
    setAttLoading(true);
    setAttData(null);
    apiGet(`/attendance/my?courseId=${selectedCourse._id}`)
      .then(res => setAttData(res.data))
      .catch(err => console.error("Attendance fetch failed:", err))
      .finally(() => setAttLoading(false));
  }, [selectedCourse, activeTab]);

  // ── Fetch assignments when course/tab changes ─────────────
  useEffect(() => {
    if (!selectedCourse || activeTab !== "assignments") return;
    setAssLoading(true);
    apiGet(`/assignments?courseId=${selectedCourse._id}`)
      .then(res => setAssignments(res.data || []))
      .catch(err => console.error("Assignments fetch failed:", err))
      .finally(() => setAssLoading(false));
  }, [selectedCourse, activeTab]);

  const handleLogout = () => { logout(); navigate("/login"); };

  const tabs = [
    { id: "overview",     label: "Overview",    icon: TrendingUp },
    { id: "attendance",   label: "Attendance",  icon: Calendar   },
    { id: "assignments",  label: "Assignments", icon: FileText   },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ──────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ background: "#7c3aed" }}>
              {initials}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-tight">{fullName}</p>
              <p className="text-xs text-gray-500">{dept} · Sem {sem} · {regNo}</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => navigate("/profile")}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
              <User className="w-4 h-4" /> Profile
            </button>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white rounded-lg hover:opacity-90"
              style={{ background: "#7c3aed" }}>
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden px-4 pb-3 flex flex-col gap-2 border-t border-gray-100 pt-2">
            <button onClick={() => { navigate("/profile"); setMenuOpen(false); }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50">
              <User className="w-4 h-4" /> My Profile
            </button>
            <button onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-white rounded-lg"
              style={{ background: "#7c3aed" }}>
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        )}
      </header>

      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-5xl mx-auto space-y-5">

        {/* ── Course Selector ──────────────────────────────── */}
        {activeTab !== "overview" && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Select Course</p>
            {coursesLoading ? (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Loader className="w-4 h-4 animate-spin" /> Loading...
              </div>
            ) : courses.length === 0 ? (
              <p className="text-sm text-gray-500">No courses found for your department & semester.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {courses.map(c => (
                  <button key={c._id} onClick={() => setSelectedCourse(c)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedCourse?._id === c._id
                        ? "text-white shadow"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    style={selectedCourse?._id === c._id ? { background: "#7c3aed" } : {}}>
                    {c.code} — {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Tabs ─────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
          <div className="flex min-w-max">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3.5 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-white border-b-2"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                style={activeTab === tab.id ? { background: "#7c3aed", borderColor: "#7c3aed" } : {}}>
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════ */}
        {/* OVERVIEW TAB                                      */}
        {/* ══════════════════════════════════════════════════ */}
        {activeTab === "overview" && (
          <div className="space-y-5">

            {/* Stat chips */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Department",  value: dept,             color: "bg-purple-50 border-purple-100 text-purple-700" },
                { label: "Semester",    value: `Sem ${sem}`,     color: "bg-cyan-50 border-cyan-100 text-cyan-700"       },
                { label: "Reg No",      value: regNo,            color: "bg-blue-50 border-blue-100 text-blue-700"       },
                { label: "Courses",     value: courses.length,   color: "bg-green-50 border-green-100 text-green-700"    },
              ].map(({ label, value, color }) => (
                <div key={label} className={`border rounded-xl p-4 ${color}`}>
                  <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{label}</p>
                  <p className="text-lg font-bold mt-1">{value}</p>
                </div>
              ))}
            </div>

            {/* Course cards with attendance */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Your Courses</h3>
              {coursesLoading ? (
                <div className="flex items-center gap-2 py-8 text-gray-400 justify-center">
                  <Loader className="w-5 h-5 animate-spin" /> Loading courses...
                </div>
              ) : courses.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
                  <BookOpen className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                  <p className="text-gray-500">No courses assigned yet.</p>
                  <p className="text-xs text-gray-400 mt-1">Contact your admin if this seems wrong.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courses.map(c => {
                    const summary = attSummaries[c._id];
                    const pct = summary?.percentage ?? null;
                    const faculty = c.facultyId;
                    const facName = faculty
                      ? `${faculty.profile?.firstName || ""} ${faculty.profile?.lastName || ""}`.trim()
                      : "—";
                    return (
                      <div key={c._id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-base font-bold text-gray-900">{c.code}</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                c.type === "core" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                              }`}>{c.type}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-0.5">{c.name}</p>
                          </div>
                          <AttBadge pct={pct} />
                        </div>
                        <div className="text-xs text-gray-400 space-y-0.5 mb-3">
                          <p>Sem {c.semester} · {c.credits} credits · Section {c.section}</p>
                          <p>Faculty: {facName}</p>
                          {c.schedule && <p>{c.schedule}</p>}
                        </div>
                        {pct !== null && <ProgressBar pct={pct} />}
                        {summary && (
                          <p className="text-xs text-gray-400 mt-1">
                            {summary.present}/{summary.total} classes attended
                          </p>
                        )}
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => { setSelectedCourse(c); setActiveTab("attendance"); }}
                            className="flex-1 py-1.5 text-xs font-medium text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50">
                            Attendance
                          </button>
                          <button
                            onClick={() => { setSelectedCourse(c); setActiveTab("assignments"); }}
                            className="flex-1 py-1.5 text-xs font-medium text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50">
                            Assignments
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════ */}
        {/* ATTENDANCE TAB                                    */}
        {/* ══════════════════════════════════════════════════ */}
        {activeTab === "attendance" && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">
                Attendance {selectedCourse ? `— ${selectedCourse.name}` : ""}
              </h2>
            </div>
            <div className="p-5">
              {!selectedCourse ? (
                <p className="text-gray-500 text-sm text-center py-8">Select a course above.</p>
              ) : attLoading ? (
                <div className="flex items-center justify-center gap-2 py-10 text-gray-400">
                  <Loader className="w-5 h-5 animate-spin" /> Loading...
                </div>
              ) : !attData ? (
                <p className="text-sm text-gray-400 text-center py-8">No attendance data found.</p>
              ) : (
                <>
                  {/* Summary strip */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                    {[
                      { label: "Total Classes", value: attData.summary.total,   color: "bg-gray-50   text-gray-700"   },
                      { label: "Present",        value: attData.summary.present, color: "bg-green-50  text-green-700"  },
                      { label: "Absent",         value: attData.summary.absent,  color: "bg-red-50    text-red-700"    },
                      { label: "Percentage",     value: `${attData.summary.percentage}%`,
                        color: attData.summary.percentage >= 75 ? "bg-green-50 text-green-700"
                             : attData.summary.percentage >= 60 ? "bg-yellow-50 text-yellow-700"
                             : "bg-red-50 text-red-700" },
                    ].map(({ label, value, color }) => (
                      <div key={label} className={`rounded-xl p-4 border ${color}`}>
                        <p className="text-xs font-semibold uppercase tracking-wide opacity-60">{label}</p>
                        <p className="text-2xl font-bold mt-1">{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Status warning */}
                  {attData.summary.status !== "safe" && (
                    <div className={`flex items-center gap-2 p-3 rounded-lg mb-4 text-sm ${
                      attData.summary.status === "warning"
                        ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}>
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      {attData.summary.status === "warning"
                        ? "⚠️ Attendance below 75% — attend more classes to stay safe."
                        : "🚨 Critical attendance! Below 60% — you may be debarred."}
                    </div>
                  )}

                  {/* Date-wise records */}
                  {attData.records.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-6">No records yet for this course.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                            <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {attData.records.map(r => (
                            <tr key={r._id} className="hover:bg-gray-50">
                              <td className="px-4 py-2.5 text-gray-700">
                                {new Date(r.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                              </td>
                              <td className="px-4 py-2.5">
                                {r.status === "present" ? (
                                  <span className="flex items-center gap-1.5 text-green-600 font-medium">
                                    <CheckCircle className="w-4 h-4" /> Present
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1.5 text-red-500 font-medium">
                                    <XCircle className="w-4 h-4" /> Absent
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════ */}
        {/* ASSIGNMENTS TAB                                   */}
        {/* ══════════════════════════════════════════════════ */}
        {activeTab === "assignments" && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">
                Assignments {selectedCourse ? `— ${selectedCourse.name}` : ""}
              </h2>
            </div>
            <div className="p-5">
              {!selectedCourse ? (
                <p className="text-gray-500 text-sm text-center py-8">Select a course above.</p>
              ) : assLoading ? (
                <div className="flex items-center justify-center gap-2 py-10 text-gray-400">
                  <Loader className="w-5 h-5 animate-spin" /> Loading...
                </div>
              ) : assignments.length === 0 ? (
                <div className="text-center py-10">
                  <FileText className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm text-gray-500">No assignments yet for this course.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {assignments.map(a => {
                    const overdue  = a.isOverdue;
                    const dueSoon  = a.isDueSoon;
                    const daysLeft = a.daysUntilDue;

                    return (
                      <AssignmentCard
                        key={a._id}
                        assignment={a}
                        overdue={overdue}
                        dueSoon={dueSoon}
                        daysLeft={daysLeft}
                        courseId={selectedCourse._id}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ─── Assignment Card with submit ─────────────────────────────
function AssignmentCard({ assignment: a, overdue, dueSoon, daysLeft, courseId }) {
  const [submission, setSubmission] = useState(null);
  const [subLoading, setSubLoading] = useState(true);
  const [file, setFile]             = useState(null);
  const [uploading, setUploading]   = useState(false);
  const [toast, setToast]           = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    apiGet(`/assignments/${a._id}/my-submission`)
      .then(res => setSubmission(res.data))
      .catch(() => setSubmission(null))
      .finally(() => setSubLoading(false));
  }, [a._id]);

  const handleSubmit = async () => {
    if (!file) return showToast("error", "Select a file first");
    setUploading(true);
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`/api/assignments/${a._id}/submit`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      setSubmission(data.data);
      setFile(null);
      showToast("success", "Submitted successfully!");
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setUploading(false);
    }
  };

  const statusTag = overdue
    ? { label: "Overdue", cls: "bg-red-100 text-red-700" }
    : dueSoon
    ? { label: `Due in ${daysLeft}d`, cls: "bg-yellow-100 text-yellow-700" }
    : { label: "Active", cls: "bg-blue-100 text-blue-700" };

  if (a.status === "completed") {
    statusTag.label = "Completed";
    statusTag.cls   = "bg-gray-100 text-gray-600";
  }

  return (
    <div className="border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
      {toast && (
        <div className={`flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg mb-3 ${
          toast.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
        }`}>
          {toast.type === "success" ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
          {toast.msg}
        </div>
      )}

      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-gray-900">{a.title}</h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusTag.cls}`}>
              {statusTag.label}
            </span>
          </div>
          {a.description && <p className="text-xs text-gray-500 mt-0.5">{a.description}</p>}
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-gray-400">Total Marks</p>
          <p className="text-base font-bold text-gray-800">{a.totalMarks}</p>
        </div>
      </div>

      <div className="flex gap-4 text-xs text-gray-400 mb-4">
        <span>Assigned: {new Date(a.assignedDate).toLocaleDateString("en-IN")}</span>
        <span>Due: {new Date(a.dueDate).toLocaleDateString("en-IN")}</span>
      </div>

      {/* Submission section */}
      {subLoading ? (
        <div className="text-xs text-gray-400 flex items-center gap-1">
          <Loader className="w-3 h-3 animate-spin" /> Checking submission...
        </div>
      ) : submission ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-green-700 text-xs font-semibold mb-1">
            <CheckCircle className="w-4 h-4" /> Submitted
          </div>
          <p className="text-xs text-gray-500">
            {new Date(submission.submittedAt).toLocaleDateString("en-IN", {
              day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
            })}
          </p>
          {submission.marks !== undefined && submission.marks !== null ? (
            <p className="text-xs font-bold text-green-700 mt-1">
              Marks: {submission.marks} / {a.totalMarks}
            </p>
          ) : (
            <p className="text-xs text-gray-400 mt-1">Marks not graded yet</p>
          )}
        </div>
      ) : overdue || a.status === "completed" ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-500">
          {overdue ? "Submission deadline has passed." : "Assignment closed."}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <label className="flex-1 flex items-center gap-2 px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-400 transition-colors">
            <Upload className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-xs text-gray-500 truncate">
              {file ? file.name : "Click to select file"}
            </span>
            <input type="file" className="hidden" onChange={e => setFile(e.target.files[0])} />
          </label>
          <button onClick={handleSubmit} disabled={uploading || !file}
            className="px-4 py-2 text-xs font-semibold text-white rounded-lg hover:opacity-90 disabled:opacity-50 whitespace-nowrap"
            style={{ background: "#7c3aed" }}>
            {uploading ? "Uploading..." : "Submit"}
          </button>
        </div>
      )}
    </div>
  );
}
