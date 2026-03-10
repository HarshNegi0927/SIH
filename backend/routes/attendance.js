const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../middleware/auth");
const {
  getAttendanceByDate,
  saveAttendance,
  getAttendanceSummary,
  getAttendanceDates,
  deleteAttendanceByDate,
  getMyAttendance,
} = require("../controllers/attendanceController");

router.use(requireAuth);

// Faculty routes
// GET    /api/attendance?courseId=&date=      → students + status for a date
// POST   /api/attendance/save                 → bulk upsert attendance
// GET    /api/attendance/summary?courseId=    → per-student overall %
// GET    /api/attendance/dates?courseId=      → all dates with records
// DELETE /api/attendance?courseId=&date=      → wipe a date's records

router.get("/", requireRole("faculty", "admin"), getAttendanceByDate);
router.post("/save", requireRole("faculty"), saveAttendance);
router.get("/summary", requireRole("faculty", "admin"), getAttendanceSummary);
router.get("/dates", requireRole("faculty", "admin"), getAttendanceDates);
router.delete("/", requireRole("faculty"), deleteAttendanceByDate);

// Student route
// GET /api/attendance/my?courseId=            → student's own attendance
router.get("/my", requireRole("student"), getMyAttendance);

module.exports = router;
