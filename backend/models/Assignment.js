const mongoose = require("mongoose");

// ── Submission sub-document ──────────────────────────────────
const submissionSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileUrl: { type: String, required: true },   // uploaded file path/URL
    fileName: { type: String },                   // original file name
    submittedAt: { type: Date, default: Date.now },
    isLate: { type: Boolean, default: false },

    // Faculty enters marks manually
    marks: { type: Number, default: null },       // null = not graded yet
    grade: { type: String, default: null },       // e.g. "A+", "B"
    feedback: { type: String, default: null },
    gradedAt: { type: Date, default: null },
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { _id: true, timestamps: false }
);

// ── Assignment main schema ───────────────────────────────────
const assignmentSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    aisheCode: { type: String, required: true },

    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    assignedDate: { type: String, required: true }, // "YYYY-MM-DD"
    dueDate: { type: String, required: true },       // "YYYY-MM-DD"
    totalMarks: { type: Number, required: true, default: 100 },

    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },

    // All submissions embedded in the assignment document
    submissions: [submissionSchema],
  },
  { timestamps: true }
);

assignmentSchema.index({ courseId: 1 });
assignmentSchema.index({ facultyId: 1 });

module.exports = mongoose.model("Assignment", assignmentSchema);
