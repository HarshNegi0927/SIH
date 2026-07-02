const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const assignmentStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Strip special chars from filename for clean public_id
    const cleanName = file.originalname
      .replace(/\.[^/.]+$/, "")           // remove extension
      .replace(/[^a-zA-Z0-9_-]/g, "_")   // replace special chars with _
      .replace(/_+/g, "_")               // collapse multiple underscores
      .slice(0, 60);                      // max 60 chars

    return {
      folder: "sihchronize/assignments",
      resource_type: "auto",
      public_id: `${Date.now()}_${cleanName}`,
      use_filename: false,
    };
  },
});

const uploadAssignment = multer({
  storage: assignmentStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

module.exports = { cloudinary, uploadAssignment };