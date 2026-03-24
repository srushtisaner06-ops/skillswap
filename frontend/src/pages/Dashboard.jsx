import { useEffect, useState } from "react";
import axios from "axios";
import { getToken, logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser]       = useState(null);
  const navigate              = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/profile/me", {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        setUser(res.data);
      } catch {
        logout(navigate);
      }
    };
    load();
  }, []);

  if (!user) return <p style={{ padding: 40 }}>Loading...</p>;

  return (
    <div style={{ maxWidth: 680, margin: "40px auto", padding: "0 20px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center",
        justifyContent: "space-between", marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {user.photo
            ? <img src={user.photo} alt="avatar" style={{
                width: 60, height: 60, borderRadius: "50%", objectFit: "cover" }}/>
            : <div style={{ width: 60, height: 60, borderRadius: "50%",
                background: "#534AB7", display: "flex", alignItems: "center",
                justifyContent: "center", color: "#fff", fontSize: 24 }}>
                {user.name?.[0]}
              </div>
          }
          <div>
            <h2 style={{ margin: 0 }}>{user.name}</h2>
            <p style={{ margin: 0, color: "#666" }}>{user.bio || "No bio yet"}</p>
          </div>
        </div>
        <button onClick={() => logout(navigate)}
          style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #ddd",
            background: "none", cursor: "pointer" }}>
          Log out
        </button>
      </div>

      {/* Credit wallet */}
      <div style={{ background: "#EEEDFE", border: "1px solid #AFA9EC",
        borderRadius: 12, padding: 20, marginBottom: 24, display: "flex",
        alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ margin: 0, color: "#534AB7", fontWeight: 500 }}>Credit wallet</p>
          <h1 style={{ margin: "4px 0", color: "#26215C" }}>{user.credits} credits</h1>
          <p style={{ margin: 0, color: "#7F77DD", fontSize: 13 }}>
            Teach skills to earn more
          </p>
        </div>
        <div style={{ textAlign: "right", fontSize: 13, color: "#534AB7" }}>
          <p style={{ margin: 0 }}>Sessions taught: {user.sessionsTeught}</p>
          <p style={{ margin: 0 }}>Sessions learned: {user.sessionsLearned}</p>
        </div>
      </div>

      {/* Skills summary */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div style={{ background: "#E1F5EE", border: "1px solid #5DCAA5",
          borderRadius: 12, padding: 16 }}>
          <h3 style={{ margin: "0 0 12px", color: "#085041" }}>I can teach</h3>
          {user.skillsToTeach?.length
            ? user.skillsToTeach.map((s, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <span style={{ fontWeight: 500, color: "#0f6e56" }}>{s.name}</span>
                  <span style={{ fontSize: 12, color: "#1D9E75",
                    marginLeft: 8, background: "#9FE1CB",
                    padding: "2px 8px", borderRadius: 20 }}>
                    {s.level}
                  </span>
                </div>
              ))
            : <p style={{ color: "#1D9E75", fontSize: 13 }}>Add skills to start earning credits</p>
          }
        </div>
        <div style={{ background: "#EEEDFE", border: "1px solid #AFA9EC",
          borderRadius: 12, padding: 16 }}>
          <h3 style={{ margin: "0 0 12px", color: "#26215C" }}>I want to learn</h3>
          {user.skillsToLearn?.length
            ? user.skillsToLearn.map((s, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <span style={{ fontWeight: 500, color: "#3C3489" }}>{s.name}</span>
                  <span style={{ fontSize: 12, color: "#534AB7",
                    marginLeft: 8, background: "#CECBF6",
                    padding: "2px 8px", borderRadius: 20 }}>
                    {s.level}
                  </span>
                </div>
              ))
            : <p style={{ color: "#7F77DD", fontSize: 13 }}>Add skills you want to learn</p>
          }
        </div>
      </div>

      {/* Edit profile button */}
      <button onClick={() => navigate("/profile-setup")}
        style={{ width: "100%", padding: 12, background: "#534AB7",
          color: "#fff", border: "none", borderRadius: 8,
          fontSize: 15, cursor: "pointer" }}>
        Edit profile
      </button>

        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <button onClick={() => navigate("/browse")}
            style={{ flex: 1, padding: 12, background: "#E1F5EE", color: "#085041",
              border: "1px solid #5DCAA5", borderRadius: 8, cursor: "pointer", fontWeight: 500 }}>
            Find a teacher
          </button>
          <button onClick={() => navigate("/sessions")}
            style={{ flex: 1, padding: 12, background: "#EEEDFE", color: "#26215C",
              border: "1px solid #AFA9EC", borderRadius: 8, cursor: "pointer", fontWeight: 500 }}>
            My sessions
          </button>
        </div>
    </div>
  );
}
