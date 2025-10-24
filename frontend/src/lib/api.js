// src/lib/api.js
const API_BASE = import.meta.env.VITE_API_URL || "/api";

/**
 * A helper function to get auth headers.
 * It reads the token from localStorage *every time* a request is made.
 */
function getAuthHeaders() {
  const token = localStorage.getItem("token"); // Read from localStorage
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    // 1. This is the critical line that was missing.
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function handleRes(res) {
  const data = await res.json().catch(() => ({})); // Get JSON even on error
  if (!res.ok) {
    // Use the server's error message if available
    throw new Error(data.message || "API request failed");
  }
  return data;
}

export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    headers: getAuthHeaders(), // 2. Use the auth headers
  });
  return handleRes(res);
}

export async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: getAuthHeaders(), // 3. Use the auth headers
    body: JSON.stringify(body),
  });
  return handleRes(res);
}

export async function apiPut(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers: getAuthHeaders(), // 4. Use the auth headers
    body: JSON.stringify(body),
  });
  return handleRes(res);
}

// You will need this for the bulk upload
export async function apiUploadFile(path, formData) {
  const token = localStorage.getItem("token");
  const headers = {}; // 5. DO NOT set Content-Type for FormData
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: headers, // 6. Send only the Auth header
    body: formData, // 7. Send FormData directly
  });
  return handleRes(res);
}
