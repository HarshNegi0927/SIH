// controllers/bulkUploadController.js
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const bcrypt = require("bcrypt");
const User = require("../models/user");

// -------------------------------
// BULK UPLOAD STUDENTS (FIXED)
// -------------------------------
exports.bulkUploadStudents = async (req, res) => {
  console.log("REQ FILES:", req.files);
  console.log("REQ BODY:", req.body);

  try {
    const uploadedFile = req.file || (req.files && req.files[0]);
    if (!uploadedFile) {
      return res.status(400).json({ message: "No CSV file uploaded" });
    }

    const filePath = uploadedFile.path
      ? uploadedFile.path
      : path.join(__dirname, "..", "uploads", uploadedFile.filename);

    const students = [];

    // ✅ Wrap parsing in a Promise to await completion
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
          // Normalize headers (case-insensitive)
          const normalized = Object.fromEntries(
            Object.entries(row).map(([k, v]) => [k.trim().toLowerCase(), v.trim()])
          );

          if (
            normalized.email &&
            normalized.firstname &&
            normalized.registrationno &&
            normalized.collegename
          ) {
            students.push(normalized);
          }
        })
        .on("end", resolve)
        .on("error", reject);
    });

    if (students.length === 0) {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res.status(400).json({
        message: "No valid student data found in CSV",
      });
    }

    const results = { success: [], failed: [] };

    // ✅ Use Promise.all to ensure all inserts complete
    await Promise.all(
      students.map(async (s) => {
        try {
          const existing = await User.findOne({ email: s.email.toLowerCase() });
          if (existing) {
            results.failed.push({
              email: s.email,
              reason: "Email already exists",
            });
            return;
          }

          const passwordToUse = s.registrationno;
          const hashedPassword = await bcrypt.hash(passwordToUse, 10);

          const newStudent = await User.create({
            RegistrationNo: s.registrationno,
            email: s.email.toLowerCase(),
            password: hashedPassword,
            role: "student",
            profile: {
              firstName: s.firstname,
              lastName: s.lastname || "",
            },
            institutionInfo: {
              collegeName: s.collegename,
              collegeType: s.collegetype || "Government",
              aisheCode: s.aishecode || req.body.aisheCode || "N/A",
            },
            isVerified: true,
          });

          results.success.push({
            email: newStudent.email,
            password: passwordToUse, // for admin confirmation
          });
        } catch (err) {
          console.error("Error adding student:", err.message);
          results.failed.push({ email: s.email, reason: err.message });
        }
      })
    );

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    return res.status(200).json({
      message: "Bulk upload complete",
      total: students.length,
      successCount: results.success.length,
      failedCount: results.failed.length,
      results,
    });
  } catch (error) {
    console.error("🔥 Bulk upload error:", error);
    return res.status(500).json({
      message: "Bulk upload failed",
      error: error.message,
    });
  }
};
