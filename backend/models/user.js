// models/User.js
const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    street: String,
    city: String,
    state: String,
    country: String,
    pincode: String,
  },
  { _id: false }
);

const socialLinksSchema = new mongoose.Schema(
  {
    linkedin: String,
    github: String,
    portfolio: String,
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    middleName: String,
    profileImage: String,
    phone: String,
    dateOfBirth: Date,
    gender: { type: String, enum: ["male", "female", "other"] },
    address: addressSchema,
    socialLinks: socialLinksSchema,
    designation:String,
    institutionEmail:String
  },
  { _id: false }
);

const institutionInfoSchema = new mongoose.Schema(
  {
    collegeName: { type: String, required: true },
    collegeType: { type: String, enum: ["Government", "Private"], required: true },
    aisheCode: { type: String, required: true, unique: true }, // already indexed
    subscription: {
      plan: { type: String, enum: ["Basic", "Gold", "Premium"], default: "Basic" },
      startDate: { type: Date },
      endDate: { type: Date },
      amountPaid: { type: Number },
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true, required: true }, // unique already adds index
    email: { type: String, unique: true, required: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "faculty", "admin", "super_admin"],
      required: true,
    },
    profile: profileSchema,
    institutionInfo: institutionInfoSchema,
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    lastLogin: Date,
  },
  { timestamps: true }
);

// Only keep compound or non-unique indexes
userSchema.index({ role: 1, isActive: 1 });

module.exports = mongoose.model("User", userSchema);
