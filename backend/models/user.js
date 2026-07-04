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
  title:        { type: String, required: true },
  issuedBy:     { type: String, default: "" },
  issuedDate:   { type: Date,   default: null },
  fileUrl:      { type: String, default: "" },
  addedAt:      { type: Date,   default: Date.now },
  verification: { status: { type: String, enum: ["pending","approved","rejected"], default: "pending" },
                  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
                  verifiedAt: { type: Date, default: null },
                  remark:     { type: String, default: "" } },
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


// ── Verification subdoc (reused across projects/internships/awards) ──
const verificationSchema = new mongoose.Schema({
  status:     { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  verifiedAt: { type: Date, default: null },
  remark:     { type: String, default: "" },
});

// ── Project Schema ───────────────────────────────────────────
const projectSchema = new mongoose.Schema({
  title:        { type: String, required: true },
  description:  { type: String, default: "" },
  techStack:    { type: String, default: "" },   // comma separated
  githubUrl:    { type: String, default: "" },
  liveUrl:      { type: String, default: "" },
  year:         { type: String, default: "" },
  addedAt:      { type: Date, default: Date.now },
  verification: { type: verificationSchema, default: () => ({}) },
});

// ── Internship Schema ────────────────────────────────────────
const internshipSchema = new mongoose.Schema({
  company:      { type: String, required: true },
  role:         { type: String, default: "" },
  startDate:    { type: Date,   default: null },
  endDate:      { type: Date,   default: null },
  stipend:      { type: String, default: "" },
  description:  { type: String, default: "" },
  offerLetterUrl: { type: String, default: "" },
  addedAt:      { type: Date, default: Date.now },
  verification: { type: verificationSchema, default: () => ({}) },
});

// ── Award Schema ─────────────────────────────────────────────
const awardSchema = new mongoose.Schema({
  title:        { type: String, required: true },
  issuedBy:     { type: String, default: "" },
  year:         { type: String, default: "" },
  description:  { type: String, default: "" },
  proofUrl:     { type: String, default: "" },
  addedAt:      { type: Date, default: Date.now },
  verification: { type: verificationSchema, default: () => ({}) },
});

// ── Placement Schema ─────────────────────────────────────────
const placementSchema = new mongoose.Schema({
  company:      { type: String, required: true },
  role:         { type: String, default: "" },
  package:      { type: String, default: "" },   // e.g. "12 LPA"
  joiningDate:  { type: Date,   default: null },
  offerLetterUrl: { type: String, default: "" },
  addedAt:      { type: Date, default: Date.now },
  verification: { type: verificationSchema, default: () => ({}) },
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
    projects:       [projectSchema],
    internships:    [internshipSchema],
    awards:         [awardSchema],
    placements:     [placementSchema],

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