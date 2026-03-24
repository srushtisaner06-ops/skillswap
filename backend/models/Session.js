const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
  learner:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  teacher:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  skill:    { type: String, required: true },   // which skill being taught
  message:  { type: String, default: "" },       // learner's message to teacher

  credits:  { type: Number, default: 10 },       // credits held / to be transferred

  status: {
    type: String,
    enum: ["pending", "accepted", "declined", "completed", "cancelled"],
    default: "pending"
  },

  createdAt:   { type: Date, default: Date.now },
  scheduledAt: { type: Date }                    // optional time slot
});

module.exports = mongoose.model("Session", SessionSchema);