function Dashboard({ stats, studentCount, assignmentCount, onTabChange }) {
  const statCards = [
    { label: "Students",    value: studentCount,    color: "#3730a3", bg: "#e0e7ff", icon: "👥" },
    { label: "Assignments", value: assignmentCount, color: "#0369a1", bg: "#e0f2fe", icon: "📝" },
    { label: "Submitted",   value: stats.submitted, color: "#059669", bg: "#d1fae5", icon: "✅" },
    { label: "Pending",     value: stats.pending,   color: "#d97706", bg: "#fef3c7", icon: "⏳" },
    { label: "Late",        value: stats.late,      color: "#dc2626", bg: "#fee2e2", icon: "⚠️" },
  ];

  const quickLinks = [
    { tab: "assignments", icon: "📝", title: "Assignments", desc: "Create & track submissions", color: "#3730a3", bg: "linear-gradient(135deg, #e0e7ff, #c7d2fe)" },
    { tab: "students",    icon: "👥", title: "Students",    desc: "Roster & performance",      color: "#059669", bg: "linear-gradient(135deg, #d1fae5, #a7f3d0)" },
    { tab: "attendance",  icon: "✓",  title: "Attendance",  desc: "Daily attendance tracking", color: "#0369a1", bg: "linear-gradient(135deg, #e0f2fe, #bae6fd)" },
    { tab: "reports",     icon: "📈", title: "Reports",     desc: "AI-powered reports",        color: "#7c3aed", bg: "linear-gradient(135deg, #ede9fe, #ddd6fe)" },
  ];

  const submissionRate =
    stats.total > 0 ? Math.round((stats.submitted / stats.total) * 100) : 0;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      padding: "10px 20px",
      height: "calc(100vh - 140px)",
      boxSizing: "border-box",
      overflow: "hidden",
      width: "100%",
    }}>

      {/* ── Stat Cards ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: "10px",
        flexShrink: 0,
      }}>
        {statCards.map((c) => (
          <div key={c.label} style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "12px 14px",
            boxShadow: "0 2px 8px rgba(55,48,163,0.08)",
            border: `1px solid ${c.bg}`,
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "8px",
              background: c.bg, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "16px",
            }}>
              {c.icon}
            </div>
            <div style={{
              fontSize: "24px", fontWeight: "700",
              color: c.color, fontFamily: "'Poppins', sans-serif",
              lineHeight: 1,
            }}>
              {c.value}
            </div>
            <div style={{
              fontSize: "11px", fontWeight: "600",
              color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px",
            }}>
              {c.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Submission Progress ── */}
      <div style={{
        background: "#fff", borderRadius: "12px",
        padding: "14px 18px",
        boxShadow: "0 2px 8px rgba(55,48,163,0.08)",
        border: "1px solid #e0e7ff",
        flexShrink: 0,
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: "8px",
        }}>
          <span style={{
            fontSize: "13px", fontWeight: "600",
            color: "#1e1b6e", fontFamily: "'Poppins', sans-serif",
          }}>
            Overall Submission Rate
          </span>
          <span style={{
            fontSize: "18px", fontWeight: "700",
            color: "#3730a3", fontFamily: "'Poppins', sans-serif",
          }}>
            {submissionRate}%
          </span>
        </div>
        <div style={{
          height: "8px", background: "#e0e7ff",
          borderRadius: "99px", overflow: "hidden",
        }}>
          <div style={{
            height: "100%", width: `${submissionRate}%`,
            background: "linear-gradient(90deg, #3730a3, #6366f1)",
            borderRadius: "99px",
            transition: "width 0.6s ease",
          }} />
        </div>
        <div style={{
          display: "flex", gap: "16px", marginTop: "8px",
          fontSize: "11px", color: "#6b7280",
        }}>
          <span>✅ {stats.submitted} Submitted</span>
          <span>⏳ {stats.pending} Pending</span>
          <span>⚠️ {stats.late} Late</span>
          <span style={{ marginLeft: "auto" }}>Total: {stats.total} submissions</span>
        </div>
      </div>

      {/* ── Quick Access ── */}
      <div style={{ flexShrink: 0 }}>
        <p style={{
          fontSize: "11px", fontWeight: "700", color: "#1e1b6e",
          fontFamily: "'Poppins', sans-serif",
          textTransform: "uppercase", letterSpacing: "0.5px",
          margin: "0 0 8px",
        }}>
          Quick Access
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
        }}>
          {quickLinks.map((q) => (
            <button
              key={q.tab}
              onClick={() => onTabChange(q.tab)}
              style={{
                background: q.bg,
                border: "none", borderRadius: "12px",
                padding: "16px 14px", textAlign: "left",
                cursor: "pointer",
                transition: "transform 0.15s, box-shadow 0.15s",
                boxShadow: "0 2px 6px rgba(55,48,163,0.06)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 18px rgba(55,48,163,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 6px rgba(55,48,163,0.06)";
              }}
            >
              <div style={{ fontSize: "22px", marginBottom: "8px" }}>{q.icon}</div>
              <div style={{
                fontSize: "13px", fontWeight: "700",
                color: q.color, fontFamily: "'Poppins', sans-serif",
                marginBottom: "4px",
              }}>
                {q.title}
              </div>
              <div style={{ fontSize: "11px", color: "#6b7280", lineHeight: "1.4" }}>
                {q.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Dashboard;