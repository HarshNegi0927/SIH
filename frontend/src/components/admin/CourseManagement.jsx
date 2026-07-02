// src/components/admin/CourseManagement.jsx
import React, { useState, useEffect } from "react";
import { apiGet, apiPost, apiPut } from "../../lib/api";
import {
  BookOpen, Plus, X, Loader, AlertCircle, CheckCircle,
  ChevronDown, Users, Edit2
} from "lucide-react";

const CURRENT_YEAR = new Date().getFullYear();
const ACADEMIC_YEARS = [
  `${CURRENT_YEAR}-${CURRENT_YEAR + 1}`,
  `${CURRENT_YEAR - 1}-${CURRENT_YEAR}`,
];

const EMPTY_FORM = {
  name: "", code: "", department: "", program: "",
  semester: "", section: "", academicYear: ACADEMIC_YEARS[0],
  credits: "", schedule: "", type: "core", facultyId: "",
};

export default function CourseManagement() {
  const [courses, setCourses]     = useState([]);
  const [faculty, setFaculty]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast]         = useState(null);
  const [editId, setEditId]       = useState(null); // null = create, id = edit

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch courses + faculty list ──────────────────────────
  useEffect(() => {
    Promise.all([
      apiGet("/courses"),
      apiGet("/admin/students"), // reuse: we need faculty list
    ])
      .then(([cRes]) => {
        setCourses(cRes.data || []);
      })
      .catch((e) => showToast("error", e.message))
      .finally(() => setLoading(false));

    // Fetch faculty separately
    apiGet("/admin/faculty")
      .then((res) => setFaculty(res.faculty || res.data || []))
      .catch(() => {
        // fallback: try students endpoint pattern for faculty
        setFaculty([]);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Reset facultyId when department changes — old selection may be wrong dept
    if (name === "department") {
      setForm((p) => ({ ...p, department: value, facultyId: "" }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  // ── Open form for create ──────────────────────────────────
  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setShowForm(true);
  };

  // ── Open form for edit ────────────────────────────────────
  const openEdit = (course) => {
    setForm({
      name:         course.name         || "",
      code:         course.code         || "",
      department:   course.department   || "",
      program:      course.program      || "",
      semester:     course.semester     || "",
      section:      course.section      || "",
      academicYear: course.academicYear || ACADEMIC_YEARS[0],
      credits:      course.credits      || "",
      schedule:     course.schedule     || "",
      type:         course.type         || "core",
      facultyId:    course.facultyId?._id || course.facultyId || "",
    });
    setEditId(course._id);
    setShowForm(true);
  };

  // ── Submit: create or update ──────────────────────────────
  const handleSubmit = async () => {
    const required = ["name", "code", "department", "program", "semester", "section", "academicYear", "credits", "facultyId"];
    const missing = required.filter((f) => !form[f]);
    if (missing.length > 0) {
      showToast("error", `Fill required fields: ${missing.join(", ")}`);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        semester: Number(form.semester),
        credits:  Number(form.credits),
      };

      if (editId) {
        const res = await apiPut(`/courses/${editId}`, payload);
        setCourses((prev) => prev.map((c) => (c._id === editId ? res.data : c)));
        showToast("success", "Course updated!");
      } else {
        const res = await apiPost("/courses", payload);
        setCourses((prev) => [res.data, ...prev]);
        showToast("success", "Course created and assigned!");
      }

      setShowForm(false);
      setForm(EMPTY_FORM);
      setEditId(null);
    } catch (err) {
      showToast("error", err.message || "Failed to save course");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Faculty display name ──────────────────────────────────
  const facultyName = (f) =>
    `${f.profile?.firstName || ""} ${f.profile?.lastName || ""}`.trim() || f.email;

  // ── Filter faculty by selected department ─────────────────
  const filteredFaculty = form.department
    ? faculty.filter(f => f.profile?.department === form.department)
    : faculty;

  return (
    <div className="space-y-6">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium
          ${toast.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Course Management</h2>
          <p className="text-sm text-gray-500 mt-0.5">Create courses and assign faculty</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg hover:opacity-90"
          style={{ background: "#0aa5b7" }}
        >
          <Plus className="w-4 h-4" /> New Course
        </button>
      </div>

      {/* ── Create / Edit Form ────────────────────────────── */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-gray-800">
              {editId ? "Edit Course" : "Create New Course"}
            </h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Course Name */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Course Name *
              </label>
              <input name="name" value={form.name} onChange={handleChange}
                placeholder="e.g. Data Structures & Algorithms"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0aa5b7]" />
            </div>

            {/* Code */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Course Code *</label>
              <input name="code" value={form.code} onChange={handleChange}
                placeholder="e.g. CS301"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0aa5b7]" />
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Department *</label>
              <select name="department" value={form.department} onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0aa5b7] bg-white">
                <option value="">Select Department</option>
                {["CSE","ECE","ME","CE","EE","IT","MCA","MBA","Administration"].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Program */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Program *</label>
              <select name="program" value={form.program} onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0aa5b7] bg-white">
                <option value="">Select Program</option>
                {["B.Tech","M.Tech","BCA","MCA","MBA","B.Sc","M.Sc","PhD"].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Semester */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Semester *</label>
              <select name="semester" value={form.semester} onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0aa5b7] bg-white">
                <option value="">Select</option>
                {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Section */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Section *</label>
              <input name="section" value={form.section} onChange={handleChange}
                placeholder="e.g. A"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0aa5b7]" />
            </div>

            {/* Academic Year */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Academic Year *</label>
              <select name="academicYear" value={form.academicYear} onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0aa5b7] bg-white">
                {ACADEMIC_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            {/* Credits */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Credits *</label>
              <select name="credits" value={form.credits} onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0aa5b7] bg-white">
                <option value="">Select</option>
                {[1,2,3,4,5,6].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Type</label>
              <select name="type" value={form.type} onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0aa5b7] bg-white">
                <option value="core">Core</option>
                <option value="elective">Elective</option>
              </select>
            </div>

            {/* Schedule */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Schedule</label>
              <input name="schedule" value={form.schedule} onChange={handleChange}
                placeholder="e.g. Mon/Wed/Fri 10:00-11:00"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0aa5b7]" />
            </div>

            {/* Faculty Assign */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Assign Faculty *
              </label>
              {!form.department ? (
                <div className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 bg-gray-50 rounded-lg text-sm text-gray-500">
                  Select a department first to see available faculty.
                </div>
              ) : filteredFaculty.length === 0 ? (
                <div className="flex items-center gap-2 px-3 py-2.5 border border-orange-200 bg-orange-50 rounded-lg text-sm text-orange-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  No faculty in <strong>{form.department}</strong> department. Add faculty first from "Register Faculty" page.
                </div>
              ) : (
                <select name="facultyId" value={form.facultyId} onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0aa5b7] bg-white">
                  <option value="">Select Faculty ({form.department})</option>
                  {filteredFaculty.map(f => (
                    <option key={f._id} value={f._id}>
                      {facultyName(f)} ({f.email})
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button onClick={handleSubmit} disabled={submitting}
              className="px-5 py-2.5 text-white text-sm font-medium rounded-lg hover:opacity-90 disabled:opacity-50"
              style={{ background: "#0aa5b7" }}>
              {submitting ? "Saving..." : editId ? "Update Course" : "Create & Assign"}
            </button>
            <button onClick={() => setShowForm(false)}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Course List ───────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader className="w-6 h-6 animate-spin mr-2" /> Loading courses...
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 font-medium">No courses yet</p>
          <p className="text-gray-400 text-sm mt-1">Click "New Course" to create and assign one to faculty</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {["Code", "Course Name", "Dept", "Sem", "Section", "Credits", "Type", "Faculty", ""].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {courses.map(c => {
                  const fac = c.facultyId;
                  const facName = fac
                    ? `${fac.profile?.firstName || ""} ${fac.profile?.lastName || ""}`.trim() || fac.email
                    : "—";
                  return (
                    <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-bold text-gray-800">{c.code}</td>
                      <td className="px-4 py-3 text-sm text-gray-800 max-w-[180px] truncate">{c.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{c.department}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 text-center">{c.semester}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 text-center">{c.section}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 text-center">{c.credits}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          c.type === "core" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                        }`}>
                          {c.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{facName}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => openEdit(c)}
                          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}