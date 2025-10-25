const express = require("express");
const router = express.Router();
const {
  getAdminProfile,
  updateAdminProfile,
  getInstitutionStudents,
} = require("../controllers/adminController");
const { requireAuth } = require("../middleware/auth");
router.get("/profile", requireAuth, getAdminProfile);
router.put("/profile", requireAuth, updateAdminProfile);
router.get("/students", requireAuth, getInstitutionStudents);
module.exports = router;
