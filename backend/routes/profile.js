const express = require("express");
const router  = express.Router();
const User    = require("../models/User");
const jwt     = require("jsonwebtoken");

// Middleware: check if user is logged in via JWT
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;  // attach user ID to request
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

// GET /api/profile/me  — fetch logged-in user's profile
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/profile/update  — save profile changes
router.put("/update", authMiddleware, async (req, res) => {
  try {
    const { username, bio, photo, skillsToTeach, skillsToLearn } = req.body;

    // Check username is unique (if changed)
    if (username) {
      const existing = await User.findOne({ username, _id: { $ne: req.userId } });
      if (existing) return res.status(400).json({ message: "Username already taken" });
    }

    const updated = await User.findByIdAndUpdate(
      req.userId,
      { username, bio, photo, skillsToTeach, skillsToLearn },
      { new: true }  // return the updated document
    ).select("-password");

    res.json({ message: "Profile updated!", user: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/profile/:username  — view any user's public profile
router.get("/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select("-password -firebaseUID");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/profile/browse?skill=Python&category=Programming
// Search for teachers by skill
router.get("/browse/teachers", async (req, res) => {
  try {
    const { skill, category } = req.query;

    // Build a filter based on query params
    let filter = { "skillsToTeach.0": { $exists: true } }; // must have at least 1 teach skill

    if (skill) {
      filter["skillsToTeach.name"] = { $regex: skill, $options: "i" }; // case-insensitive
    }
    if (category) {
      filter["skillsToTeach.category"] = category;
    }

    const teachers = await User.find(filter)
      .select("name username photo bio skillsToTeach rating credits")
      .limit(20);

    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;