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
    }).select("profile email institutionInfo.department"); // .select() just gets the data you need

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