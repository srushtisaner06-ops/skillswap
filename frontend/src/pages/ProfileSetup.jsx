import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getToken } from "../utils/auth";

const SKILL_CATEGORIES = [
  "Programming", "Design", "Music", "Languages",
  "Mathematics", "Science", "Business", "Art",
  "Writing", "Cooking", "Fitness", "Other"
];

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

export default function ProfileSetup() {
  const navigate  = useNavigate();
  const [loading, setLoading]   = useState(false);
  const [message, setMessage]   = useState("");

  const [form, setForm] = useState({
    username:      "",
    bio:           "",
    photo:         "",
    skillsToTeach: [],
    skillsToLearn: []
  });

  // Load existing profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/profile/me", {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        const u = res.data;
        setForm({
          username:      u.username      || "",
          bio:           u.bio           || "",
          photo:         u.photo         || "",
          skillsToTeach: u.skillsToTeach || [],
          skillsToLearn: u.skillsToLearn || []
        });
      } catch (err) {
        console.log("No existing profile yet");
      }
    };
    fetchProfile();
  }, []);

  // Add a blank skill slot
  const addTeachSkill = () => {
    setForm(f => ({
      ...f,
      skillsToTeach: [...f.skillsToTeach,
        { category: "", name: "", level: "Beginner", description: "" }
      ]
    }));
  };

  const addLearnSkill = () => {
    setForm(f => ({
      ...f,
      skillsToLearn: [...f.skillsToLearn,
        { category: "", name: "", level: "Beginner" }
      ]
    }));
  };

  // Update a specific skill field
  const updateTeachSkill = (index, field, value) => {
    const updated = [...form.skillsToTeach];
    updated[index][field] = value;
    setForm(f => ({ ...f, skillsToTeach: updated }));
  };

  const updateLearnSkill = (index, field, value) => {
    const updated = [...form.skillsToLearn];
    updated[index][field] = value;
    setForm(f => ({ ...f, skillsToLearn: updated }));
  };

  // Remove a skill
  const removeTeachSkill = (index) => {
    setForm(f => ({
      ...f,
      skillsToTeach: f.skillsToTeach.filter((_, i) => i !== index)
    }));
  };

  const removeLearnSkill = (index) => {
    setForm(f => ({
      ...f,
      skillsToLearn: f.skillsToLearn.filter((_, i) => i !== index)
    }));
  };

  // Save profile
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.put("http://localhost:5000/api/profile/update", form, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setMessage("Profile saved successfully!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error saving profile");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "8px 12px", marginBottom: 10,
    border: "1px solid #ddd", borderRadius: 6, fontSize: 14, boxSizing: "border-box"
  };
  const selectStyle = { ...inputStyle, background: "white" };
  const sectionStyle = {
    background: "#f9f9f9", border: "1px solid #eee",
    borderRadius: 10, padding: 16, marginBottom: 16
  };

  return (
    <div style={{ maxWidth: 680, margin: "40px auto", padding: "0 20px" }}>
      <h2 style={{ marginBottom: 4 }}>Set up your profile</h2>
      <p style={{ color: "#666", marginBottom: 24 }}>
        You have 20 credits to start. Teach skills to earn more!
      </p>

      {message && (
        <div style={{
          padding: 12, borderRadius: 8, marginBottom: 16,
          background: message.includes("success") ? "#e6f9f0" : "#ffeaea",
          color: message.includes("success") ? "#0f6e56" : "#a32d2d"
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSave}>

        {/* Basic Info */}
        <div style={sectionStyle}>
          <h3 style={{ marginTop: 0 }}>Basic info</h3>
          <input
            style={inputStyle}
            placeholder="Username (e.g. srushti_dev)"
            value={form.username}
            onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
          />
          <input
            style={inputStyle}
            placeholder="Profile photo URL (paste a link to your photo)"
            value={form.photo}
            onChange={e => setForm(f => ({ ...f, photo: e.target.value }))}
          />
          {form.photo && (
            <img src={form.photo} alt="preview"
              style={{ width: 80, height: 80, borderRadius: "50%",
                objectFit: "cover", marginBottom: 10 }}
            />
          )}
          <textarea
            style={{ ...inputStyle, height: 80, resize: "vertical" }}
            placeholder='Bio / tagline — e.g. "Teaching Python to beginners | Learning UI Design"'
            value={form.bio}
            onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
          />
        </div>

        {/* Skills to Teach */}
        <div style={sectionStyle}>
          <h3 style={{ marginTop: 0 }}>Skills I can teach</h3>
          <p style={{ color: "#666", fontSize: 13, marginTop: -8 }}>
            Teaching earns you credits. Add your strongest skills.
          </p>

          {form.skillsToTeach.map((skill, i) => (
            <div key={i} style={{
              background: "#fff", border: "1px solid #e0e0e0",
              borderRadius: 8, padding: 12, marginBottom: 10
            }}>
              <div style={{ display: "flex", gap: 8 }}>
                <select style={{ ...selectStyle, flex: 1 }}
                  value={skill.category}
                  onChange={e => updateTeachSkill(i, "category", e.target.value)}>
                  <option value="">Select category</option>
                  {SKILL_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
                <select style={{ ...selectStyle, width: 150 }}
                  value={skill.level}
                  onChange={e => updateTeachSkill(i, "level", e.target.value)}>
                  {LEVELS.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <input style={inputStyle}
                placeholder="Skill name (e.g. Python, Figma, Guitar)"
                value={skill.name}
                onChange={e => updateTeachSkill(i, "name", e.target.value)}
              />
              <input style={inputStyle}
                placeholder="Short description (e.g. I can teach Python basics and data structures)"
                value={skill.description}
                onChange={e => updateTeachSkill(i, "description", e.target.value)}
              />
              <button type="button" onClick={() => removeTeachSkill(i)}
                style={{ background: "none", border: "none", color: "#a32d2d",
                  cursor: "pointer", fontSize: 13 }}>
                Remove
              </button>
            </div>
          ))}

          <button type="button" onClick={addTeachSkill}
            style={{ padding: "8px 16px", borderRadius: 6, border: "1px dashed #0f6e56",
              color: "#0f6e56", background: "none", cursor: "pointer" }}>
            + Add skill to teach
          </button>
        </div>

        {/* Skills to Learn */}
        <div style={sectionStyle}>
          <h3 style={{ marginTop: 0 }}>Skills I want to learn</h3>
          <p style={{ color: "#666", fontSize: 13, marginTop: -8 }}>
            This helps us match you with the right teachers.
          </p>

          {form.skillsToLearn.map((skill, i) => (
            <div key={i} style={{
              background: "#fff", border: "1px solid #e0e0e0",
              borderRadius: 8, padding: 12, marginBottom: 10
            }}>
              <div style={{ display: "flex", gap: 8 }}>
                <select style={{ ...selectStyle, flex: 1 }}
                  value={skill.category}
                  onChange={e => updateLearnSkill(i, "category", e.target.value)}>
                  <option value="">Select category</option>
                  {SKILL_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
                <select style={{ ...selectStyle, width: 150 }}
                  value={skill.level}
                  onChange={e => updateLearnSkill(i, "level", e.target.value)}>
                  {LEVELS.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <input style={inputStyle}
                placeholder="Skill name (e.g. UI Design, Spanish, Piano)"
                value={skill.name}
                onChange={e => updateLearnSkill(i, "name", e.target.value)}
              />
              <button type="button" onClick={() => removeLearnSkill(i)}
                style={{ background: "none", border: "none", color: "#a32d2d",
                  cursor: "pointer", fontSize: 13 }}>
                Remove
              </button>
            </div>
          ))}

          <button type="button" onClick={addLearnSkill}
            style={{ padding: "8px 16px", borderRadius: 6, border: "1px dashed #534AB7",
              color: "#534AB7", background: "none", cursor: "pointer" }}>
            + Add skill to learn
          </button>
        </div>

        <button type="submit" disabled={loading}
          style={{ width: "100%", padding: 14, background: "#534AB7",
            color: "#fff", border: "none", borderRadius: 8,
            fontSize: 16, cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "Saving..." : "Save profile"}
        </button>
      </form>
    </div>
  );
}