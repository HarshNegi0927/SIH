const mongoose = require("mongoose");

// One record per student per course per date
const attendanceSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    aisheCode: { type: String, required: true },
    date: { type: String, required: true }, // "YYYY-MM-DD"
    status: {
      type: String,
      enum: ["present", "absent"],
      required: true,
    },
  },
  { timestamps: true }
);

// Ensure one record per student per course per date
attendanceSchema.index(
  { studentId: 1, courseId: 1, date: 1 },
  { unique: true }
);
attendanceSchema.index({ courseId: 1, date: 1 });
attendanceSchema.index({ studentId: 1, courseId: 1 });

module.exports = mongoose.model("Attendance", attendanceSchema);
