// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 4000;

// ── Connect MongoDB ───────────────────────────────────────────
connectDB();

// ── Middleware ────────────────────────────────────────────────
app.use(cookieParser());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(morgan("dev"));

// CORS Configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Serve uploaded assignment files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Root Route ────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("🚀 Server is running and MongoDB is connected!");
});

// ── API Routes ────────────────────────────────────────────────

// Existing routes
app.use("/api/auth",     require("./routes/authRoutes"));
app.use("/api/admin",    require("./routes/adminRoutes"));
app.use("/api/upload",   require("./routes/bulkUploadRoutes"));
app.use("/api/academic", require("./routes/academicRoutes"));
app.use("/api",          require("./routes/userRoutes"));

// New routes (courses, attendance, assignments)
app.use("/api/courses",     require("./routes/courses"));
app.use("/api/attendance",  require("./routes/attendance"));
app.use("/api/assignments", require("./routes/assignments"));

// ── Health Check ──────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server running", timestamp: new Date() });
});

// ── 404 Handler ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// ── Central Error Handler ─────────────────────────────────────
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`Frontend: ${process.env.FRONTEND_URL || "http://localhost:5173"}`);
});