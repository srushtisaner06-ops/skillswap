const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  email:       { type: String, required: true, unique: true },
  firebaseUID: { type: String },
  password:    { type: String },

  // Profile fields
  username:    { type: String, unique: true, sparse: true },
  bio:         { type: String, default: "" },
  photo:       { type: String, default: "" },  // will store image URL

  // Skills DNA
  skillsToTeach: [
    {
      category:    { type: String },  // e.g. "Programming"
      name:        { type: String },  // e.g. "Python"
      level:       { type: String, enum: ["Beginner", "Intermediate", "Advanced"] },
      description: { type: String }
    }
  ],
  skillsToLearn: [
    {
      category: { type: String },
      name:     { type: String },
      level:    { type: String, enum: ["Beginner", "Intermediate", "Advanced"] }
    }
  ],

  // Credit wallet
  credits:     { type: Number, default: 20 },  // new user bonus = 20 credits

  // Stats (auto-updated later)
  sessionsTeught:  { type: Number, default: 0 },
  sessionsLearned: { type: Number, default: 0 },
  rating:          { type: Number, default: 0 },
  totalRatings:    { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);
