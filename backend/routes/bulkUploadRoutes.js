// routes/bulkUploadRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { bulkUploadStudents } = require("../controllers/bulkUploadController");
const { requireAuth } = require("../middleware/auth");

// POST /api/admin/upload-students
router.post(
  "/students",
  requireAuth,
  upload.single("file"),
  bulkUploadStudents
);

module.exports = router;
