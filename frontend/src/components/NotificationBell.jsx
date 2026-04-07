import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { getToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function NotificationBell() {
  const [count,         setCount]         = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [open,          setOpen]          = useState(false);
  const navigate = useNavigate();
  const ref      = useRef(null);

  // Fetch unread count — runs every 15 seconds
  const fetchCount = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notifications/unread-count", {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setCount(res.data.count);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch full notification list when bell is opened
  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Mark all read when dropdown opens
  const markAllRead = async () => {
    try {
      await axios.put("http://localhost:5000/api/notifications/mark-all-read", {}, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle dropdown open/closed
  const handleBellClick = async () => {
    if (!open) {
      await fetchNotifications();
      await markAllRead();
    }
    setOpen(o => !o);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Poll for new notifications every 15 seconds
  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 15000);
    return () => clearInterval(interval);
  }, []);

  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60)   return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const TYPE_COLORS = {
    session_request:   { bg: "#EEEDFE", color: "#534AB7" },
    session_accepted:  { bg: "#E1F5EE", color: "#0F6E56" },
    session_declined:  { bg: "#FCEBEB", color: "#A32D2D" },
    session_completed: { bg: "#EEEDFE", color: "#26215C" },
    credits_received:  { bg: "#FAEEDA", color: "#633806" }
  };

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>

      {/* Bell button */}
      <button onClick={handleBellClick} style={{
        position: "relative", background: "none", border: "1px solid #ddd",
        borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 18
      }}>
        🔔
        {count > 0 && (
          <span style={{
            position: "absolute", top: -6, right: -6,
            background: "#E24B4A", color: "#fff",
            borderRadius: "50%", width: 18, height: 18,
            fontSize: 11, fontWeight: 500,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: "absolute", right: 0, top: "110%",
          width: 320, background: "#fff",
          border: "1px solid #eee", borderRadius: 12,
          zIndex: 200, overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
        }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #eee",
            fontWeight: 500, fontSize: 14 }}>
            Notifications
          </div>

          {notifications.length === 0 && (
            <div style={{ padding: 24, textAlign: "center", color: "#888", fontSize: 14 }}>
              No notifications yet
            </div>
          )}

          {notifications.map(n => {
            const colors = TYPE_COLORS[n.type] || { bg: "#f5f5f5", color: "#333" };
            return (
              <div key={n._id}
                onClick={() => { navigate(n.link); setOpen(false); }}
                style={{
                  padding: "12px 16px", borderBottom: "1px solid #f5f5f5",
                  cursor: "pointer", display: "flex", gap: 10, alignItems: "flex-start",
                  background: n.read ? "#fff" : "#fafafa",
                  transition: "background 0.15s"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"}
                onMouseLeave={e => e.currentTarget.style.background = n.read ? "#fff" : "#fafafa"}
              >
                <div style={{
                  width: 8, height: 8, borderRadius: "50%", flexShrink: 0, marginTop: 5,
                  background: colors.color, opacity: n.read ? 0.3 : 1
                }}/>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 13, color: "#333", lineHeight: 1.4 }}>
                    {n.message}
                  </p>
                  <p style={{ margin: "3px 0 0", fontSize: 11, color: "#999" }}>
                    {timeAgo(n.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}