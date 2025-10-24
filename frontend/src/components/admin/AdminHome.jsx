// src/components/admin/AdminHome.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../../lib/api";
import { useAuth } from "../../context/authContext";

export default function AdminHome() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    apiGet("/institutions/me/summary")
      .then(setSummary)
      .catch(() => setSummary(null));
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="p-6 bg-white rounded shadow">
        <h3 className="font-semibold">Institution</h3>
        <div className="mt-3 text-xs text-gray-500">
          {summary?.contactEmail || user?.email || "Loading..."}
        </div>
        <div className="mt-2 text-sm text-gray-600">
          {summary?.name || user?.institutionInfo?.collegeName || "Loading..."}
        </div>
      </div>

      <div className="p-6 bg-white rounded shadow">
        <h3 className="font-semibold">Quick stats</h3>
        <div className="mt-3">
          <div className="text-xs text-gray-500">Students</div>
          <div className="text-2xl font-bold">
            {summary?.studentsCount ?? "—"}
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xs text-gray-500">Pending proofs</div>
          <div className="text-2xl font-bold">
            {summary?.pendingProofs ?? 0}
          </div>
        </div>
      </div>

      <div className="p-6 bg-white rounded shadow">
        <h3 className="font-semibold">Actions</h3>
        <div className="flex flex-col gap-2 mt-4">
          <Link
            to="/admin/bulk-upload"
            className="px-3 py-2 text-white bg-blue-600 rounded"
          >
            Bulk Upload Students
          </Link>
          <Link to="/admin/invite-admins" className="px-3 py-2 border rounded">
            Invite Admin / Faculty
          </Link>
          <Link
            to="/admin/activity-requests"
            className="px-3 py-2 border rounded"
          >
            Review Proofs
          </Link>
        </div>
      </div>
    </div>
  );
}
