const jwt = require("jsonwebtoken");
const User = require("../models/user");

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify the token using your secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Attach user to the request object
    req.user = user;

    next(); 
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = { requireAuth };
