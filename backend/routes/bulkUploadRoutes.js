// routes/bulkUploadRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { bulkUploadStudents } = require("../controllers/bulkUploadController");

// POST /api/admin/upload-students
router.post("/upload-students", upload.any(), bulkUploadStudents);

module.exports = router;
