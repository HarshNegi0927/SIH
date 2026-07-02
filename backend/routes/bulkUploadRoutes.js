const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { bulkUploadStudents } = require("../controllers/bulkUploadController");
const { requireAuth, requireRole } = require("../middleware/auth");

// POST /api/admin/bulk-upload
router.post(
  "/bulk-upload",
  requireAuth,
  requireRole("admin", "super_admin"),
  upload.single("file"),
  bulkUploadStudents
);

module.exports = router;
