// backend/middleware/uploadMiddleware.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Add timestamp for uniqueness
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// File filter to allow only CSV files
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "text/csv",
    "application/vnd.ms-excel",
    "application/csv",
    "text/plain",
  ];

  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimeTypes.includes(file.mimetype) || ext === ".csv") {
    cb(null, true);
  } else {
    cb(new Error("Only CSV files are allowed"), false);
  }
};

// Set limits (2 MB max)
const limits = {
  fileSize: 2 * 1024 * 1024, // 2MB
};

// Create multer upload instance
const upload = multer({
  storage,
  fileFilter,
  limits,
});

// Export for routes
module.exports = upload;
