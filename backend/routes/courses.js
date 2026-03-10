const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../middleware/auth");
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  getCourseStudents,
  enrollStudents,
} = require("../controllers/courseController");

// All routes require login
router.use(requireAuth);

// GET  /api/courses                    → faculty: own courses | admin: all
// POST /api/courses                    → admin only
router.get("/", getCourses);
router.post("/", requireRole("admin", "super_admin"), createCourse);

// GET  /api/courses/:id                → course details
// PUT  /api/courses/:id                → admin only
router.get("/:id", getCourseById);
router.put("/:id", requireRole("admin", "super_admin"), updateCourse);

// GET  /api/courses/:id/students       → students enrolled/matched for course
router.get("/:id/students", getCourseStudents);

// POST /api/courses/:id/enroll         → admin: enroll students in elective
router.post("/:id/enroll", requireRole("admin", "super_admin"), enrollStudents);

module.exports = router;
