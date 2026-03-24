const express = require("express");
const router  = express.Router();
const User    = require("../models/User");
const jwt     = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Email registration route
router.post("/register", async (req, res) => {
  try {
    const { name, email, firebaseUID, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    // Hash the password before saving
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const user = new User({ name, email, firebaseUID, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, user: { name, email } });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});



// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Step 1: Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Step 2: Compare entered password with hashed password in DB
    // bcrypt.compare returns true or false
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Step 3: Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },  // data to store inside token
      process.env.JWT_SECRET,               // secret key to sign with
      { expiresIn: "7d" }                   // token expires in 7 days
    );

    // Step 4: Send token back to frontend
    res.json({
      token,
      user: { name: user.name, email: user.email }
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Google registration/login route
router.post("/google-register", async (req, res) => {
  try {
    const { name, email, firebaseUID } = req.body;

    // If user exists, just log them in. Otherwise, create them.
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, firebaseUID });
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { name, email } });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;