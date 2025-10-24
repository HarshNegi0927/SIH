// src/components/admin/BulkUpload.jsx
import React, { useState } from "react";
import { apiUploadFile } from "../../lib/api";

export default function BulkUpload() {
  const [file, setFile] = useState(null); // 2. Store the file, not text
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  function handleFileChange(e) {
    setFile(e.target.files[0]);
    setResponse(null); // Clear old response
  }

  async function handleUpload() {
    if (!file) return alert("Please select a CSV file to upload.");
    setLoading(true);
    setResponse(null);

    // 3. Create FormData
    const formData = new FormData();
    formData.append("file", file); // 'file' must match middleware

    try {
      // 4. Use the new API function
      const res = await apiUploadFile(
        "/upload/students", // Make sure this route is correct!
        formData
      );

      setResponse(res); // Store the success/failure report
      alert(
        `Upload complete: ${res.successCount} succeeded, ${res.failedCount} failed.`
      );
      setFile(null);
      // navigate("/admin/students"); // Optional: navigate on success
    } catch (err) {
      console.error(err);
      alert(`Upload failed: ${err.message}`);
      setResponse({ message: err.message, failed: [] });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 bg-white rounded shadow">
      <h3 className="mb-3 font-semibold">Bulk Student Upload (CSV)</h3>
      <p className="mb-3 text-sm text-gray-500">
        Upload a CSV file. The backend will parse it.
      </p>

      {/* 5. Use a file input, not a textarea */}
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="w-full p-2 mb-3 border rounded"
      />

      <div className="flex gap-2 mb-4">
        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className="px-3 py-2 text-white bg-green-600 rounded disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload File"}
        </button>
      </div>

      {/* 6. Display the response from the server */}
      {response && (
        <div className="mt-4">
          <h4 className="font-semibold">Upload Report</h4>
          <p className="text-sm text-gray-700">{response.message}</p>
          {response.successCount > 0 && (
            <p className="text-sm text-green-600">
              Succeeded: {response.successCount}
            </p>
          )}
          {response.failedCount > 0 && (
            <div className="mt-2">
              <p className="text-sm text-red-600">
                Failed: {response.failedCount}
              </p>
              <ul className="text-xs list-disc list-inside">
                {response.results?.failed.map((f, i) => (
                  <li key={i}>
                    <strong>{f.email || "Unknown"}:</strong> {f.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
