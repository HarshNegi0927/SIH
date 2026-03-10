const Course = require("../models/Course");
const User = require("../models/user");

// ─────────────────────────────────────────────────────────────
// GET /api/courses
// Faculty: get their own assigned courses
// Admin: get all courses in their institution
// ─────────────────────────────────────────────────────────────
const getCourses = async (req, res, next) => {
  try {
    const { role, _id, institutionInfo } = req.user;
    const aisheCode = institutionInfo?.aisheCode;
    const { academicYear, semester, department } = req.query;

    const filter = { aisheCode, isActive: true };
    if (academicYear) filter.academicYear = academicYear;
    if (semester) filter.semester = Number(semester);
    if (department) filter.department = department;

    if (role === "faculty") filter.facultyId = _id;

    const courses = await Course.find(filter)
      .populate("facultyId", "profile.firstName profile.lastName profile.designation")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: courses.length, data: courses });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/courses/:id
// ─────────────────────────────────────────────────────────────
const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "facultyId",
      "profile.firstName profile.lastName profile.designation"
    );

    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    res.status(200).json({ success: true, data: course });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/courses  [admin only]
// ─────────────────────────────────────────────────────────────
const createCourse = async (req, res, next) => {
  try {
    const { name, code, department, program, semester, section, academicYear, credits, schedule, type, facultyId, enrolledStudents } = req.body;

    if (!name || !code || !department || !program || !semester || !section || !academicYear || !credits || !facultyId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Verify faculty exists
    const faculty = await User.findOne({ _id: facultyId, role: "faculty" });
    if (!faculty) return res.status(404).json({ success: false, message: "Faculty not found" });

    const course = await Course.create({
      name, code, department, program, semester, section, academicYear,
      credits, schedule, type: type || "core",
      facultyId,
      aisheCode: req.user.institutionInfo.aisheCode,
      enrolledStudents: enrolledStudents || [],
    });

    res.status(201).json({ success: true, data: course });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// PUT /api/courses/:id  [admin only]
// ─────────────────────────────────────────────────────────────
const updateCourse = async (req, res, next) => {
  try {
    const allowed = ["name", "schedule", "credits", "facultyId", "isActive", "enrolledStudents", "section", "academicYear"];
    const updates = {};
    allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const course = await Course.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    res.status(200).json({ success: true, data: course });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/courses/:id/students
// Returns the list of students enrolled in a course
// Core courses: match by dept + semester + section
// Elective courses: use enrolledStudents array
// ─────────────────────────────────────────────────────────────
const getCourseStudents = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    let students;

    if (course.type === "core") {
      // Auto-match students by department, semester, section, institution
      students = await User.find({
        role: "student",
        isActive: true,
        "institutionInfo.aisheCode": course.aisheCode,
        "academicInfo.department": course.department,
        "academicInfo.currentSemester": course.semester,
        "profile.registrationNo": { $exists: true },
      }).select("_id profile.firstName profile.lastName profile.registrationNo academicInfo.cgpa email");
    } else {
      // Elective: only explicitly enrolled students
      students = await User.find({
        _id: { $in: course.enrolledStudents },
        isActive: true,
      }).select("_id profile.firstName profile.lastName profile.registrationNo academicInfo.cgpa email");
    }

    res.status(200).json({ success: true, count: students.length, data: students });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/courses/:id/enroll  [admin — elective courses only]
// Body: { studentIds: [...] }
// ─────────────────────────────────────────────────────────────
const enrollStudents = async (req, res, next) => {
  try {
    const { studentIds } = req.body;
    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ success: false, message: "studentIds array is required" });
    }

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    if (course.type !== "elective") {
      return res.status(400).json({ success: false, message: "Manual enrollment is only for elective courses" });
    }

    // Add without duplicates
    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { enrolledStudents: { $each: studentIds } } },
      { new: true }
    );

    res.status(200).json({ success: true, enrolledCount: updated.enrolledStudents.length, data: updated });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCourses, getCourseById, createCourse, updateCourse, getCourseStudents, enrollStudents };
