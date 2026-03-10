const Attendance = require("../models/Attendance");
const Course = require("../models/Course");
const User = require("../models/user");

// ─────────────────────────────────────────────────────────────
// Helper: verify the logged-in faculty owns the course
// ─────────────────────────────────────────────────────────────
const verifyFacultyCourse = async (courseId, facultyId) => {
  const course = await Course.findById(courseId);
  if (!course) throw { statusCode: 404, message: "Course not found" };
  if (course.facultyId.toString() !== facultyId.toString()) {
    throw { statusCode: 403, message: "You are not assigned to this course" };
  }
  return course;
};

// Helper: get students for a course (core vs elective logic)
const getCourseStudents = async (course) => {
  if (course.type === "core") {
    return User.find({
      role: "student",
      isActive: true,
      "institutionInfo.aisheCode": course.aisheCode,
      "academicInfo.department": course.department,
      "academicInfo.currentSemester": course.semester,
    })
      .select("_id profile.firstName profile.lastName profile.registrationNo email")
      .lean();
  } else {
    return User.find({
      _id: { $in: course.enrolledStudents },
      isActive: true,
    })
      .select("_id profile.firstName profile.lastName profile.registrationNo email")
      .lean();
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/attendance?courseId=&date=
// Faculty fetches all students + their status for a date
// ─────────────────────────────────────────────────────────────
const getAttendanceByDate = async (req, res, next) => {
  try {
    const { courseId, date } = req.query;
    if (!courseId || !date)
      return res.status(400).json({ success: false, message: "courseId and date are required" });

    const course = await verifyFacultyCourse(courseId, req.user._id);
    const students = await getCourseStudents(course);

    const records = await Attendance.find({ courseId, date }).lean();
    const statusMap = {};
    records.forEach((r) => { statusMap[r.studentId.toString()] = r.status; });

    const result = students.map((s) => ({
      ...s,
      attendanceStatus: statusMap[s._id.toString()] || null,
    }));

    res.status(200).json({ success: true, date, course: course.name, data: result });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/attendance/save  [faculty only]
// Body: { courseId, date, attendance: [{ studentId, status }] }
// Safe to call multiple times — upserts each record
// ─────────────────────────────────────────────────────────────
const saveAttendance = async (req, res, next) => {
  try {
    const { courseId, date, attendance } = req.body;

    if (!courseId || !date || !Array.isArray(attendance) || attendance.length === 0)
      return res.status(400).json({ success: false, message: "courseId, date, and attendance[] are required" });

    const course = await verifyFacultyCourse(courseId, req.user._id);

    const validStatuses = ["present", "absent"];
    for (const entry of attendance) {
      if (!entry.studentId || !validStatuses.includes(entry.status)) {
        return res.status(400).json({
          success: false,
          message: "Each entry needs studentId and status ('present'|'absent')",
        });
      }
    }

    const bulkOps = attendance.map(({ studentId, status }) => ({
      updateOne: {
        filter: { studentId, courseId, date },
        update: {
          $set: { status, facultyId: req.user._id, aisheCode: course.aisheCode },
        },
        upsert: true,
      },
    }));

    const result = await Attendance.bulkWrite(bulkOps);

    res.status(200).json({
      success: true,
      message: "Attendance saved successfully",
      upserted: result.upsertedCount,
      modified: result.modifiedCount,
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/attendance/summary?courseId=
// Per-student overall attendance % across all dates
// ─────────────────────────────────────────────────────────────
const getAttendanceSummary = async (req, res, next) => {
  try {
    const { courseId } = req.query;
    if (!courseId) return res.status(400).json({ success: false, message: "courseId is required" });

    const course = await verifyFacultyCourse(courseId, req.user._id);
    const students = await getCourseStudents(course);

    const agg = await Attendance.aggregate([
      { $match: { courseId: course._id } },
      {
        $group: {
          _id: "$studentId",
          total: { $sum: 1 },
          present: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } },
        },
      },
    ]);

    const aggMap = {};
    agg.forEach((a) => { aggMap[a._id.toString()] = a; });

    const summary = students.map((s) => {
      const data = aggMap[s._id.toString()] || { total: 0, present: 0 };
      const percentage = data.total > 0 ? +((data.present / data.total) * 100).toFixed(1) : 0;
      return {
        studentId: s._id,
        name: `${s.profile?.firstName || ""} ${s.profile?.lastName || ""}`.trim(),
        registrationNo: s.profile?.registrationNo,
        email: s.email,
        totalClasses: data.total,
        present: data.present,
        absent: data.total - data.present,
        percentage,
        status: percentage >= 75 ? "safe" : percentage >= 60 ? "warning" : "critical",
      };
    });

    res.status(200).json({ success: true, course: course.name, data: summary });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/attendance/dates?courseId=
// All distinct dates with attendance records
// ─────────────────────────────────────────────────────────────
const getAttendanceDates = async (req, res, next) => {
  try {
    const { courseId } = req.query;
    if (!courseId) return res.status(400).json({ success: false, message: "courseId is required" });

    await verifyFacultyCourse(courseId, req.user._id);

    const dates = await Attendance.distinct("date", { courseId });
    dates.sort();

    res.status(200).json({ success: true, count: dates.length, data: dates });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// DELETE /api/attendance?courseId=&date=  [faculty only]
// Wipe all attendance records for a specific date
// ─────────────────────────────────────────────────────────────
const deleteAttendanceByDate = async (req, res, next) => {
  try {
    const { courseId, date } = req.query;
    if (!courseId || !date)
      return res.status(400).json({ success: false, message: "courseId and date are required" });

    await verifyFacultyCourse(courseId, req.user._id);

    const result = await Attendance.deleteMany({ courseId, date });

    res.status(200).json({
      success: true,
      message: `Deleted attendance for ${date}`,
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/attendance/my?courseId=  [student only]
// Student views their own attendance record
// ─────────────────────────────────────────────────────────────
const getMyAttendance = async (req, res, next) => {
  try {
    const { courseId } = req.query;
    if (!courseId) return res.status(400).json({ success: false, message: "courseId is required" });

    const records = await Attendance.find({
      courseId,
      studentId: req.user._id,
    }).sort({ date: 1 });

    const total = records.length;
    const present = records.filter((r) => r.status === "present").length;
    const percentage = total > 0 ? +((present / total) * 100).toFixed(1) : 0;

    res.status(200).json({
      success: true,
      data: {
        records,
        summary: {
          total,
          present,
          absent: total - present,
          percentage,
          status: percentage >= 75 ? "safe" : percentage >= 60 ? "warning" : "critical",
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAttendanceByDate,
  saveAttendance,
  getAttendanceSummary,
  getAttendanceDates,
  deleteAttendanceByDate,
  getMyAttendance,
};
