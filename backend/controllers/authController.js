// controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/user"); // ✅ Corrected path & capitalization

// Helper to create JWT
const createToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// ==========================================================
// ✅ Register (Institution Admin or General User)
// ==========================================================
exports.registerUser = async (req, res) => {
  try {
    const { collegeName, collegeType, email, password, aisheCode, role } = req.body;

    // Default role = admin (for institution registration)
    const userRole = role || "admin";

    // Check if user already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Check if AISHE code already registered (for institutions only)
    if (userRole === "admin" && aisheCode) {
      const existingAishe = await User.findOne({
        "institutionInfo.aisheCode": aisheCode,
      });
      if (existingAishe) {
        return res.status(400).json({ message: "AISHE code already registered" });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      RegistrationNo: `${userRole.toUpperCase()}-${Date.now()}`,
      email,
      password: hashedPassword,
      role: userRole,
      isVerified: true,
      institutionInfo:
        userRole === "admin"
          ? {
              collegeName,
              collegeType,
              aisheCode,
              subscription: {
                plan: "Basic",
                startDate: new Date(),
              },
            }
          : undefined,
    });

    // Generate token
    const token = createToken(newUser);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Response
    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        institutionInfo: newUser.institutionInfo,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};

// ==========================================================
// ✅ Login
// ==========================================================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "No account found with that email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = createToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        institutionInfo: user.institutionInfo,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// ==========================================================
// ✅ Google Login (optional, kept intact)
// ==========================================================
exports.googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
});

exports.googleCallback = (req, res) => {
  passport.authenticate("google", (err, user) => {
    if (err || !user)
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);

    const token = createToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  })(req, res);
};
