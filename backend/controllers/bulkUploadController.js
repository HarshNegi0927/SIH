// controllers/bulkUploadController.js
const fs = require("fs");
const csv = require("csv-parser");
const bcrypt = require("bcrypt");
const User = require("../models/user");

exports.bulkUploadStudents = async (req, res) => {
  // 1. GET THE LOGGED-IN ADMIN (from requireAuth middleware)
  const admin = req.user;

  // 2. VALIDATE THE ADMIN AND GET THEIR INSTITUTION INFO
  if (!admin || !admin.institutionInfo) {
    return res.status(401).json({
      message: "Authentication error: Admin or institution info not found.",
    });
  }

  const { collegeName, collegeType, aisheCode } = admin.institutionInfo;

  try {
    // 3. CHECK FOR THE FILE
    if (!req.file) {
      return res.status(400).json({ message: "No CSV file uploaded" });
    }

    const students = [];
    const filePath = req.file.path;

    // 4. PARSE THE CSV FILE
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
          // Normalize all headers to lowercase and trim
          const normalized = {};
          Object.keys(row).forEach((k) => {
            normalized[k.trim().toLowerCase()] = row[k].trim();
          });

          // Check for minimum required fields from CSV
          if (
            normalized.email &&
            normalized.registrationno &&
            normalized.firstname
          ) {
            students.push(normalized);
          }
        })
        .on("end", resolve)
        .on("error", reject);
    });

    // 5. HANDLE EMPTY OR INVALID CSV
    if (students.length === 0) {
      fs.unlinkSync(filePath); // Delete temp file
      return res.status(400).json({
        message:
          "CSV file is empty or headers are incorrect. Required headers: email, registrationno, firstname.",
      });
    }

    const results = { success: [], failed: [] };

    // 6. PROCESS ALL STUDENTS
    // Use Promise.allSettled to try every student, even if some fail
    const settledPromises = await Promise.allSettled(
      students.map(async (s) => {
        // Check for duplicate email OR registration number
        const existing = await User.findOne({
          $or: [
            { email: s.email.toLowerCase() },
            { RegistrationNo: s.registrationno },
          ],
        });

        if (existing) {
          throw new Error(
            `Email or RegistrationNo already exists for ${s.email}`
          );
        }

        // Use registration number as the default password
        const passwordToUse = s.registrationno || "password123";
        const hashedPassword = await bcrypt.hash(passwordToUse, 10);

        // 7. CREATE THE NEW STUDENT DOCUMENT
        const newStudent = await User.create({
          RegistrationNo: s.registrationno,
          email: s.email.toLowerCase(),
          password: hashedPassword,
          role: "student", // Set role automatically
          isVerified: true, // Auto-verify them

          // Populate profile from CSV
          profile: {
            firstName: s.firstname,
            lastName: s.lastname || "",
            phone: s.phone || "",
            registrationNo: s.registrationno, // Store in profile as well
          },

          // 8. *** THIS IS YOUR KEY LOGIC ***
          // Stamp the student with the ADMIN'S institution info
          institutionInfo: {
            collegeName: collegeName,
            collegeType: collegeType,
            aisheCode: aisheCode,
          },

          // Populate "other things" into academicInfo
          academicInfo: {
            department: s.department || "N/A",
            program: s.program || "B.Tech", // Default if not provided
            yearOfAdmission: s.yearofadmission || new Date().getFullYear(),
            currentSemester: s.currentsemester || 1,
          },
        });

        return { email: newStudent.email, status: "fulfilled" };
      })
    );

    // 9. COMPILE THE FINAL REPORT
    settledPromises.forEach((result) => {
      if (result.status === "fulfilled") {
        results.success.push(result.value);
      } else {
        // 'result.reason' is the Error object
        results.failed.push({ reason: result.reason.message });
      }
    });

    // 10. CLEAN UP AND SEND RESPONSE
    fs.unlinkSync(filePath); // Delete the temporary CSV file

    return res.status(200).json({
      message: "Bulk upload process complete.",
      total: students.length,
      successCount: results.success.length,
      failedCount: results.failed.length,
      results,
    });
  } catch (error) {
    // Catch any major errors (e.g., file read error)
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path); // Clean up on error
    }
    console.error("🔥 Bulk upload error:", error);
    return res.status(500).json({
      message: "Server error during bulk upload",
      error: error.message,
    });
  }
};
