const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../middleware/auth");
const { uploadAssignment } = require("../config/cloudinary");
const {
  getAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  toggleAssignmentStatus,
  deleteAssignment,
  submitAssignment,
  getSubmissions,
  gradeSubmission,
  getMySubmission,
} = require("../controllers/assignmentController");

router.use(requireAuth);

// ── List & Create ─────────────────────────────────────────────
// GET  /api/assignments?courseId=&status=    → faculty or student
// POST /api/assignments                      → faculty only
router.get("/", getAssignments);
router.post("/", requireRole("faculty"), createAssignment);

// ── Single Assignment ─────────────────────────────────────────
// GET    /api/assignments/:id                → full detail
// PUT    /api/assignments/:id                → faculty only (update fields)
// PATCH  /api/assignments/:id/toggle-status  → faculty only
// DELETE /api/assignments/:id                → faculty only
router.get("/:id", getAssignmentById);
router.put("/:id", requireRole("faculty"), updateAssignment);
router.patch("/:id/toggle-status", requireRole("faculty"), toggleAssignmentStatus);
router.delete("/:id", requireRole("faculty"), deleteAssignment);

// ── Submissions ───────────────────────────────────────────────
// POST  /api/assignments/:id/submit              → student: upload file
// GET   /api/assignments/:id/submissions         → faculty: all submissions
// GET   /api/assignments/:id/my-submission       → student: own submission + marks
// PATCH /api/assignments/:id/submissions/:subId/grade → faculty: enter marks
router.post(
  "/:id/submit",
  requireRole("student"),
  uploadAssignment.single("file"),
  submitAssignment
);
router.get("/:id/submissions", requireRole("faculty", "admin"), getSubmissions);
router.get("/:id/my-submission", requireRole("student"), getMySubmission);
router.patch(
  "/:id/submissions/:submissionId/grade",
  requireRole("faculty"),
  gradeSubmission
);

module.exports = router;