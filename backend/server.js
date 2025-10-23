// server.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS Configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Connect MongoDB
connectDB();

// Root Route (for sanity check)
app.get("/", (req, res) => {
  res.send("🚀 Server is running and MongoDB is connected!");
});

// ----------------------
// API Routes
// ----------------------
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));  // ✅ admin profile/update
app.use("/api/upload", require("./routes/bulkUploadRoutes"));  // ✅ bulk upload
app.use("/api/academic", require("./routes/academicRoutes"));


// ----------------------
// 404 Handler
// ----------------------
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ----------------------
// Start Server
// ----------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`Frontend: ${process.env.FRONTEND_URL || "http://localhost:5173"}`);
});
