import React, { useState } from "react";
import { User, Mail, Phone, Github, Linkedin, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "Arjun Sharma",
    roll: "CSE2021045",
    email: "arjun.sharma@iitd.ac.in",
    phone: "+91 98765 43210",
    branch: "Computer Science Engineering",
    year: "Final Year",
    college: "Indian Institute of Technology, Delhi",
    github: "",
    linkedin: "",
    bio: "Passionate about software development and problem solving.",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // 🔗 later: API call here
    console.log("Updated Data:", formData);
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex justify-center py-10">
      <div className="w-full max-w-3xl bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-purple-100 p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
          <button
            onClick={() => navigate("/profile")}
            className="text-sm text-purple-600 hover:underline"
          >
            Cancel
          </button>
        </div>

        {/* Profile Picture */}
        <div className="flex items-center gap-6 mb-8">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <button className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow">
              <Camera className="w-4 h-4 text-purple-600" />
            </button>
          </div>
          <div>
            <p className="font-medium text-gray-900">{formData.name}</p>
            <p className="text-sm text-gray-500">Change profile photo</p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-5">
          {[
            { label: "Full Name", name: "name", icon: User },
            { label: "Roll Number", name: "roll" },
            { label: "Email", name: "email", icon: Mail },
            { label: "Phone", name: "phone", icon: Phone },
            { label: "Branch", name: "branch" },
            { label: "Year", name: "year" },
            { label: "College", name: "college" },
            { label: "GitHub", name: "github", icon: Github },
            { label: "LinkedIn", name: "linkedin", icon: Linkedin },
          ].map(({ label, name, icon: Icon }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {label}
              </label>
              <div className="relative">
                {Icon && (
                  <Icon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                )}
                <input
                  type="text"
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className={`w-full ${
                    Icon ? "pl-10" : "pl-4"
                  } pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none`}
                />
              </div>
            </div>
          ))}

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-500 text-white rounded-lg shadow hover:opacity-90 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
