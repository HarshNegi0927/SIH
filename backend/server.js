// server.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

connectDB();

app.get("/", (req, res) => {
  res.send("Server is running and MongoDB is connected!");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", adminRoutes);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
