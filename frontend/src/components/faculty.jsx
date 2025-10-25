import React, { useState } from "react";
import {
  User,
  ClipboardCheck,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  Upload,
} from "lucide-react";

const FacultyPage = () => {
  const [activeTab, setActiveTab] = useState("activities");

  // Dummy data for demo
  const activityRequests = [
    {
      id: 1,
      student: "Ananya Sharma",
      title: "Hackathon Participation",
      proof: "hackathon_certificate.pdf",
      status: "Pending",
    },
    {
      id: 2,
      student: "Rohan Mehta",
      title: "Internship - Infosys",
      proof: "internship_letter.pdf",
      status: "Approved",
    },
  ];

  const attendanceRecords = [
    { id: 1, course: "CS101", date: "2025-10-22", uploadedBy: "You" },
    { id: 2, course: "CS102", date: "2025-10-23", uploadedBy: "Dept Admin" },
  ];

  const handleApprove = (id) => {
    alert(`Activity ID ${id} approved ✅`);
  };

  const handleReject = (id) => {
    alert(`Activity ID ${id} rejected ❌`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "activities":
        return (
          <div className="space-y-4 mt-4">
            {activityRequests.map((req) => (
              <div
                key={req.id}
                className="border rounded-2xl p-4 shadow-md bg-white flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {req.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Student: {req.student}
                  </p>
                  <a
                    href="#"
                    className="text-blue-600 text-sm underline hover:text-blue-800"
                  >
                    {req.proof}
                  </a>
                </div>
                <div className="flex gap-3">
                  {req.status === "Pending" ? (
                    <>
                      <button
                        onClick={() => handleApprove(req.id)}
                        className="px-3 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 flex items-center gap-1"
                      >
                        <CheckCircle size={18} /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(req.id)}
                        className="px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 flex items-center gap-1"
                      >
                        <XCircle size={18} /> Reject
                      </button>
                    </>
                  ) : (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg">
                      Approved
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        );

      case "attendance":
        return (
          <div className="space-y-4 mt-4">
            {attendanceRecords.map((rec) => (
              <div
                key={rec.id}
                className="border rounded-2xl p-4 shadow-md bg-white flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {rec.course} – {rec.date}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Uploaded by: {rec.uploadedBy}
                  </p>
                </div>
                <button className="px-3 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 flex items-center gap-2">
                  <Upload size={18} /> Upload CSV
                </button>
              </div>
            ))}
          </div>
        );

      case "profile":
        return (
          <div className="mt-6 bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Faculty Profile
            </h3>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>Name:</strong> Dr. Kavita Deshmukh
              </p>
              <p>
                <strong>Department:</strong> Computer Science
              </p>
              <p>
                <strong>APAR ID:</strong> APAR-09432
              </p>
              <p>
                <strong>Email:</strong> kavita.deshmukh@college.edu
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-b-3xl shadow-md">
        <h1 className="text-3xl font-bold">Faculty Dashboard</h1>
        <p className="text-sm text-gray-200">
          Manage student activity approvals, attendance, and profile
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6">
        <div className="bg-white rounded-2xl p-4 shadow-md flex items-center gap-4">
          <ClipboardCheck className="text-indigo-600" size={32} />
          <div>
            <p className="text-gray-500 text-sm">Pending Approvals</p>
            <h2 className="text-xl font-semibold text-gray-800">12</h2>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-md flex items-center gap-4">
          <FileText className="text-purple-600" size={32} />
          <div>
            <p className="text-gray-500 text-sm">Verified Activities</p>
            <h2 className="text-xl font-semibold text-gray-800">48</h2>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-md flex items-center gap-4">
          <Calendar className="text-green-600" size={32} />
          <div>
            <p className="text-gray-500 text-sm">Attendance Uploaded</p>
            <h2 className="text-xl font-semibold text-gray-800">26</h2>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 mt-4">
        <div className="flex gap-4 border-b pb-2">
          <button
            className={`pb-2 font-medium ${
              activeTab === "activities"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("activities")}
          >
            <ClipboardCheck size={18} className="inline mr-1" />
            Activity Approvals
          </button>
          <button
            className={`pb-2 font-medium ${
              activeTab === "attendance"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("attendance")}
          >
            <Calendar size={18} className="inline mr-1" />
            Attendance
          </button>
          <button
            className={`pb-2 font-medium ${
              activeTab === "profile"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            <User size={18} className="inline mr-1" />
            Profile
          </button>
        </div>

        {/* Tab Content */}
        <div>{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default FacultyPage;
