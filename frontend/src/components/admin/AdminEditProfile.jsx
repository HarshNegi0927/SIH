import React, { useState, useEffect } from "react";
import { Camera, Save, XCircle } from "lucide-react";
import { useAuth } from "../../context/authContext";
import { apiGet, apiPut } from "../../lib/api";
import { useNavigate } from "react-router-dom";

const AdminEditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({
    profileUrl: "",
    name: "Loading...",
    designation: "Platform Admin",
    email: "Loading...",
    phone: "",
    gender: "other",
    dob: "",
    address: "",
    institution: "Loading...",
    aishe: "Loading...",
    department: "Administration",
    role: "Platform Admin",
    joiningDate: "",
    empId: "",
    apar: "",
    aadhaar: "",
    consent: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Define an async function inside useEffect to call
    const fetchProfile = async () => {
      try {
        // Your api.js prepends "/api", so we just need "/admin/profile"
        const data = await apiGet("/admin/profile");

        console.log(data);
        const adminData = data.admin; // Response is { message: "...", admin: {...} }
        const profile = adminData.profile || {};
        const inst = adminData.institutionInfo || {};

        setAdmin({
          name: `${profile.firstName || ""} ${profile.lastName || ""}`.trim(),
          email: adminData.email || "",
          phone: profile.phone || "",
          gender: profile.gender || "other",
          dob: profile.dob
            ? new Date(profile.dob).toISOString().split("T")[0]
            : "",
          address: profile.address || "",
          institution: inst.collegeName || "",
          aishe: inst.aisheCode || "",
          department: profile.department || "Administration",
          role: adminData.role || "Platform Admin",
          joiningDate: profile.joiningDate
            ? new Date(profile.joiningDate).toISOString().split("T")[0]
            : "",
          empId: profile.empId || "",
          apar: profile.apar || "",
          aadhaar: profile.aadhaar || "",
          profileUrl: profile.profilePictureUrl || "",
          designation: profile.designation || "Platform Admin",
          consent: true,
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        alert(`Error: ${err.message}`); // Show the error from the API
        // Fallback to context user for key data if API fails
        if (user) {
          // Fallback to context user for key data
          setAdmin((prev) => ({
            ...prev,
            name: `${user.profile?.firstName || ""} ${
              user.profile?.lastName || ""
            }`.trim(),
            email: user.email || "N/A",
            institution: user.institutionInfo?.collegeName || "N/A",
          }));
        } else {
          // If user is null, just show an error string to prevent crashing
          setAdmin((prev) => ({
            ...prev,
            name: "Error loading profile",
            email: "N/A",
            institution: "N/A",
          }));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile(); // Call the async function
  }, [user]); // Depend on 'user' so we have it for the fallback

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAdmin((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () =>
        setAdmin((prev) => ({ ...prev, profileUrl: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    const [firstName, ...lastName] = admin.name.split(" ");

    const payload = {
      profile: {
        firstName: firstName || "",
        lastName: lastName.join(" ") || "",
        phone: admin.phone,
        gender: admin.gender,
        dob: admin.dob,
        address: admin.address,
        department: admin.department,
        joiningDate: admin.joiningDate,
        empId: admin.empId,
        apar: admin.apar,
        aadhaar: admin.aadhaar,
        designation: admin.designation,
      },
      institutionInfo: {
        collegeName: admin.institution,
        aisheCode: admin.aishe,
      },
    };

    if (admin.profileUrl && admin.profileUrl.startsWith("data:")) {
      payload.profile.profilePictureDataUrl = admin.profileUrl;
    }

    try {
      // Use the new apiPut function
      const response = await apiPut("/admin/profile", payload);
      alert(response.message || "Profile updated successfully!");
    } catch (err) {
      console.error("Failed to save profile:", err);
      alert(`Error: ${err.message}`); // Show the specific error
    } finally {
      setIsSaving(false);
    }
  };
  const handleCancel = () => {
    navigate(-1); // Go back to the previous page
  };
  if (isLoading) {
    return (
      <div className="min-h-screen p-8 text-center bg-gray-50">
        Loading profile data...
      </div>
    );
  }
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl p-8 mx-auto bg-white shadow rounded-xl">
        <h2 className="mb-6 text-2xl font-bold text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text">
          Edit Admin Profile
        </h2>

        {/* Profile photo + Basic Info */}
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <img
                  src={
                    admin.profileUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      admin.name
                    )}&background=6366f1&color=fff&size=128`
                  }
                  alt="Profile"
                  className="object-cover rounded-full shadow w-28 h-28"
                />
                <label className="absolute bottom-0 right-0 p-2 text-white bg-indigo-600 rounded-full shadow cursor-pointer">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              <p className="mt-3 text-lg font-semibold">{admin.name}</p>
              <p className="text-sm text-gray-500">{admin.designation}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm text-gray-600">Full Name</label>
                <input
                  name="name"
                  value={admin.name}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 border rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Designation</label>
                <input
                  name="designation"
                  value={admin.designation}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 border rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">
                  Email (read-only)
                </label>
                <input
                  value={admin.email}
                  disabled
                  className="w-full p-2 mt-1 text-gray-500 bg-gray-100 border rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Phone</label>
                <input
                  name="phone"
                  value={admin.phone}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 border rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Gender</label>
                <select
                  name="gender"
                  value={admin.gender}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 border rounded-lg"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={admin.dob}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 border rounded-lg"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm text-gray-600">Address</label>
              <textarea
                name="address"
                value={admin.address}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded-lg"
                rows={2}
              />
            </div>
          </div>
          {/* Right Column - Institution Info */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm text-gray-600">Institution Name</label>
              <input
                name="institution"
                value={admin.institution}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">AISHE Code</label>
              <input
                name="aishe"
                value={admin.aishe}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Department</label>
              <input
                name="department"
                value={admin.department}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Role</label>
              <input
                name="role"
                value={admin.role}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Joining Date</label>
              <input
                type="date"
                name="joiningDate"
                value={admin.joiningDate}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Employee ID</label>
              <input
                name="empId"
                value={admin.empId}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">APAR ID</label>
              <input
                name="apar"
                value={admin.apar}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Aadhaar (masked)</label>
              <input
                name="aadhaar"
                value={admin.aadhaar}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded-lg"
              />
            </div>
            <div className="flex items-center col-span-2 gap-2 mt-2">
              <input
                type="checkbox"
                name="consent"
                checked={admin.consent}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <label className="text-sm text-gray-600">
                I consent to store masked Aadhaar as per institutional policy.
              </label>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button className="flex items-center gap-2 px-5 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">
            <XCircle className="w-4 h-4" /> Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 text-white rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminEditProfile;
