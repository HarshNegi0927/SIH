const mongoose = require("mongoose");

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
// 🎓 Course Schema (per subject)
// ------------------------------------
const courseSchema = new mongoose.Schema(
  {
    subjectCode: String,
    subjectName: String,
    credits: Number,
    grade: String,
    semester: Number,
    academicYear: String,
  },
  { _id: false }
);

// ------------------------------------
// 🧠 Semester Info Schema
// ------------------------------------
const semesterSchema = new mongoose.Schema(
  {
    semesterNumber: Number,
    academicYear: String,
    sgpa: Number,
    totalCredits: Number,
    subjects: [courseSchema],
  },
  { _id: false }
);

// ------------------------------------
// 🏅 Academic Record Schema
// ------------------------------------
const academicInfoSchema = new mongoose.Schema(
  {
    program: { type: String },
    department: { type: String },
    yearOfAdmission: Number,
    currentSemester: Number,
    cgpa: Number,
    totalCreditsEarned: Number,
    pastSemesters: [semesterSchema],
    achievements: [
      {
        title: String,
        type: String,
        year: String,
        description: String,
      },
    ],
  },
  { _id: false }
);

// ------------------------------------
// 👤 Profile Subschema
// ------------------------------------
const profileSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: String,
    middleName: String,
    profileImage: String,
    phone: String,
    dateOfBirth: Date,
    gender: { type: String, enum: ["male", "female", "other"] },
    designation: String,
    department: String,          // for faculty/admin
    institutionEmail: String,
    registrationNo: String,
    address: String,
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
    aisheCode: { type: String, required: true },
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
// 📜 Certification Subschema (students only) — ADDED
// ------------------------------------
const certificationSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  issuedBy:   { type: String, default: "" },
  issuedDate: { type: Date,   default: null },
  fileUrl:    { type: String, default: "" },
  addedAt:    { type: Date,   default: Date.now },
});

// ------------------------------------
// 📅 Event/Workshop Subschema (students only) — ADDED
// ------------------------------------
const eventSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  role:        { type: String, default: "" },
  year:        { type: String, default: "" },
  description: { type: String, default: "" },
  addedAt:     { type: Date,   default: Date.now },
});

// ------------------------------------
// 🏆 Club/Activity Subschema (students only) — ADDED
// ------------------------------------
const clubSchema = new mongoose.Schema({
  club:        { type: String, required: true },
  designation: { type: String, default: "" },
  duration:    { type: String, default: "" },
  description: { type: String, default: "" },
  addedAt:     { type: Date,   default: Date.now },
});

// ------------------------------------
// 🧍‍♂️ User Schema (Main)
// ------------------------------------
const userSchema = new mongoose.Schema(
  {
    RegistrationNo: {
      type: String,
      unique: true,
      required: true,
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

    // 🧑‍🎓 Student / Faculty profile
    profile: profileSchema,

    // 🏫 Institution Info
    institutionInfo: institutionInfoSchema,

    // 🎓 Academic Info (only for students)
    academicInfo: academicInfoSchema,

    // 📜 Student-only extras — ADDED
    certifications: [certificationSchema],
    events:         [eventSchema],
    clubs:          [clubSchema],

    // General metadata
    isActive:   { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    lastLogin:  { type: Date },
  },
  { timestamps: true }
);

// ------------------------------------
// ⚡ Indexes
// ------------------------------------
userSchema.index({ email: 1 });
userSchema.index({ RegistrationNo: 1 });
userSchema.index({ "institutionInfo.aisheCode": 1 });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index(
  { "profile.registrationNo": 1, "institutionInfo.aisheCode": 1 },
  { unique: true, partialFilterExpression: { role: "student" } }
);

module.exports = mongoose.model("User", userSchema);