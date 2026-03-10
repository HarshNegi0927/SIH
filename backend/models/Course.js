const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    // Basic Info
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, uppercase: true, trim: true },

    // Department & Program
    department: { type: String, required: true }, // e.g. "CSE", "ECE"
    program: { type: String, required: true },    // e.g. "B.Tech", "M.Tech"
    semester: { type: Number, required: true },
    section: { type: String, required: true },    // e.g. "A", "B"
    academicYear: { type: String, required: true }, // e.g. "2024-2025"
    credits: { type: Number, required: true },
    schedule: { type: String },                   // e.g. "Mon, Wed, Fri - 10:00 AM"

    // Course type
    type: {
      type: String,
      enum: ["core", "elective"],
      default: "core",
    },

    // Faculty assigned to this course (must be a User with role: "faculty")
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Institution (multi-tenant via aisheCode)
    aisheCode: { type: String, required: true },

    // For electives: manually enrolled students
    // For core: students are matched by department + semester + section at query time
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

courseSchema.index(
  { code: 1, section: 1, academicYear: 1, aisheCode: 1 },
  { unique: true }
);
courseSchema.index({ facultyId: 1 });
courseSchema.index({ department: 1, semester: 1, aisheCode: 1 });

module.exports = mongoose.model("Course", courseSchema);
