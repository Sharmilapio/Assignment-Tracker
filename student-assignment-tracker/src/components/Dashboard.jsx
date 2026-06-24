import {
  MdPeople, MdAssignment, MdCheckCircle, MdPending, MdWarning,
  MdArrowForward, MdTrendingUp,
} from "react-icons/md";

function Dashboard({ stats, studentCount, assignmentCount, onTabChange }) {
  const statCards = [
    {
      label: "Students",
      value: studentCount,
      icon: MdPeople,
      color: "#3730a3",
      bg: "#e0e7ff",
      iconColor: "#3730a3",
      tab: "students",
    },
    {
      label: "Assignments",
      value: assignmentCount,
      icon: MdAssignment,
      color: "#0369a1",
      bg: "#e0f2fe",
      iconColor: "#0369a1",
      tab: "assignments",
    },
    {
      label: "Submitted",
      value: stats.submitted,
      icon: MdCheckCircle,
      color: "#059669",
      bg: "#d1fae5",
      iconColor: "#059669",
      tab: "assignments",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: MdPending,
      color: "#d97706",
      bg: "#fef3c7",
      iconColor: "#d97706",
      tab: "assignments",
    },
    {
      label: "Late",
      value: stats.late,
      icon: MdWarning,
      color: "#dc2626",
      bg: "#fee2e2",
      iconColor: "#dc2626",
      tab: "assignments",
    },
  ];

  const quickLinks = [
    {
      tab: "assignments",
      Icon: MdAssignment,
      title: "Assignments",
      desc: "Create & track submissions",
      accent: "#3730a3",
      gradient: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
    },
    {
      tab: "students",
      Icon: MdPeople,
      title: "Students",
      desc: "Roster & performance",
      accent: "#059669",
      gradient: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
    },
    {
      tab: "attendance",
      Icon: MdCheckCircle,
      title: "Attendance",
      desc: "Daily attendance tracking",
      accent: "#0369a1",
      gradient: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
    },
    {
      tab: "reports",
      Icon: MdTrendingUp,
      title: "Reports",
      desc: "AI-powered analytics",
      accent: "#7c3aed",
      gradient: "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)",
    },
  ];

  const submissionRate =
    stats.total > 0 ? Math.round((stats.submitted / stats.total) * 100) : 0;

  const pendingRate =
    stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0;

  const lateRate =
    stats.total > 0 ? Math.round((stats.late / stats.total) * 100) : 0;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 16,
      padding: "20px 24px",
      height: "calc(100vh - 66px - 80px)",
      boxSizing: "border-box",
      overflow: "auto",
    }}>

      {/* ── Stat Cards ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 14,
        flexShrink: 0,
      }}>
        {statCards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              onClick={() => onTabChange(c.tab)}
              style={{
                background: "#fff",
                borderRadius: 14,
                padding: "16px 18px",
                boxShadow: "0 2px 12px rgba(55,48,163,0.07)",
                border: "1px solid #e0e7ff",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                cursor: "pointer",
                transition: "transform 0.18s ease, box-shadow 0.18s ease",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(55,48,163,0.13)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 12px rgba(55,48,163,0.07)";
              }}
            >
              {/* Top accent line */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0,
                height: 3, background: c.color, borderRadius: "14px 14px 0 0",
              }} />

              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: c.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={20} color={c.iconColor} />
              </div>

              <div>
                <div style={{
                  fontSize: 28, fontWeight: 800,
                  color: c.color,
                  fontFamily: "'Poppins', sans-serif",
                  lineHeight: 1,
                }}>
                  {c.value}
                </div>
                <div style={{
                  fontSize: 11, fontWeight: 600,
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginTop: 4,
                }}>
                  {c.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Submission Progress ── */}
      <div style={{
        background: "#fff",
        borderRadius: 14,
        padding: "18px 22px",
        boxShadow: "0 2px 12px rgba(55,48,163,0.07)",
        border: "1px solid #e0e7ff",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <span style={{
              fontSize: 14, fontWeight: 700, color: "#1e1b6e",
              fontFamily: "'Poppins', sans-serif",
              display: "block", marginBottom: 2,
            }}>
              Overall Submission Rate
            </span>
            <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>
              Based on {stats.total} total submissions
            </span>
          </div>
          <span style={{
            fontSize: 32, fontWeight: 800, color: "#3730a3",
            fontFamily: "'Poppins', sans-serif",
            lineHeight: 1,
          }}>
            {submissionRate}%
          </span>
        </div>

        {/* Stacked bar */}
        <div style={{
          height: 10, background: "#f3f4f6",
          borderRadius: 99, overflow: "hidden",
          display: "flex", gap: 0,
        }}>
          <div style={{
            height: "100%", width: `${submissionRate}%`,
            background: "linear-gradient(90deg, #059669, #34d399)",
            borderRadius: "99px 0 0 99px",
            transition: "width 0.7s ease",
          }} />
          <div style={{
            height: "100%", width: `${pendingRate}%`,
            background: "linear-gradient(90deg, #f59e0b, #fbbf24)",
            transition: "width 0.7s ease",
          }} />
          <div style={{
            height: "100%", width: `${lateRate}%`,
            background: "linear-gradient(90deg, #dc2626, #f87171)",
            borderRadius: "0 99px 99px 0",
            transition: "width 0.7s ease",
          }} />
        </div>

        <div style={{ display: "flex", gap: 20, marginTop: 12, flexWrap: "wrap" }}>
          {[
            { color: "#059669", bg: "#d1fae5", label: `${stats.submitted} Submitted` },
            { color: "#d97706", bg: "#fef3c7", label: `${stats.pending} Pending` },
            { color: "#dc2626", bg: "#fee2e2", label: `${stats.late} Late` },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{
                width: 10, height: 10, borderRadius: 3,
                background: item.color, display: "inline-block",
              }} />
              <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick Access ── */}
      <div style={{ flexShrink: 0 }}>
        <p style={{
          fontSize: 11, fontWeight: 800, color: "#9ca3af",
          fontFamily: "'Poppins', sans-serif",
          textTransform: "uppercase", letterSpacing: "1px",
          margin: "0 0 12px",
        }}>
          Quick Access
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 14,
        }}>
          {quickLinks.map((q) => {
            const Icon = q.Icon;
            return (
              <button
                key={q.tab}
                onClick={() => onTabChange(q.tab)}
                style={{
                  background: q.gradient,
                  border: "1px solid rgba(0,0,0,0.05)",
                  borderRadius: 14,
                  padding: "20px 18px",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "transform 0.18s ease, box-shadow 0.18s ease",
                  boxShadow: "0 2px 8px rgba(55,48,163,0.06)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(55,48,163,0.16)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(55,48,163,0.06)";
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "rgba(255,255,255,0.7)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}>
                  <Icon size={22} color={q.accent} />
                </div>
                <div>
                  <div style={{
                    fontSize: 14, fontWeight: 700,
                    color: q.accent,
                    fontFamily: "'Poppins', sans-serif",
                    marginBottom: 3,
                  }}>
                    {q.title}
                  </div>
                  <div style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.4 }}>
                    {q.desc}
                  </div>
                </div>
                <MdArrowForward
                  size={16}
                  color={q.accent}
                  style={{ position: "absolute", bottom: 14, right: 14, opacity: 0.5 }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
