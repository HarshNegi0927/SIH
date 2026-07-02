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
  params: async (req, file) => ({
    folder: "sihchronize/assignments",
    resource_type: "auto",
    public_id: `${Date.now()}_${file.originalname.replace(/\s+/g, "_").replace(/\.[^/.]+$/, "")}`,
    // flags: "attachment" — forces download instead of preview (remove if you want browser preview)
  }),
});

const uploadAssignment = multer({
  storage: assignmentStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
});

module.exports = { cloudinary, uploadAssignment };