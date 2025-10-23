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
// 🎓 Course Schema (per subject)
// ------------------------------------
const courseSchema = new mongoose.Schema(
  {
    subjectCode: String,
    subjectName: String,
    credits: Number,
    grade: String, // e.g., A+, B, etc.
    semester: Number,
    academicYear: String, // e.g., "2024-2025"
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
    program: { type: String }, // e.g., B.Tech, M.Tech
    department: { type: String }, // e.g., CSE, ECE
    yearOfAdmission: Number,
    currentSemester: Number,
    cgpa: Number,
    totalCreditsEarned: Number,
    pastSemesters: [semesterSchema], // full history
    achievements: [
      {
        title: String,
        type: String, // e.g., "Scholarship", "Research Paper"
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
    firstName: { type: String, required: true },
    lastName: String,
    middleName: String,
    profileImage: String,
    phone: String,
    dateOfBirth: Date,
    gender: { type: String, enum: ["male", "female", "other"] },
    designation: String,
    institutionEmail: String,
    registrationNo: String, // for students (unique per institution)
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

    // General metadata
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    lastLogin: { type: Date },
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
