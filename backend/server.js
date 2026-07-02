require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const authRoutes        = require("./routes/authRoutes");
const userRoutes        = require("./routes/userRoutes");
const adminRoutes       = require("./routes/adminRoutes");
const bulkUploadRoutes  = require("./routes/bulkUploadRoutes");
const courseRoutes      = require("./routes/courses");
const attendanceRoutes  = require("./routes/attendance");
const assignmentRoutes  = require("./routes/assignments");

connectDB();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth",               authRoutes);
app.use("/api/users",              userRoutes);
app.use("/api/admin",              adminRoutes);
app.use("/api/admin",       bulkUploadRoutes);   // POST /api/admin/upload/students
app.use("/api/courses",            courseRoutes);
app.use("/api/attendance",         attendanceRoutes);
app.use("/api/assignments",        assignmentRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server running", timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;
