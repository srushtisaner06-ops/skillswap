import { useState, useEffect } from "react";
import axios from "axios";
import { getToken, getUser } from "../utils/auth";

const STATUS_COLORS = {
  pending:   { bg: "#FAEEDA", color: "#633806" },
  accepted:  { bg: "#E1F5EE", color: "#085041" },
  declined:  { bg: "#FCEBEB", color: "#501313" },
  completed: { bg: "#EEEDFE", color: "#26215C" },
  cancelled: { bg: "#F1EFE8", color: "#2C2C2A" }
};

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [tab, setTab]           = useState("all"); // "all" | "teaching" | "learning"
  const currentUser             = getUser();

  const fetchSessions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/sessions/mine", {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setSessions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSessions(); }, []);

  const respond = async (sessionId, action) => {
    try {
      await axios.put(
        `http://localhost:5000/api/sessions/${sessionId}/respond`,
        { action },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      fetchSessions(); // refresh
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const complete = async (sessionId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/sessions/${sessionId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      alert("Session marked complete! Credits transferred.");
      fetchSessions();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const filtered = sessions.filter(s => {
    if (tab === "teaching") return s.teacher._id === currentUser?._id || s.teacher === currentUser?._id;
    if (tab === "learning") return s.learner._id === currentUser?._id || s.learner === currentUser?._id;
    return true;
  });

  if (loading) return <p style={{ padding: 40 }}>Loading sessions...</p>;

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: "0 20px" }}>
      <h2 style={{ marginBottom: 4 }}>My sessions</h2>
      <p style={{ color: "#666", marginBottom: 20 }}>Manage your teaching and learning sessions</p>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {["all", "teaching", "learning"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: "8px 20px", borderRadius: 8, cursor: "pointer", fontWeight: 500,
              border: tab === t ? "none" : "1px solid #ddd",
              background: tab === t ? "#534AB7" : "none",
              color: tab === t ? "#fff" : "#555" }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: 60, color: "#888" }}>
          <p>No sessions yet</p>
        </div>
      )}

      {filtered.map(session => {
        const colors  = STATUS_COLORS[session.status];
        const isTeacher = session.teacher?.username === currentUser?.username ||
                          session.teacher?._id === currentUser?._id;

        return (
          <div key={session._id} style={{ background: "#fff", border: "1px solid #eee",
            borderRadius: 12, padding: 20, marginBottom: 12 }}>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h3 style={{ margin: "0 0 4px" }}>{session.skill}</h3>
                <p style={{ margin: 0, color: "#666", fontSize: 13 }}>
                  {isTeacher
                    ? `Learner: ${session.learner?.name}`
                    : `Teacher: ${session.teacher?.name}`}
                </p>
                {session.message &&
                  <p style={{ margin: "8px 0 0", fontSize: 13, color: "#555",
                    fontStyle: "italic" }}>"{session.message}"</p>}
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12,
                  background: colors.bg, color: colors.color, fontWeight: 500 }}>
                  {session.status}
                </span>
                <p style={{ margin: "6px 0 0", fontSize: 13, color: "#534AB7" }}>
                  {session.credits} credits
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              {isTeacher && session.status === "pending" && <>
                <button onClick={() => respond(session._id, "accept")}
                  style={{ padding: "7px 16px", borderRadius: 8, border: "none",
                    background: "#1D9E75", color: "#fff", cursor: "pointer" }}>
                  Accept
                </button>
                <button onClick={() => respond(session._id, "decline")}
                  style={{ padding: "7px 16px", borderRadius: 8, border: "none",
                    background: "#E24B4A", color: "#fff", cursor: "pointer" }}>
                  Decline
                </button>
              </>}
              {isTeacher && session.status === "accepted" &&
                <button onClick={() => complete(session._id)}
                  style={{ padding: "7px 16px", borderRadius: 8, border: "none",
                    background: "#534AB7", color: "#fff", cursor: "pointer" }}>
                  Mark complete
                </button>}
            </div>
          </div>
        );
      })}
    </div>
  );
}