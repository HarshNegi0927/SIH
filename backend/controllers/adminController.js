// controllers/adminController.js
const User = require("../models/user");
exports.getAdminProfile = async (req, res) => {
    try {
      const userId = req.user.id; 
  
      const admin = await User.findById(userId).select("-password");
      if (!admin) {
        return res.status(404).json({ message: "User not found" });
      }
  
     
      if (admin.role !== "admin" && admin.role !== "super_admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
      }
  
      res.status(200).json({
        message: "Admin profile fetched successfully",
        admin,
      });
    } catch (error) {
      console.error("Error fetching admin profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  exports.updateAdminProfile = async (req, res) => {
    try {
      const userId = req.user.id; // from auth middleware
  
      const admin = await User.findById(userId);
      if (!admin) return res.status(404).json({ message: "Admin not found" });
  
      if (admin.role !== "admin" && admin.role !== "super_admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
      }
  
      const updates = req.body;
  
      if (updates.profile) {
        admin.profile = { ...(admin.profile || {}), ...updates.profile };
      }
  
      if (updates.institutionInfo) {
        admin.institutionInfo = { ...(admin.institutionInfo || {}), ...updates.institutionInfo };
      }
  
      await admin.save();
  
      // Remove password before sending response
      const adminObj = admin.toObject();
      delete adminObj.password;
  
      res.status(200).json({
        message: "Admin profile updated successfully",
        admin: adminObj,
      });
    } catch (err) {
      console.error("Error updating admin profile:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  