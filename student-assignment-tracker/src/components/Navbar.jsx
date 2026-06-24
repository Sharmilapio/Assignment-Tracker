import { MdTrackChanges, MdCalendarToday, MdClose, MdEvent } from "react-icons/md";
import { todayISO } from "../api";

function AppNavbar({ title = "Tracking Hub", selectedDate, onDateChange }) {
  const today = todayISO();

  const displayDate = selectedDate
    ? new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
      })
    : new Date().toLocaleDateString("en-IN", {
        weekday: "short", day: "numeric", month: "short", year: "numeric",
      });

  const isFiltering = selectedDate && selectedDate !== today;
  const isToday     = selectedDate === today;

  return (
    <nav style={{
      background: "linear-gradient(135deg, #0f0c3d 0%, #1e1b6e 45%, #3730a3 100%)",
      position: "fixed", top: 0, left: 0, right: 0,
      zIndex: 1001, height: "66px",
      display: "flex", alignItems: "center",
      padding: "0 20px",
      boxShadow: "0 2px 20px rgba(15,12,61,0.35)",
      gap: 12,
    }}>

      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: "rgba(255,255,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "1px solid rgba(255,255,255,0.15)", flexShrink: 0,
        }}>
          <MdTrackChanges size={22} color="#fff" />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 17, color: "#fff", letterSpacing: "-0.3px", lineHeight: 1.2 }}>
            {title}
          </span>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", fontWeight: 500, letterSpacing: "0.5px", textTransform: "uppercase" }}>
            Academic Tracker
          </span>
        </div>
      </div>

      {/* Center: institution */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "6px 18px",
          background: "rgba(255,255,255,0.08)",
          borderRadius: 20, border: "1px solid rgba(255,255,255,0.12)",
        }}>
          <img src="/Milestone.png" alt="SJC" style={{ width: 22, height: 22, objectFit: "contain", opacity: 0.9 }} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ color: "#fff", fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>
              St. Joseph's College for Women
            </span>
            <span style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: 10 }}>
              Dept. of CS with Data Analytics
            </span>
          </div>
        </div>
      </div>

      {/* Right: Date picker + admin */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>

        {/* Global date filter */}
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          background: isFiltering ? "rgba(251,191,36,0.18)" : "rgba(255,255,255,0.08)",
          border: `1px solid ${isFiltering ? "rgba(251,191,36,0.4)" : "rgba(255,255,255,0.1)"}`,
          borderRadius: 20, padding: "4px 4px 4px 12px",
          transition: "all 0.2s",
        }}>
          <MdEvent size={13} color={isFiltering ? "#fbbf24" : "rgba(255,255,255,0.7)"} />
          <span style={{
            fontSize: 11, fontWeight: 600,
            color: isFiltering ? "#fef3c7" : "rgba(255,255,255,0.8)",
            whiteSpace: "nowrap",
          }}>
            {isFiltering ? `📅 ${displayDate}` : isToday ? `Today · ${displayDate}` : displayDate}
          </span>

          {/* Native date input — invisible, full coverage */}
          <div style={{ position: "relative" }}>
            <input
              type="date"
              value={selectedDate || today}
              max={today}
              onChange={(e) => onDateChange(e.target.value || null)}
              style={{
                position: "absolute", inset: 0, opacity: 0,
                cursor: "pointer", width: "100%", height: "100%",
                zIndex: 2,
              }}
            />
            <div style={{
              width: 28, height: 28, borderRadius: 99,
              background: "rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", position: "relative",
            }}>
              <MdCalendarToday size={14} color="#fff" />
            </div>
          </div>

          {/* Clear filter — show only when not today */}
          {selectedDate && selectedDate !== today && (
            <button
              onClick={() => onDateChange(null)}
              title="Clear date filter"
              style={{
                width: 24, height: 24, borderRadius: 99,
                background: "rgba(255,255,255,0.15)",
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "rgba(255,255,255,0.8)", transition: "background 0.15s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.28)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
            >
              <MdClose size={13} />
            </button>
          )}
        </div>

        {/* Today shortcut — show only when a past date is selected */}
        {isFiltering && (
          <button
            onClick={() => onDateChange(null)}
            style={{
              padding: "5px 12px", borderRadius: 99,
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "rgba(255,255,255,0.85)", fontSize: 11,
              fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
          >
            Back to Today
          </button>
        )}

        {/* Admin pill */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "6px 14px 6px 6px",
          background: "rgba(255,255,255,0.12)",
          borderRadius: 30, border: "1px solid rgba(255,255,255,0.15)",
          cursor: "pointer", transition: "background 0.2s",
        }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
        >
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: "linear-gradient(135deg,#6366f1,#818cf8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 13, color: "#fff",
            boxShadow: "0 2px 8px rgba(99,102,241,0.4)",
          }}>A</div>
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
