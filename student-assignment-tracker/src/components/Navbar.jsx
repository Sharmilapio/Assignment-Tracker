import { MdTrackChanges, MdNotificationsNone, MdCalendarToday } from "react-icons/md";

function AppNavbar({ title = "Tracking Hub" }) {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });

  return (
    <nav style={{
      background: "linear-gradient(135deg, #0f0c3d 0%, #1e1b6e 45%, #3730a3 100%)",
      position: "fixed",
      top: 0, left: 0, right: 0,
      zIndex: 1001,
      height: "66px",
      display: "flex",
      alignItems: "center",
      padding: "0 20px",
      boxShadow: "0 2px 20px rgba(15,12,61,0.35)",
      gap: 0,
    }}>

      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: "rgba(255,255,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(4px)",
          border: "1px solid rgba(255,255,255,0.15)",
          flexShrink: 0,
        }}>
          <MdTrackChanges size={22} color="#fff" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <span style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 800, fontSize: 17, color: "#fff",
            letterSpacing: "-0.3px", lineHeight: 1.2,
          }}>
            {title}
          </span>
          <span style={{
            fontSize: 10, color: "rgba(255,255,255,0.55)",
            fontWeight: 500, letterSpacing: "0.5px", textTransform: "uppercase",
          }}>
            Academic Tracker
          </span>
        </div>
      </div>

      {/* Center: App subtitle */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <div style={{
          padding: "5px 18px",
          background: "rgba(255,255,255,0.08)",
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(4px)",
        }}>
          <span style={{
            color: "rgba(255,255,255,0.9)",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600, fontSize: 13, letterSpacing: "0.2px",
          }}>
            St. Joseph's College for Women
          </span>
        </div>
      </div>

      {/* Right actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

        {/* Date */}
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 12px",
          background: "rgba(255,255,255,0.08)",
          borderRadius: 20, border: "1px solid rgba(255,255,255,0.1)",
        }}>
          <MdCalendarToday size={13} color="rgba(255,255,255,0.7)" />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>
            {today}
          </span>
        </div>

        {/* Admin pill */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "6px 14px 6px 6px",
          background: "rgba(255,255,255,0.12)",
          borderRadius: 30,
          border: "1px solid rgba(255,255,255,0.15)",
          backdropFilter: "blur(4px)",
          cursor: "pointer",
          transition: "background 0.2s",
        }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
        >
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1, #818cf8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 13, color: "#fff",
            boxShadow: "0 2px 8px rgba(99,102,241,0.4)",
          }}>
            A
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>Admin</span>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", lineHeight: 1.2 }}>Instructor</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AppNavbar;
