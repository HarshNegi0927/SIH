// src/components/admin/StudentList.jsx
import React, { useEffect, useState } from "react";
import { apiGet } from "../../lib/api";

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet("/admin/students")
      .then((d) => setStudents(d.students || []))
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 bg-white rounded shadow">
      <h3 className="mb-3 font-semibold">Students</h3>

      {loading ? (
        <div className="text-sm text-gray-500">Loading…</div>
      ) : students.length === 0 ? (
        <div className="text-sm text-gray-500">No students yet.</div>
      ) : (
        <div className="space-y-2">
          {students.map((s) => (
            <div
              key={s._id}
              className="flex items-center justify-between p-3 border rounded"
            >
              <div>
                <div className="font-medium">
                  {s.profile?.firstName} {s.profile?.lastName}
                </div>
                <div className="text-sm text-gray-500">
                  {s.email} • {s.institution?.department || "—"}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm border rounded">
                  View
                </button>
                <button className="px-3 py-1 text-sm border rounded">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
