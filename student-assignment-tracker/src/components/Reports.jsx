import {
  MdBarChart, MdAssignment, MdCalendarToday, MdPeople,
  MdDownload, MdTrendingUp, MdCheckCircle, MdSchedule,
} from "react-icons/md";

const reports = [
  {
    Icon: MdAssignment,
    title: "Assignment Report",
    desc: "Summary of all assignments and submission rates per subject",
    accent: "#3730a3",
    bg: "#e0e7ff",
    gradient: "linear-gradient(135deg, #f5f3ff, #ede9fe)",
    border: "#c7d2fe",
    tag: "Assignments",
  },
  {
    Icon: MdCalendarToday,
    title: "Attendance Report",
    desc: "Daily and monthly attendance summary across all students",
    accent: "#059669",
    bg: "#d1fae5",
    gradient: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
    border: "#a7f3d0",
    tag: "Attendance",
  },
  {
    Icon: MdPeople,
    title: "Student Performance",
    desc: "Individual student submission tracking and completion rates",
    accent: "#d97706",
    bg: "#fef3c7",
    gradient: "linear-gradient(135deg, #fffbeb, #fef9c3)",
    border: "#fde68a",
    tag: "Students",
  },
];

const quickStats = [
  { Icon: MdTrendingUp,   label: "Reports Available", value: "3",    color: "#3730a3", bg: "#e0e7ff" },
  { Icon: MdCheckCircle,  label: "Export Formats",    value: "PDF & CSV", color: "#059669", bg: "#d1fae5" },
  { Icon: MdSchedule,     label: "Data Period",       value: "Current Term", color: "#d97706", bg: "#fef3c7" },
];

function Reports() {
  return (
    <div className="pg-wrapper">

      {/* Hero */}
      <div className="page-hero">
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: "rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "1px solid rgba(255,255,255,0.2)", flexShrink: 0,
          }}>
            <MdBarChart size={28} color="#fff" />
          </div>
          <div>
            <h2 style={{
              color: "#fff", fontFamily: "'Poppins',sans-serif",
              fontSize: 22, fontWeight: 800, margin: "0 0 5px", letterSpacing: "-0.3px",
            }}>
              Reports & Analytics
            </h2>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, margin: 0 }}>
              Download academic reports for assignments, attendance and student performance
            </p>
          </div>
        </div>

        {/* Quick stat chips */}
        <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
          {quickStats.map((s) => {
            const Icon = s.Icon;
            return (
              <div key={s.label} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "8px 14px",
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: 10,
              }}>
                <Icon size={14} color="rgba(255,255,255,0.8)" />
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>
                  {s.label}:
                </span>
                <span style={{ fontSize: 12, color: "#fff", fontWeight: 800 }}>{s.value}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Available Reports */}
      <div style={{
        background: "#fff", border: "1px solid #e0e7ff",
        borderRadius: 16, overflow: "hidden",
        boxShadow: "0 4px 20px rgba(55,48,163,0.07)",
      }}>
        <div style={{
          padding: "16px 22px", borderBottom: "1px solid #f3f4f6",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <MdBarChart size={18} color="#6366f1" />
            <h3 style={{
              fontFamily: "'Poppins',sans-serif",
              fontWeight: 700, color: "#1e1b6e", fontSize: 15, margin: 0,
            }}>
              Available Reports
            </h3>
          </div>
          <span style={{
            fontSize: 11, color: "#9ca3af", fontWeight: 600,
            background: "#f3f4f6", padding: "3px 10px", borderRadius: 99,
          }}>
            {reports.length} reports
          </span>
        </div>

        <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
          {reports.map((r, i) => {
            const Icon = r.Icon;
            return (
              <div
                key={i}
                style={{
                  display: "flex", alignItems: "center", gap: 16,
                  background: r.gradient,
                  border: `1px solid ${r.border}`,
                  borderLeft: `4px solid ${r.accent}`,
                  borderRadius: 12, padding: "16px 20px",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateX(4px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(55,48,163,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateX(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{
                  width: 50, height: 50, borderRadius: 13,
                  background: r.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: `0 4px 12px ${r.accent}22`,
                }}>
                  <Icon size={24} color={r.accent} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <h4 style={{
                      fontSize: 14, color: "#1e1b6e", margin: 0,
                      fontWeight: 700, fontFamily: "'Poppins',sans-serif",
                    }}>
                      {r.title}
                    </h4>
                    <span style={{
                      fontSize: 10, padding: "2px 8px", borderRadius: 99,
                      background: r.bg, color: r.accent,
                      fontWeight: 700, border: `1px solid ${r.border}`,
                    }}>
                      {r.tag}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>{r.desc}</p>
                </div>

                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      padding: "8px 14px",
                      background: "#fff", color: r.accent,
                      border: `1.5px solid ${r.accent}33`,
                      borderRadius: 9, fontWeight: 700, fontSize: 12,
                      cursor: "pointer", fontFamily: "'Poppins',sans-serif",
                      transition: "all 0.15s", whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = r.bg;
                      e.currentTarget.style.borderColor = r.accent;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fff";
                      e.currentTarget.style.borderColor = `${r.accent}33`;
                    }}
                  >
                    <MdDownload size={14} /> CSV
                  </button>
                  <button
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      padding: "8px 14px",
                      background: r.accent, color: "#fff",
                      border: "none", borderRadius: 9,
                      fontWeight: 700, fontSize: 12, cursor: "pointer",
                      fontFamily: "'Poppins',sans-serif",
                      boxShadow: `0 4px 12px ${r.accent}40`,
                      transition: "opacity 0.15s", whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                  >
                    <MdDownload size={14} /> PDF
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info note */}
      <div style={{
        background: "linear-gradient(135deg, #e0e7ff, #c7d2fe)",
        border: "1px solid #a5b4fc",
        borderRadius: 12, padding: "14px 18px",
        display: "flex", alignItems: "center", gap: 12,
        fontSize: 13, color: "#3730a3",
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9, background: "#3730a3",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <span style={{ fontSize: 16 }}>📌</span>
        </div>
        <p style={{ margin: 0, lineHeight: 1.5 }}>
          Reports reflect <strong>current live data</strong>. Download as{" "}
          <strong>PDF or CSV</strong> at any time for record keeping and sharing.
        </p>
      </div>
    </div>
  );
}

export default Reports;
