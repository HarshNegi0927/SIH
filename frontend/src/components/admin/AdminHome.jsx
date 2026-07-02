// src/components/admin/AdminHome.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../../lib/api";
import { useAuth } from "../../context/authContext";
import { Users, Upload, ClipboardCheck, Loader, Building } from "lucide-react";

export default function AdminHome() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet("/admin/students")
      .then(d => setStudents(d.students || []))
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  }, []);

  const institution = user?.institutionInfo;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Dashboard Overview</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Institution Card */}
        <div className="p-6 bg-white rounded-lg shadow border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <Building className="w-5 h-5 text-cyan-600" />
            <h3 className="font-semibold text-gray-700">Institution</h3>
          </div>
          <div className="text-base font-bold text-gray-900">
            {institution?.collegeName || "—"}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {institution?.aisheCode || "—"} · {institution?.collegeType || "—"}
          </div>
          <div className="text-xs text-gray-400 mt-1">{user?.email}</div>
        </div>

        {/* Student Count Card */}
        <div className="p-6 bg-white rounded-lg shadow border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-5 h-5 text-cyan-600" />
            <h3 className="font-semibold text-gray-700">Students</h3>
          </div>
          {loading ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Loader className="w-4 h-4 animate-spin" /> Loading...
            </div>
          ) : (
            <>
              <div className="text-3xl font-bold text-gray-900">{students.length}</div>
              <div className="text-xs text-gray-500 mt-1">Enrolled students</div>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="p-6 bg-white rounded-lg shadow border border-gray-100">
          <h3 className="font-semibold text-gray-700 mb-4">Quick Actions</h3>
          <div className="flex flex-col gap-2">
            <Link to="/admin/bulk-upload"
              className="flex items-center gap-2 px-3 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              <Upload className="w-4 h-4" /> Bulk Upload Students
            </Link>
            <Link to="/admin/students"
              className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <ClipboardCheck className="w-4 h-4" /> View Student List
            </Link>
            <Link to="/admin/edit"
              className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
