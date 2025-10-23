const express = require("express");
const router = express.Router();
const { getAcademicInfo } = require("../controllers/academicController");

router.get("/:registrationNo", getAcademicInfo);

module.exports = router;
