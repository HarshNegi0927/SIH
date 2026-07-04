// controllers/adminController.js
const User = require("../models/user");
exports.getAdminProfile = async (req, res) => {
  try {
    const RegistrationNo = req.user.id;

    const admin = await User.findById(RegistrationNo).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "User not found" });
    }

    if (admin.role !== "admin" && admin.role !== "super_admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    res.status(200).json({
      message: "Admin profile fetched successfully",
      admin,
    });
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getInstitutionStudents = async (req, res) => {
  try {
    // 1. Get the admin's AISHE code from the token (via req.user)
    const aisheCode = req.user.institutionInfo?.aisheCode;

    if (!aisheCode) {
      return res
        .status(400)
        .json({ message: "Admin is not linked to an institution." });
    }

    // 2. Find all users who are 'students' AND match that AISHE code
    const students = await User.find({
      "institutionInfo.aisheCode": aisheCode,
      role: "student",
    }).select("profile email academicInfo institutionInfo certifications events clubs projects internships awards placements");

    // 3. Send the list of students
    res.status(200).json({
      message: "Students fetched successfully",
      students: students,
    });
  } catch (error) {
    console.error("Error fetching institution students:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateAdminProfile = async (req, res) => {
  try {
    const RegistrationNo = req.user.id; // from auth middleware

    const admin = await User.findById(RegistrationNo);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (admin.role !== "admin" && admin.role !== "super_admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const updates = req.body;

    if (updates.profile) {
      admin.profile = { ...(admin.profile || {}), ...updates.profile };
    }

    if (updates.institutionInfo) {
      admin.institutionInfo = {
        ...(admin.institutionInfo || {}),
        ...updates.institutionInfo,
      };
    }

    await admin.save();

    // Remove password before sending response
    const adminObj = admin.toObject();
    delete adminObj.password;

    res.status(200).json({
      message: "Admin profile updated successfully",
      admin: adminObj,
    });
  } catch (err) {
    console.error("Error updating admin profile:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getInstitutionFaculty = async (req, res) => {
  try {
    const aisheCode = req.user.institutionInfo?.aisheCode;
    if (!aisheCode)
      return res.status(400).json({ message: "Admin not linked to institution." });

    const faculty = await User.find({
      "institutionInfo.aisheCode": aisheCode,
      role: "faculty",
    }).select("profile email");

    res.status(200).json({ message: "Faculty fetched", faculty });
  } catch (err) {
    console.error("Error fetching faculty:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ============================================================
// GET PENDING VERIFICATIONS — all students' pending achievements
// ============================================================
exports.getPendingVerifications = async (req, res) => {
  try {
    const aisheCode = req.user.institutionInfo?.aisheCode;
    const students = await User.find({
      "institutionInfo.aisheCode": aisheCode,
      role: "student",
    }).select("profile email projects internships awards placements certifications");

    const pending = [];
    const types = ["projects", "internships", "awards", "placements", "certifications"];

    students.forEach(s => {
      const name = `${s.profile?.firstName || ""} ${s.profile?.lastName || ""}`.trim() || s.email;
      types.forEach(type => {
        (s[type] || []).forEach(item => {
          if (item.verification?.status === "pending") {
            pending.push({
              studentId:   s._id,
              studentName: name,
              studentEmail: s.email,
              type,
              item,
            });
          }
        });
      });
    });

    res.status(200).json({ success: true, data: pending });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================================
// GET INSTITUTION REPORT — analytics for admin dashboard
// ============================================================
exports.getInstitutionReport = async (req, res) => {
  try {
    const aisheCode = req.user.institutionInfo?.aisheCode;
    const students = await User.find({
      "institutionInfo.aisheCode": aisheCode,
      role: "student",
    }).select("profile email academicInfo projects internships awards placements certifications");

    const report = {
      totalStudents: students.length,
      departments: {},
      totalCertifications: 0,
      totalProjects: 0,
      totalInternships: 0,
      totalAwards: 0,
      totalPlacements: 0,
      avgCgpa: 0,
      topStudents: [],
    };

    let cgpaSum = 0, cgpaCount = 0;

    students.forEach(s => {
      const dept = s.academicInfo?.department || "Unknown";
      if (!report.departments[dept]) report.departments[dept] = { students: 0, placements: 0, internships: 0 };
      report.departments[dept].students++;

      const certs   = (s.certifications || []).filter(i => i.verification?.status === "approved").length;
      const projs   = (s.projects      || []).filter(i => i.verification?.status === "approved").length;
      const interns = (s.internships   || []).filter(i => i.verification?.status === "approved").length;
      const awards  = (s.awards        || []).filter(i => i.verification?.status === "approved").length;
      const placements = (s.placements || []).filter(i => i.verification?.status === "approved").length;

      report.totalCertifications += certs;
      report.totalProjects       += projs;
      report.totalInternships    += interns;
      report.totalAwards         += awards;
      report.totalPlacements     += placements;
      report.departments[dept].placements  += placements;
      report.departments[dept].internships += interns;

      const cgpa = s.academicInfo?.cgpa;
      if (cgpa) { cgpaSum += cgpa; cgpaCount++; }

      const score = certs + projs*2 + interns*2 + awards*3 + placements*4;
      report.topStudents.push({
        name: `${s.profile?.firstName || ""} ${s.profile?.lastName || ""}`.trim() || s.email,
        email: s.email,
        dept,
        cgpa: cgpa || 0,
        score,
        certifications: certs, projects: projs, internships: interns,
        awards, placements,
      });
    });

    report.avgCgpa = cgpaCount ? (cgpaSum / cgpaCount).toFixed(2) : 0;
    report.topStudents = report.topStudents.sort((a, b) => b.score - a.score).slice(0, 10);

    res.status(200).json({ success: true, data: report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};