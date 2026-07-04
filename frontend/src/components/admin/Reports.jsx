// src/components/admin/Reports.jsx
import { useState, useEffect } from "react";
import { apiGet } from "../../lib/api";
import {
  Download, Users, Award, Briefcase, TrendingUp,
  Star, BookOpen, Loader, BarChart2
} from "lucide-react";

export default function Reports() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    apiGet("/admin/students")
      .then(res => setStudents(res.students || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ── Compute stats ─────────────────────────────────────────
  const stats = {
    total:        students.length,
    withInternship: students.filter(s => s.internships?.some(i => i.verification?.status === "approved")).length,
    withPlacement:  students.filter(s => s.placements?.some(p => p.verification?.status === "approved")).length,
    withProject:    students.filter(s => s.projects?.some(p => p.verification?.status === "approved")).length,
    withAward:      students.filter(s => s.awards?.some(a => a.verification?.status === "approved")).length,
    avgCgpa:        students.length
      ? (students.reduce((acc, s) => acc + (s.academicInfo?.cgpa || 0), 0) / students.length).toFixed(2)
      : "—",
    totalCerts: students.reduce((acc, s) => acc + (s.certifications?.filter(c => c.verification?.status === "approved")?.length || 0), 0),
    pendingVerifications: students.reduce((acc, s) => {
      const types = ["projects", "internships", "awards", "placements", "certifications"];
      return acc + types.reduce((a, t) => a + (s[t]?.filter(i => i.verification?.status === "pending")?.length || 0), 0);
    }, 0),
  };

  // ── Dept wise breakdown ───────────────────────────────────
  const deptMap = {};
  students.forEach(s => {
    const dept = s.academicInfo?.department || "Unknown";
    if (!deptMap[dept]) deptMap[dept] = { dept, count: 0, internships: 0, placements: 0, avgCgpa: [] };
    deptMap[dept].count++;
    if (s.internships?.some(i => i.verification?.status === "approved")) deptMap[dept].internships++;
    if (s.placements?.some(p => p.verification?.status === "approved")) deptMap[dept].placements++;
    if (s.academicInfo?.cgpa) deptMap[dept].avgCgpa.push(s.academicInfo.cgpa);
  });
  const deptStats = Object.values(deptMap).map(d => ({
    ...d,
    avgCgpa: d.avgCgpa.length ? (d.avgCgpa.reduce((a, b) => a + b, 0) / d.avgCgpa.length).toFixed(2) : "—",
  }));

  // ── Top achievers ────────────────────────────────────────
  const topAchievers = [...students]
    .map(s => {
      const types = ["projects", "internships", "awards", "placements", "certifications"];
      const total = types.reduce((acc, t) => acc + (s[t]?.filter(i => i.verification?.status === "approved")?.length || 0), 0);
      return {
        name: `${s.profile?.firstName || ""} ${s.profile?.lastName || ""}`.trim() || s.email,
        regNo: s.profile?.registrationNo || "—",
        dept: s.academicInfo?.department || "—",
        cgpa: s.academicInfo?.cgpa || 0,
        total,
      };
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  // ── Export CSV ────────────────────────────────────────────
  const exportCSV = () => {
    setExporting(true);
    const headers = [
      "Name", "Reg No", "Email", "Department", "Program", "Semester", "CGPA",
      "Certifications", "Projects", "Internships", "Awards", "Placements"
    ];
    const rows = students.map(s => [
      `${s.profile?.firstName || ""} ${s.profile?.lastName || ""}`.trim(),
      s.profile?.registrationNo || "",
      s.email || "",
      s.academicInfo?.department || "",
      s.academicInfo?.program || "",
      s.academicInfo?.currentSemester || "",
      s.academicInfo?.cgpa || "",
      s.certifications?.filter(c => c.verification?.status === "approved")?.length || 0,
      s.projects?.filter(p => p.verification?.status === "approved")?.length || 0,
      s.internships?.filter(i => i.verification?.status === "approved")?.length || 0,
      s.awards?.filter(a => a.verification?.status === "approved")?.length || 0,
      s.placements?.filter(p => p.verification?.status === "approved")?.length || 0,
    ]);

    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `SIHchronize_Report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExporting(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-24 text-gray-400">
      <Loader className="w-6 h-6 animate-spin mr-2" /> Loading report data...
    </div>
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Institution Reports</h2>
          <p className="text-sm text-gray-500 mt-0.5">Achievement analytics across all students</p>
        </div>
        <button onClick={exportCSV} disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg hover:opacity-90 disabled:opacity-50"
          style={{ background: "#0aa5b7" }}>
          <Download className="w-4 h-4" />
          {exporting ? "Exporting..." : "Export CSV"}
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Students",    value: stats.total,            icon: Users,      color: "bg-blue-50 border-blue-100",     iconColor: "text-blue-600"   },
          { label: "Avg CGPA",          value: stats.avgCgpa,          icon: BarChart2,  color: "bg-purple-50 border-purple-100", iconColor: "text-purple-600" },
          { label: "With Internship",   value: stats.withInternship,   icon: Briefcase,  color: "bg-cyan-50 border-cyan-100",     iconColor: "text-cyan-600"   },
          { label: "Placed",            value: stats.withPlacement,    icon: Award,      color: "bg-green-50 border-green-100",   iconColor: "text-green-600"  },
          { label: "With Projects",     value: stats.withProject,      icon: TrendingUp, color: "bg-indigo-50 border-indigo-100", iconColor: "text-indigo-600" },
          { label: "With Awards",       value: stats.withAward,        icon: Star,       color: "bg-yellow-50 border-yellow-100", iconColor: "text-yellow-600" },
          { label: "Verified Certs",    value: stats.totalCerts,       icon: BookOpen,   color: "bg-orange-50 border-orange-100", iconColor: "text-orange-600" },
          { label: "Pending Review",    value: stats.pendingVerifications, icon: Loader, color: "bg-red-50 border-red-100",       iconColor: "text-red-500"    },
        ].map(({ label, value, icon: Icon, color, iconColor }) => (
          <div key={label} className={`border rounded-xl p-4 ${color}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
              </div>
              <Icon className={`w-6 h-6 ${iconColor} opacity-70`} />
            </div>
          </div>
        ))}
      </div>

      {/* Dept-wise breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">Department-wise Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Department", "Students", "Avg CGPA", "Internships", "Placements"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {deptStats.sort((a, b) => b.count - a.count).map(d => (
                <tr key={d.dept} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-800">{d.dept}</td>
                  <td className="px-4 py-3 text-gray-600">{d.count}</td>
                  <td className="px-4 py-3 text-gray-600">{d.avgCgpa}</td>
                  <td className="px-4 py-3">
                    <span className="text-cyan-700 font-medium">{d.internships}</span>
                    <span className="text-gray-400 text-xs ml-1">({d.count ? Math.round(d.internships/d.count*100) : 0}%)</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-green-700 font-medium">{d.placements}</span>
                    <span className="text-gray-400 text-xs ml-1">({d.count ? Math.round(d.placements/d.count*100) : 0}%)</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top achievers */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">Top Achievers (by verified achievements)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["#", "Name", "Reg No", "Dept", "CGPA", "Achievements"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topAchievers.map((s, i) => (
                <tr key={s.regNo} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400 font-bold">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                  <td className="px-4 py-3 text-gray-500">{s.regNo}</td>
                  <td className="px-4 py-3 text-gray-500">{s.dept}</td>
                  <td className="px-4 py-3 font-semibold text-purple-700">{s.cgpa || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded-full text-xs font-bold">{s.total}</span>
                  </td>
                </tr>
              ))}
              {topAchievers.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No verified achievements yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}