const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message:   { type: String, required: true },
  type:      {
    type: String,
    enum: ["session_request", "session_accepted", "session_declined", "session_completed", "credits_received"],
    default: "session_request"
  },
  read:      { type: Boolean, default: false },
  link:      { type: String, default: "/sessions" }, // where to go when clicked
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", NotificationSchema);