// src/components/admin/BulkUpload.jsx
import React, { useState } from "react";
import { apiUploadFile } from "../../lib/api";
import { Upload, FileText, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function BulkUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  function handleFileChange(e) {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setResponse(null);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && (dropped.name.endsWith(".csv") || dropped.type === "text/csv")) {
      setFile(dropped);
      setResponse(null);
    }
  }

  async function handleUpload() {
    if (!file) return alert("Please select a CSV file to upload.");
    setLoading(true);
    setResponse(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Fixed: was "/upload/students", correct route is "/admin/bulk-upload"
      const res = await apiUploadFile("/admin/bulk-upload", formData);
      setResponse(res);
      setFile(null);
    } catch (err) {
      console.error(err);
      setResponse({ message: err.message, successCount: 0, failedCount: 0, results: { failed: [{ reason: err.message }] } });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl p-6 bg-white rounded-lg shadow">
      <h3 className="mb-1 text-lg font-semibold text-gray-800">Bulk Student Upload</h3>
      <p className="mb-4 text-sm text-gray-500">
        Upload a CSV with headers: <code className="bg-gray-100 px-1 rounded text-xs">email, registrationno, firstname, lastname, phone, department, program, yearofadmission, currentsemester</code>
      </p>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
        }`}
      >
        {file ? (
          <div className="flex items-center justify-center gap-3">
            <FileText className="w-6 h-6 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">{file.name}</span>
            <button onClick={() => setFile(null)} className="text-gray-400 hover:text-red-500">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div>
            <Upload className="w-10 h-10 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-500">Drag & drop CSV here, or</p>
            <label className="mt-2 inline-block cursor-pointer px-4 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50">
              Browse File
              <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
            </label>
          </div>
        )}
      </div>

      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className="mt-4 w-full py-2.5 px-4 text-white font-medium bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Uploading..." : "Upload Students"}
      </button>

      {/* Result */}
      {response && (
        <div className="mt-4 p-4 rounded-lg border bg-gray-50">
          <div className="flex items-center gap-2 mb-3">
            {response.successCount > 0 ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-500" />
            )}
            <span className="font-medium text-gray-800">{response.message}</span>
          </div>
          {response.total !== undefined && (
            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              <div className="p-2 bg-white rounded border">
                <div className="text-xl font-bold text-gray-800">{response.total}</div>
                <div className="text-gray-500">Total</div>
              </div>
              <div className="p-2 bg-green-50 rounded border border-green-200">
                <div className="text-xl font-bold text-green-600">{response.successCount}</div>
                <div className="text-gray-500">Success</div>
              </div>
              <div className="p-2 bg-red-50 rounded border border-red-200">
                <div className="text-xl font-bold text-red-600">{response.failedCount}</div>
                <div className="text-gray-500">Failed</div>
              </div>
            </div>
          )}
          {response.results?.failed?.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium text-gray-600 mb-1">Failed rows:</p>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {response.results.failed.map((f, i) => (
                  <div key={i} className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                    {f.reason}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
