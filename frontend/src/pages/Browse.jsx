import { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  "All", "Programming", "Design", "Music", "Languages",
  "Mathematics", "Science", "Business", "Art", "Writing", "Cooking", "Fitness"
];

export default function Browse() {
  const [teachers, setTeachers]   = useState([]);
  const [search, setSearch]       = useState("");
  const [category, setCategory]   = useState("All");
  const [loading, setLoading]     = useState(false);
  const [requesting, setRequesting] = useState(null); // teacher ID being requested
  const [modal, setModal]         = useState(null);   // teacher to show request form for
  const [message, setMessage]     = useState("");
  const navigate = useNavigate();

  // Fetch teachers whenever search or category changes
  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      try {
        const params = {};
        if (search)            params.skill     = search;
        if (category !== "All") params.category = category;

        const res = await axios.get("http://localhost:5000/api/profile/browse/teachers", { params });
        setTeachers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const delay = setTimeout(fetchTeachers, 400); // debounce — wait 400ms after typing
    return () => clearTimeout(delay);
  }, [search, category]);

  // Send session request
  const sendRequest = async (teacher, skill) => {
    setRequesting(teacher._id);
    try {
      await axios.post(
        "http://localhost:5000/api/sessions/request",
        { teacherId: teacher._id, skill, message },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      alert(`Session requested with ${teacher.name}! 10 credits deducted.`);
      setModal(null);
      setMessage("");
    } catch (err) {
      alert(err.response?.data?.message || "Error sending request");
    } finally {
      setRequesting(null);
    }
  };

  const card = {
    background: "#fff", border: "1px solid #eee", borderRadius: 12,
    padding: 20, marginBottom: 16
  };

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: "0 20px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0 }}>Find a teacher</h2>
          <p style={{ margin: 0, color: "#666", fontSize: 14 }}>Browse by skill or category</p>
        </div>
        <button onClick={() => navigate("/dashboard")}
          style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #ddd",
            background: "none", cursor: "pointer" }}>
          My dashboard
        </button>
      </div>

      {/* Search bar */}
      <input
        placeholder="Search by skill (e.g. Python, Guitar, Spanish...)"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: "100%", padding: "12px 16px", borderRadius: 10,
          border: "1px solid #ddd", fontSize: 15, marginBottom: 12, boxSizing: "border-box" }}
      />

      {/* Category filter pills */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            style={{
              padding: "6px 14px", borderRadius: 20, fontSize: 13, cursor: "pointer",
              border: category === cat ? "none" : "1px solid #ddd",
              background: category === cat ? "#534AB7" : "none",
              color: category === cat ? "#fff" : "#555"
            }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading && <p style={{ color: "#666" }}>Searching...</p>}

      {!loading && teachers.length === 0 && (
        <div style={{ textAlign: "center", padding: 60, color: "#888" }}>
          <p style={{ fontSize: 18 }}>No teachers found</p>
          <p style={{ fontSize: 14 }}>Try a different skill or category</p>
        </div>
      )}

      {teachers.map(teacher => (
        <div key={teacher._id} style={card}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>

            {/* Avatar */}
            {teacher.photo
              ? <img src={teacher.photo} alt="avatar"
                  style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}/>
              : <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#EEEDFE",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#534AB7", fontWeight: 500, fontSize: 22, flexShrink: 0 }}>
                  {teacher.name?.[0]}
                </div>
            }

            {/* Info */}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ margin: 0 }}>{teacher.name}</h3>
                  {teacher.username &&
                    <span style={{ color: "#888", fontSize: 13 }}>@{teacher.username}</span>}
                </div>
                {teacher.rating > 0 &&
                  <span style={{ color: "#BA7517", fontSize: 14 }}>
                    ★ {teacher.rating.toFixed(1)}
                  </span>}
              </div>

              {teacher.bio &&
                <p style={{ margin: "6px 0", color: "#555", fontSize: 14 }}>{teacher.bio}</p>}

              {/* Skills they teach */}
              <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 8 }}>
                {teacher.skillsToTeach?.map((s, i) => (
                  <button key={i}
                    onClick={() => setModal({ teacher, skill: s.name })}
                    style={{
                      padding: "5px 12px", borderRadius: 20, fontSize: 13,
                      border: "1px solid #5DCAA5", background: "#E1F5EE",
                      color: "#085041", cursor: "pointer"
                    }}>
                    {s.name}
                    <span style={{ marginLeft: 6, opacity: 0.7, fontSize: 11 }}>{s.level}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Request modal */}
      {modal && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.45)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 100, minHeight: "100vh" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28,
            width: "90%", maxWidth: 420 }}>
            <h3 style={{ margin: "0 0 4px" }}>Request session</h3>
            <p style={{ margin: "0 0 16px", color: "#666", fontSize: 14 }}>
              {modal.teacher.name} — {modal.skill}
            </p>
            <p style={{ margin: "0 0 12px", fontSize: 13, color: "#534AB7",
              background: "#EEEDFE", padding: "8px 12px", borderRadius: 8 }}>
              This will deduct 10 credits from your wallet
            </p>
            <textarea
              placeholder="Message to teacher (optional) — e.g. I'm a complete beginner and want to learn the basics"
              value={message}
              onChange={e => setMessage(e.target.value)}
              style={{ width: "100%", padding: 10, borderRadius: 8,
                border: "1px solid #ddd", fontSize: 14, height: 80,
                resize: "none", boxSizing: "border-box", marginBottom: 16 }}
            />
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setModal(null); setMessage(""); }}
                style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #ddd",
                  background: "none", cursor: "pointer" }}>
                Cancel
              </button>
              <button
                onClick={() => sendRequest(modal.teacher, modal.skill)}
                disabled={requesting === modal.teacher._id}
                style={{ flex: 1, padding: 10, borderRadius: 8, border: "none",
                  background: "#534AB7", color: "#fff", cursor: "pointer", fontWeight: 500 }}>
                {requesting === modal.teacher._id ? "Sending..." : "Send request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}