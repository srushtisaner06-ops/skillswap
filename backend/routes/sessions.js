const express = require("express");
const router  = express.Router();
const Session = require("../models/Session");
const User    = require("../models/User");
const jwt     = require("jsonwebtoken");

// Reuse your auth middleware
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

// POST /api/sessions/request
// Learner sends a session request to a teacher
router.post("/request", authMiddleware, async (req, res) => {
  try {
    const { teacherId, skill, message } = req.body;
    const COST = 10; // credits per session

    // 1. Get learner and check they have enough credits
    const learner = await User.findById(req.userId);
    if (learner.credits < COST) {
      return res.status(400).json({ message: "Not enough credits. Teach a skill to earn more!" });
    }

    // 2. Can't request a session with yourself
    if (teacherId === req.userId) {
      return res.status(400).json({ message: "You cannot book yourself!" });
    }

    // 3. Deduct credits from learner immediately (held in escrow)
    learner.credits -= COST;
    await learner.save();

    // 4. Create the session
    const session = new Session({
      learner:  req.userId,
      teacher:  teacherId,
      skill,
      message,
      credits:  COST
    });
    await session.save();

    res.status(201).json({ message: "Session requested!", session });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PUT /api/sessions/:id/respond
// Teacher accepts or declines a request
router.put("/:id/respond", authMiddleware, async (req, res) => {
  try {
    const { action } = req.body; // "accept" or "decline"
    const session = await Session.findById(req.params.id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    // Only the teacher can respond
    if (session.teacher.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (session.status !== "pending") {
      return res.status(400).json({ message: "Session already responded to" });
    }

    if (action === "accept") {
      session.status = "accepted";
      await session.save();
      res.json({ message: "Session accepted!" });

    } else if (action === "decline") {
      // Refund credits back to learner
      session.status = "declined";
      await session.save();

      await User.findByIdAndUpdate(session.learner, {
        $inc: { credits: session.credits }
      });

      res.json({ message: "Session declined. Credits refunded to learner." });
    }

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PUT /api/sessions/:id/complete
// Mark session as done — teacher gets paid
router.put("/:id/complete", authMiddleware, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) return res.status(404).json({ message: "Session not found" });
    if (session.status !== "accepted") {
      return res.status(400).json({ message: "Session must be accepted first" });
    }

    // Transfer credits to teacher
    session.status = "completed";
    await session.save();

    const teacher = await User.findById(session.teacher);
    teacher.credits        += session.credits;
    teacher.sessionsTeught += 1;
    await teacher.save();

    await User.findByIdAndUpdate(session.learner, {
      $inc: { sessionsLearned: 1 }
    });

    res.json({ message: "Session completed! Credits transferred to teacher." });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/sessions/mine
// Get all sessions for the logged-in user (as teacher or learner)
router.get("/mine", authMiddleware, async (req, res) => {
  try {
    const sessions = await Session.find({
      $or: [{ learner: req.userId }, { teacher: req.userId }]
    })
    .populate("learner", "name photo username")
    .populate("teacher", "name photo username")
    .sort({ createdAt: -1 });

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;