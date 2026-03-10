const User = require("../models/user");

// Get Academic Info for a student
exports.getAcademicInfo = async (req, res) => {
  try {
    const { registrationNo } = req.params;

    const student = await User.findOne({
      RegistrationNo: registrationNo,
      role: "student",
    }).select("profile institutionInfo academicInfo");

    if (!student)
      return res.status(404).json({ message: "Student not found" });

    res.status(200).json({
      message: "Academic info fetched successfully",
      data: student,
    });
  } catch (error) {
    console.error("Error fetching academic info:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
