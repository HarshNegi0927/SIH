const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// -------------------------------------------------------------
// 🔑 Helper: Create JWT
// -------------------------------------------------------------
const createToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// =================================================================
// ✅ REGISTER USER (Student / Faculty / Admin)
// =================================================================
exports.registerUser = async (req, res) => {
  try {
    const {
      email,
      password,
      role,
      firstName,
      lastName,
      gender,
      phone,
      registrationNo,
      collegeName,
      collegeType,
      aisheCode,
      program,
      department,
      yearOfAdmission,
      currentSemester,
      cgpa,
    } = req.body;

    const userRole = role;

    // 🔍 1. Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 🔍 2. Check AISHE duplication only for admin role
    if (userRole === "admin" && aisheCode) {
      const existingAishe = await User.findOne({
        "institutionInfo.aisheCode": aisheCode,
        role: "admin",
      });
      if (existingAishe) {
        return res
          .status(400)
          .json({
            message: "This AISHE code is already registered by another admin",
          });
      }
    }

    // 🔐 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🆔 4. Generate default Registration No.
    const generatedRegNo =
      registrationNo || `${userRole.toUpperCase()}-${Date.now()}`;

    // 🧱 5. Build user object
    const newUserData = {
      RegistrationNo: generatedRegNo,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: userRole,
      isVerified: true,
      profile: {
        firstName: firstName || "",
        lastName: lastName || "",
        gender: gender || "other",
        phone: phone || "",
        registrationNo: generatedRegNo,
        institutionEmail: email,
        department: department || "",   // saved for all roles
      },
      institutionInfo: {
        collegeName: collegeName || "Unknown College",
        collegeType: collegeType || "Government",
        aisheCode: aisheCode || `AISHE-${Math.floor(Math.random() * 10000)}`,
        subscription:
          userRole === "admin"
            ? { plan: "Basic", startDate: new Date() }
            : undefined,
      },
    };

    // 🎓 6. Academic data (only for students)
    if (userRole === "student") {
      newUserData.academicInfo = {
        program: program || "",
        department: department || "",
        yearOfAdmission: yearOfAdmission || null,
        currentSemester: currentSemester || 1,
        cgpa: cgpa || 0,
        totalCreditsEarned: 0,
        pastSemesters: [],
        achievements: [],
      };
    }

    // 💾 7. Create user
    const newUser = await User.create(newUserData);

    // 🎟️ 8. Generate JWT token
    const token = createToken(newUser);

    // 🍪 9. Send cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // ✅ 10. Respond
    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        RegistrationNo: newUser.RegistrationNo,
        profile: newUser.profile,
        institutionInfo: newUser.institutionInfo,
        academicInfo: newUser.academicInfo,
      },
    });
  } catch (error) {
    console.error("🔥 Registration Error:", error);

    if (error.code === 11000) {
      const key = Object.keys(error.keyPattern || {})[0];
      return res.status(400).json({
        message: `Duplicate entry for ${key}. Please use unique values.`,
      });
    }

    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};

// =================================================================
// ✅ LOGIN USER
// =================================================================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Find user
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(401)
        .json({ message: "No account found with that email" });

    // 2️⃣ Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    // 3️⃣ Create token
    const token = createToken(user);

    // 5️⃣ Response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        RegistrationNo: user.RegistrationNo,
        profile: user.profile,
        institutionInfo: user.institutionInfo,
        academicInfo: user.academicInfo,
      },
    });
  } catch (error) {
    console.error("🔥 Login Error:", error);
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};