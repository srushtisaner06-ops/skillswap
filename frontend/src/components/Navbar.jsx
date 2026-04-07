import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 24px", borderBottom: "1px solid #eee",
      background: "#fff", position: "sticky", top: 0, zIndex: 100
    }}>

      {/* Logo / brand */}
      <span
        onClick={() => navigate("/dashboard")}
        style={{ fontWeight: 500, fontSize: 18, cursor: "pointer", color: "#534AB7" }}>
        SkillSwap
      </span>

      {/* Nav links */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button onClick={() => navigate("/dashboard")}
          style={{ padding: "7px 14px", borderRadius: 8, border: "none",
            background: "none", cursor: "pointer", color: "#555", fontSize: 14 }}>
          Dashboard
        </button>
        <button onClick={() => navigate("/browse")}
          style={{ padding: "7px 14px", borderRadius: 8, border: "none",
            background: "none", cursor: "pointer", color: "#555", fontSize: 14 }}>
          Browse
        </button>
        <button onClick={() => navigate("/sessions")}
          style={{ padding: "7px 14px", borderRadius: 8, border: "none",
            background: "none", cursor: "pointer", color: "#555", fontSize: 14 }}>
          Sessions
        </button>

        {/* Bell + logout */}
        <NotificationBell />
        <button onClick={() => logout(navigate)}
          style={{ padding: "7px 14px", borderRadius: 8,
            border: "1px solid #ddd", background: "none",
            cursor: "pointer", color: "#555", fontSize: 14 }}>
          Log out
        </button>
      </div>
    </div>
  );
}