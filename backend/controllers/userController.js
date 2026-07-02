const User = require("../models/user");
const bcrypt = require("bcryptjs");

// ------------------------------------
// GET Current User Profile
// ------------------------------------
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error while fetching profile" 
    });
  }
};

// ------------------------------------
// UPDATE User Profile
// ------------------------------------
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updates = req.body;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Check if email is being changed and if it's already taken
    if (updates.email && updates.email !== user.email) {
      const emailExists = await User.findOne({ 
        email: updates.email,
        _id: { $ne: userId }
      });
      
      if (emailExists) {
        return res.status(400).json({ 
          success: false, 
          message: "Email already in use" 
        });
      }
    }

    // Update basic fields
    if (updates.email) user.email = updates.email;

    // Update profile fields
    if (updates.profile) {
      user.profile = user.profile || {};
      
      if (updates.profile.firstName) user.profile.firstName = updates.profile.firstName;
      if (updates.profile.lastName) user.profile.lastName = updates.profile.lastName;
      if (updates.profile.middleName !== undefined) user.profile.middleName = updates.profile.middleName;
      if (updates.profile.phone) user.profile.phone = updates.profile.phone;
      if (updates.profile.dateOfBirth) user.profile.dateOfBirth = updates.profile.dateOfBirth;
      if (updates.profile.gender) user.profile.gender = updates.profile.gender;
      if (updates.profile.designation) user.profile.designation = updates.profile.designation;
      if (updates.profile.institutionEmail) user.profile.institutionEmail = updates.profile.institutionEmail;
      if (updates.profile.address) user.profile.address = updates.profile.address;
      if (updates.profile.profileImage) user.profile.profileImage = updates.profile.profileImage;

      // Update social links
      if (updates.profile.socialLinks) {
        user.profile.socialLinks = user.profile.socialLinks || {};
        if (updates.profile.socialLinks.linkedin !== undefined) {
          user.profile.socialLinks.linkedin = updates.profile.socialLinks.linkedin;
        }
        if (updates.profile.socialLinks.github !== undefined) {
          user.profile.socialLinks.github = updates.profile.socialLinks.github;
        }
        if (updates.profile.socialLinks.portfolio !== undefined) {
          user.profile.socialLinks.portfolio = updates.profile.socialLinks.portfolio;
        }
      }
    }

    // Mark nested profile object as modified so Mongoose persists changes
    user.markModified('profile');

    // Save updated user
    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(userId).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser
    });

  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error while updating profile" 
    });
  }
};

// ------------------------------------
//UPDATE Password
// ------------------------------------
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "Current password and new password are required" 
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ 
        success: false, 
        message: "New password must be at least 8 characters" 
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: "Current password is incorrect" 
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });

  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error while updating password" 
    });
  }
};

// ------------------------------------
// UPDATE Profile Image
// ------------------------------------
exports.updateProfileImage = async (req, res) => {
  try {
    const { profileImage } = req.body;

    if (!profileImage) {
      return res.status(400).json({ 
        success: false, 
        message: "Profile image URL is required" 
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    user.profile = user.profile || {};
    user.profile.profileImage = profileImage;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      data: { profileImage: user.profile.profileImage }
    });

  } catch (error) {
    console.error("Update profile image error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error while updating profile image" 
    });
  }
};

// ------------------------------------
// UPDATE Academic Info (Students only)
// ------------------------------------
exports.updateAcademicInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Check if user is a student
    if (user.role !== "student") {
      return res.status(403).json({ 
        success: false, 
        message: "Academic info can only be updated for students" 
      });
    }

    const { academicInfo } = req.body;

    if (!academicInfo) {
      return res.status(400).json({ 
        success: false, 
        message: "Academic info is required" 
      });
    }

    // Initialize academicInfo if it doesn't exist
    if (!user.academicInfo) {
      user.academicInfo = {};
    }
    
    // Update basic fields
    if (academicInfo.program !== undefined) user.academicInfo.program = academicInfo.program;
    if (academicInfo.department !== undefined) user.academicInfo.department = academicInfo.department;
    if (academicInfo.yearOfAdmission !== undefined) user.academicInfo.yearOfAdmission = academicInfo.yearOfAdmission;
    if (academicInfo.currentSemester !== undefined) user.academicInfo.currentSemester = academicInfo.currentSemester;
    if (academicInfo.cgpa !== undefined) user.academicInfo.cgpa = academicInfo.cgpa;
    if (academicInfo.totalCreditsEarned !== undefined) user.academicInfo.totalCreditsEarned = academicInfo.totalCreditsEarned;
    
    // Update pastSemesters
    if (academicInfo.pastSemesters !== undefined) {
      user.academicInfo.pastSemesters = academicInfo.pastSemesters;
    }
    
    // Handle achievements - convert objects to strings if needed
    if (academicInfo.achievements !== undefined) {
      if (Array.isArray(academicInfo.achievements)) {
        // If achievements are objects, convert them to strings
        user.academicInfo.achievements = academicInfo.achievements.map(achievement => {
          if (typeof achievement === 'string') {
            return achievement;
          } else if (typeof achievement === 'object') {
            // Convert object to readable string format
            return `${achievement.title || 'Achievement'} - ${achievement.type || 'General'} (${achievement.year || 'N/A'}): ${achievement.description || ''}`.trim();
          }
          return String(achievement);
        });
      } else {
        user.academicInfo.achievements = [];
      }
    }

    // Mark the field as modified for nested objects
    user.markModified('academicInfo');

    await user.save();

    res.status(200).json({
      success: true,
      message: "Academic info updated successfully",
      data: user.academicInfo
    });

  } catch (error) {
    console.error("Update academic info error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error while updating academic info",
      error: error.message 
    });
  }
};

// ------------------------------------
// RECALCULATE CPI from SPI
// ------------------------------------
exports.resolveCPI = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    if (user.role !== "student") {
      return res.status(403).json({ 
        success: false, 
        message: "CPI calculation is only for students" 
      });
    }

    if (!user.academicInfo || !user.academicInfo.pastSemesters || user.academicInfo.pastSemesters.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "No semester data available to calculate CPI" 
      });
    }

    // Calculate weighted average CGPA from all semesters
    let totalCredits = 0;
    let weightedSum = 0;

    user.academicInfo.pastSemesters.forEach(sem => {
      if (sem.sgpa && sem.totalCredits) {
        weightedSum += sem.sgpa * sem.totalCredits;
        totalCredits += sem.totalCredits;
      }
    });

    if (totalCredits === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "No valid credit data for CPI calculation" 
      });
    }

    const calculatedCGPA = parseFloat((weightedSum / totalCredits).toFixed(2));

    user.academicInfo.cgpa = calculatedCGPA;
    user.academicInfo.totalCreditsEarned = totalCredits;

    await user.save();

    res.status(200).json({
      success: true,
      message: "CPI recalculated successfully",
      data: {
        cgpa: calculatedCGPA,
        totalCreditsEarned: totalCredits
      }
    });

  } catch (error) {
    console.error("Resolve CPI error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error while calculating CPI" 
    });
  }
};


// ============================================================
// NEW ENDPOINTS — added for ProfilePage frontend tabs
// (Students only: certifications, events, clubs)
// ============================================================

// ------------------------------------
// ADD Certification
// POST body: { title, issuedBy, issuedDate, fileUrl }
// ------------------------------------
exports.addCertification = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.role !== "student") return res.status(403).json({ success: false, message: "Only students can add certifications" });

    const { title, issuedBy, issuedDate, fileUrl } = req.body;
    if (!title) return res.status(400).json({ success: false, message: "Certification title is required" });

    if (!user.certifications) user.certifications = [];

    const newCert = {
      title,
      issuedBy: issuedBy || "",
      issuedDate: issuedDate || null,
      fileUrl: fileUrl || "",
      addedAt: new Date(),
    };

    user.certifications.push(newCert);
    user.markModified("certifications");
    await user.save();

    res.status(201).json({
      success: true,
      message: "Certification added successfully",
      data: user.certifications,
    });
  } catch (error) {
    console.error("Add certification error:", error);
    res.status(500).json({ success: false, message: "Server error while adding certification" });
  }
};

// ------------------------------------
// DELETE Certification
// PARAM: certId (index or _id depending on your schema)
// ------------------------------------
exports.deleteCertification = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.role !== "student") return res.status(403).json({ success: false, message: "Only students can delete certifications" });

    const { certId } = req.params;
    if (!user.certifications) return res.status(404).json({ success: false, message: "No certifications found" });

    const before = user.certifications.length;
    user.certifications = user.certifications.filter(c => c._id?.toString() !== certId);

    if (user.certifications.length === before) {
      return res.status(404).json({ success: false, message: "Certification not found" });
    }

    user.markModified("certifications");
    await user.save();

    res.status(200).json({ success: true, message: "Certification deleted", data: user.certifications });
  } catch (error) {
    console.error("Delete certification error:", error);
    res.status(500).json({ success: false, message: "Server error while deleting certification" });
  }
};

// ------------------------------------
// ADD Event / Workshop
// POST body: { name, role, year, description }
// ------------------------------------
exports.addEvent = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.role !== "student") return res.status(403).json({ success: false, message: "Only students can add events" });

    const { name, role, year, description } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Event name is required" });

    if (!user.events) user.events = [];

    user.events.push({
      name,
      role: role || "",
      year: year || "",
      description: description || "",
      addedAt: new Date(),
    });

    user.markModified("events");
    await user.save();

    res.status(201).json({
      success: true,
      message: "Event added successfully",
      data: user.events,
    });
  } catch (error) {
    console.error("Add event error:", error);
    res.status(500).json({ success: false, message: "Server error while adding event" });
  }
};

// ------------------------------------
// DELETE Event
// PARAM: eventId
// ------------------------------------
exports.deleteEvent = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.role !== "student") return res.status(403).json({ success: false, message: "Only students can delete events" });

    const { eventId } = req.params;
    if (!user.events) return res.status(404).json({ success: false, message: "No events found" });

    const before = user.events.length;
    user.events = user.events.filter(e => e._id?.toString() !== eventId);

    if (user.events.length === before) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    user.markModified("events");
    await user.save();

    res.status(200).json({ success: true, message: "Event deleted", data: user.events });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({ success: false, message: "Server error while deleting event" });
  }
};

// ------------------------------------
// ADD Club / Activity
// POST body: { club, designation, duration, description }
// ------------------------------------
exports.addClub = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.role !== "student") return res.status(403).json({ success: false, message: "Only students can add clubs" });

    const { club, designation, duration, description } = req.body;
    if (!club) return res.status(400).json({ success: false, message: "Club name is required" });

    if (!user.clubs) user.clubs = [];

    user.clubs.push({
      club,
      designation: designation || "",
      duration: duration || "",
      description: description || "",
      addedAt: new Date(),
    });

    user.markModified("clubs");
    await user.save();

    res.status(201).json({
      success: true,
      message: "Club added successfully",
      data: user.clubs,
    });
  } catch (error) {
    console.error("Add club error:", error);
    res.status(500).json({ success: false, message: "Server error while adding club" });
  }
};

// ------------------------------------
// DELETE Club
// PARAM: clubId
// ------------------------------------
exports.deleteClub = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.role !== "student") return res.status(403).json({ success: false, message: "Only students can delete clubs" });

    const { clubId } = req.params;
    if (!user.clubs) return res.status(404).json({ success: false, message: "No clubs found" });

    const before = user.clubs.length;
    user.clubs = user.clubs.filter(c => c._id?.toString() !== clubId);

    if (user.clubs.length === before) {
      return res.status(404).json({ success: false, message: "Club not found" });
    }

    user.markModified("clubs");
    await user.save();

    res.status(200).json({ success: true, message: "Club deleted", data: user.clubs });
  } catch (error) {
    console.error("Delete club error:", error);
    res.status(500).json({ success: false, message: "Server error while deleting club" });
  }
};