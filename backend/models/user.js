// models/User.js
const mongoose = require("mongoose");

// ------------------------------------
// 📦 Address Subschema
// ------------------------------------
const addressSchema = new mongoose.Schema(
  {
    street: String,
    city: String,
    state: String,
    country: String,
    pincode: String,
  },
  { _id: false }
);

// ------------------------------------
// 🌐 Social Links Subschema
// ------------------------------------
const socialLinksSchema = new mongoose.Schema(
  {
    linkedin: String,
    github: String,
    portfolio: String,
  },
  { _id: false }
);

// ------------------------------------
// 👤 Profile Subschema
// ------------------------------------
const profileSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    middleName: { type: String },
    profileImage: { type: String }, // URL
    phone: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["male", "female", "other"] },
    designation: { type: String }, // For faculty/admin
    institutionEmail: { type: String }, // Institutional email (optional)
    registrationNo: { type: String }, // For students (unique per institution)
    address: addressSchema,
    socialLinks: socialLinksSchema,
  },
  { _id: false }
);

// ------------------------------------
// 🏫 Institution Info Subschema
// ------------------------------------
const institutionInfoSchema = new mongoose.Schema(
  {
    collegeName: { type: String, required: true },
    collegeType: {
      type: String,
      enum: ["Government", "Private"],
      required: true,
    },
    aisheCode: { type: String, required: true }, // ⚠️ Removed unique constraint to allow many students in one AISHE
    subscription: {
      plan: {
        type: String,
        enum: ["Basic", "Gold", "Premium"],
        default: "Basic",
      },
      startDate: Date,
      endDate: Date,
      amountPaid: Number,
    },
  },
  { _id: false }
);

// ------------------------------------
// 🧠 User Schema
// ------------------------------------
const userSchema = new mongoose.Schema(
  {
    RegistrationNo: {
      type: String,
      unique: true,
      required: true, // Can be Registration No, Employee ID, or generated ID
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "faculty", "admin", "super_admin"],
      required: true,
    },
    profile: profileSchema,
    institutionInfo: institutionInfoSchema,
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

// ------------------------------------
// ⚡ Indexes (optimized for performance)
// ------------------------------------

// General purpose indexes
userSchema.index({ email: 1 });
userSchema.index({ RegistrationNo: 1 });
userSchema.index({ "institutionInfo.aisheCode": 1 });
userSchema.index({ role: 1, isActive: 1 });

// Unique combination for students per institution
userSchema.index(
  { "profile.registrationNo": 1, "institutionInfo.aisheCode": 1 },
  { unique: true, partialFilterExpression: { role: "student" } }
);

module.exports = mongoose.model("User", userSchema);
