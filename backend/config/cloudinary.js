// backend/config/cloudinary.js
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for assignment submissions
const assignmentStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:    "sihchronize/assignments",
    resource_type: "auto",   // accepts PDF, images, docs
    allowed_formats: ["pdf", "doc", "docx", "png", "jpg", "jpeg", "zip", "txt"],
  },
});

const uploadAssignment = multer({ storage: assignmentStorage });

module.exports = { cloudinary, uploadAssignment };