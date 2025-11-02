const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");
const { body } = require("express-validator");
const validate = require("../middleware/validate");

// Import controller
const {
  getProfile,
  updateProfile,
  updatePassword,
  updateProfileImage,
  updateAcademicInfo,
  resolveCPI
} = require("../controllers/userController");

// Validation middleware
const profileValidation = [
  body("profile.firstName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2-50 characters"),
  body("profile.lastName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2-50 characters"),
  body("profile.phone")
    .optional()
    .matches(/^[+]?[\d\s-()]+$/)
    .withMessage("Invalid phone number format"),
  body("profile.institutionEmail")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Invalid email format"),
  body("email")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Invalid email format"),
];

const passwordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/)
    .withMessage("Password must contain uppercase, lowercase, number, and special character"),
];

// Routes
router.get("/profile", requireAuth, getProfile);
router.put("/profile", requireAuth, profileValidation, validate, updateProfile);
router.put("/profile/password", requireAuth, passwordValidation, validate, updatePassword);
router.put("/profile/image", requireAuth, updateProfileImage);
router.put("/profile/academic", requireAuth, updateAcademicInfo);
router.post("/profile/resolve-cpi", requireAuth, resolveCPI);

module.exports = router;

