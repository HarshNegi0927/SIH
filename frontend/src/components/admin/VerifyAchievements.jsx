// src/components/admin/VerifyAchievements.jsx
import { useState, useEffect } from "react";
import { apiGet, apiPost } from "../../lib/api";
import {
  CheckCircle, XCircle, Loader, AlertCircle,
  ChevronDown, ChevronUp, ExternalLink, Search
} from "lucide-react";

const TYPES = [
  { key: "projects",      label: "Projects"      },
  { key: "internships",   label: "Internships"   },
  { key: "awards",        label: "Awards"        },
  { key: "placements",    label: "Placements"    },
  { key: "certifications", label: "Certifications" },
];

const StatusBadge = ({ status }) => {
  const map = {
    pending:  "bg-orange-100 text-orange-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${map[status] || map.pending}`}>
      {status}
    </span>
  );
};

export default function VerifyAchievements() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState("pending"); // pending | approved | rejected | all
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch]     = useState("");
  const [expanded, setExpanded] = useState({}); // studentId → true/false
  const [verifying, setVerifying] = useState(null);
  const [remark, setRemark]     = useState("");
  const [toast, setToast]       = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    apiGet("/admin/students")
      .then(res => setStudents(res.students || []))
      .catch(err => showToast("error", err.message))
      .finally(() => setLoading(false));
  }, []);

  // Flatten all achievements across all types for a student
  const getAchievements = (student) => {
    const all = [];
    TYPES.forEach(({ key, label }) => {
      (student[key] || []).forEach(item => {
        all.push({
          ...item,
          _type: key,
          _typeLabel: label,
          _studentId: student._id,
          _studentName: `${student.profile?.firstName || ""} ${student.profile?.lastName || ""}`.trim() || student.email,
          _regNo: student.profile?.registrationNo || "—",
        });
      });
    });
    return all;
  };

  const handleVerify = async (item, status) => {
    setVerifying(`${item._id}-${status}`);
    try {
      await apiPost("/users/verify-achievement", {
        studentId: item._studentId,
        type: item._type,
        itemId: item._id,
        status,
        remark,
      });

      // Update local state
      setStudents(prev => prev.map(s => {
        if (s._id !== item._studentId) return s;
        return {
          ...s,
          [item._type]: (s[item._type] || []).map(a =>
            a._id === item._id
              ? { ...a, verification: { status, remark, verifiedAt: new Date() } }
              : a
          ),
        };
      }));
      setRemark("");
      showToast("success", `${status === "approved" ? "Approved" : "Rejected"} successfully`);
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setVerifying(null);
    }
  };

  // All achievements across all students flattened + filtered
  const allItems = students.flatMap(s => getAchievements(s))
    .filter(item => {
      const statusMatch = filter === "all" || item.verification?.status === filter;
      const typeMatch   = typeFilter === "all" || item._type === typeFilter;
      const searchMatch = !search ||
        item._studentName.toLowerCase().includes(search.toLowerCase()) ||
        item._regNo.toLowerCase().includes(search.toLowerCase()) ||
        (item.title || item.company || "").toLowerCase().includes(search.toLowerCase());
      return statusMatch && typeMatch && searchMatch;
    });

  const pendingCount = students.flatMap(s => getAchievements(s))
    .filter(i => i.verification?.status === "pending").length;

  return (
    <div className="space-y-5">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium border
          ${toast.type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
          {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Verify Student Achievements</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {pendingCount > 0
              ? <span className="text-orange-600 font-semibold">{pendingCount} pending</span>
              : "All caught up!"} · {allItems.length} shown
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search student / reg no / title..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0aa5b7]" />
        </div>

        {/* Status filter */}
        <div className="flex gap-1">
          {["all", "pending", "approved", "rejected"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                filter === f ? "text-white bg-[#0aa5b7]" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}>
              {f}
            </button>
          ))}
        </div>

        {/* Type filter */}
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0aa5b7] bg-white">
          <option value="all">All Types</option>
          {TYPES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
        </select>
      </div>

      {/* Achievement list */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader className="w-6 h-6 animate-spin mr-2" /> Loading...
        </div>
      ) : allItems.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">No achievements found for selected filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {allItems.map(item => {
            const name    = item.title || item.company || "—";
            const isPending = item.verification?.status === "pending";
            const key     = `${item._studentId}-${item._type}-${item._id}`;

            return (
              <div key={key} className={`bg-white rounded-xl border shadow-sm overflow-hidden ${
                isPending ? "border-orange-200" : "border-gray-200"
              }`}>
                <div className="p-4 flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-gray-900 truncate">{name}</span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">{item._typeLabel}</span>
                      <StatusBadge status={item.verification?.status || "pending"} />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {item._studentName} · {item._regNo}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {item.techStack && `Tech: ${item.techStack}`}
                      {item.role && `Role: ${item.role}`}
                      {item.issuedBy && `Issued by: ${item.issuedBy}`}
                      {item.stipend && ` · ₹${item.stipend}`}
                      {item.package && ` · ${item.package}`}
                      {item.year && ` · ${item.year}`}
                    </div>
                    {item.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                    )}
                    {/* Proof links */}
                    <div className="flex gap-3 mt-1.5 flex-wrap">
                      {(item.githubUrl || item.liveUrl || item.offerLetterUrl || item.proofUrl || item.fileUrl) && (
                        <>
                          {item.githubUrl && <a href={item.githubUrl} target="_blank" rel="noreferrer" className="text-xs text-[#0aa5b7] flex items-center gap-1 hover:underline"><ExternalLink className="w-3 h-3" />GitHub</a>}
                          {item.liveUrl && <a href={item.liveUrl} target="_blank" rel="noreferrer" className="text-xs text-[#0aa5b7] flex items-center gap-1 hover:underline"><ExternalLink className="w-3 h-3" />Live</a>}
                          {item.offerLetterUrl && <a href={item.offerLetterUrl} target="_blank" rel="noreferrer" className="text-xs text-[#0aa5b7] flex items-center gap-1 hover:underline"><ExternalLink className="w-3 h-3" />Offer Letter</a>}
                          {item.proofUrl && <a href={item.proofUrl} target="_blank" rel="noreferrer" className="text-xs text-[#0aa5b7] flex items-center gap-1 hover:underline"><ExternalLink className="w-3 h-3" />Proof</a>}
                          {item.fileUrl && <a href={item.fileUrl} target="_blank" rel="noreferrer" className="text-xs text-[#0aa5b7] flex items-center gap-1 hover:underline"><ExternalLink className="w-3 h-3" />Certificate</a>}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  {isPending && (
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleVerify(item, "approved")}
                        disabled={!!verifying}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50">
                        {verifying === `${item._id}-approved` ? <Loader className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                        Approve
                      </button>
                      <button
                        onClick={() => handleVerify(item, "rejected")}
                        disabled={!!verifying}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50">
                        {verifying === `${item._id}-rejected` ? <Loader className="w-3 h-3 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                        Reject
                      </button>
                    </div>
                  )}

                  {!isPending && item.verification?.remark && (
                    <div className="text-xs text-gray-400 max-w-[120px] text-right">
                      Remark: {item.verification.remark}
                    </div>
                  )}
                </div>

                {/* Remark input for pending items */}
                {isPending && (
                  <div className="px-4 pb-3">
                    <input
                      placeholder="Add remark (optional) before approving/rejecting"
                      value={remark}
                      onChange={e => setRemark(e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#0aa5b7] bg-gray-50"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}