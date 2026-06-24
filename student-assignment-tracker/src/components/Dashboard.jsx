import {
  MdPeople, MdAssignment, MdCheckCircle, MdPending, MdWarning,
  MdArrowForward, MdTrendingUp, MdCalendarToday, MdFilterAlt,
} from "react-icons/md";
import { todayISO } from "../api";

function Dashboard({ stats, studentCount, assignmentCount, onTabChange, selectedDate, attendance, assignments }) {
  const today    = todayISO();
  const isFilter = selectedDate && selectedDate !== today;

  /* ── date-scoped attendance ── */
  const dateAttendance   = attendance?.[selectedDate || today] || {};
  const presentCount     = Object.values(dateAttendance).filter(Boolean).length;
  const absentCount      = studentCount - presentCount;
  const attendanceTaken  = Object.keys(dateAttendance).length > 0;

  /* ── date-scoped assignments (due on selected date) ── */
  const dueOnDate = selectedDate
    ? assignments.filter((a) => a.dueDate === selectedDate)
    : assignments;

  /* ── display label ── */
  const dateLabel = selectedDate
    ? new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "All time";

  const statCards = [
    { label: "Students",    value: studentCount,       icon: MdPeople,      color: "#3730a3", bg: "#e0e7ff", tab: "students" },
    { label: isFilter ? "Due This Day" : "Assignments", value: isFilter ? dueOnDate.length : assignmentCount, icon: MdAssignment, color: "#0369a1", bg: "#e0f2fe", tab: "assignments" },
    { label: "Submitted",   value: stats.submitted,    icon: MdCheckCircle, color: "#059669", bg: "#d1fae5", tab: "assignments" },
    { label: "Pending",     value: stats.pending,      icon: MdPending,     color: "#d97706", bg: "#fef3c7", tab: "assignments" },
    { label: "Late",        value: stats.late,         icon: MdWarning,     color: "#dc2626", bg: "#fee2e2", tab: "assignments" },
  ];

  const submissionRate = stats.total > 0 ? Math.round((stats.submitted / stats.total) * 100) : 0;
  const pendingRate    = stats.total > 0 ? Math.round((stats.pending   / stats.total) * 100) : 0;
  const lateRate       = stats.total > 0 ? Math.round((stats.late      / stats.total) * 100) : 0;
  const attendancePct  = studentCount > 0 ? Math.round((presentCount / studentCount) * 100) : 0;

  const quickLinks = [
    { tab: "assignments", Icon: MdAssignment,  title: "Assignments", desc: "Create & track submissions", accent: "#3730a3", gradient: "linear-gradient(135deg,#e0e7ff,#c7d2fe)" },
    { tab: "students",    Icon: MdPeople,       title: "Students",    desc: "Roster & performance",      accent: "#059669", gradient: "linear-gradient(135deg,#d1fae5,#a7f3d0)" },
    { tab: "attendance",  Icon: MdCheckCircle,  title: "Attendance",  desc: "Daily attendance tracking", accent: "#0369a1", gradient: "linear-gradient(135deg,#e0f2fe,#bae6fd)" },
    { tab: "reports",     Icon: MdTrendingUp,   title: "Reports",     desc: "Download academic reports", accent: "#7c3aed", gradient: "linear-gradient(135deg,#ede9fe,#ddd6fe)" },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16, padding:"20px 24px", height:"calc(100vh - 66px - 80px)", boxSizing:"border-box", overflow:"auto" }}>

      {/* ── Date context banner ── */}
      <div style={{
        background: isFilter
          ? "linear-gradient(135deg,#fffbeb,#fef3c7)"
          : "linear-gradient(135deg,#f5f3ff,#ede9fe)",
        border: `1px solid ${isFilter ? "#fde68a" : "#c7d2fe"}`,
        borderRadius: 12, padding: "10px 16px",
        display: "flex", alignItems: "center", gap: 10,
        flexShrink: 0,
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: isFilter ? "#fef3c7" : "#e0e7ff",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          {isFilter
            ? <MdFilterAlt size={16} color="#d97706" />
            : <MdCalendarToday size={16} color="#3730a3" />}
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: isFilter ? "#92400e" : "#1e1b6e" }}>
            {isFilter ? `Viewing data for ${dateLabel}` : `Today — ${new Date().toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}`}
          </span>
          {isFilter && (
            <p style={{ fontSize: 11, color: "#a16207", margin: "2px 0 0" }}>
              Assignments shown are due on this date · Attendance reflects this day's records
            </p>
          )}
        </div>
        {isFilter && (
          <span style={{ fontSize: 11, fontWeight: 700, padding:"3px 10px", background:"#fbbf24", color:"#78350f", borderRadius:99 }}>
            Filtered
          </span>
        )}
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:14, flexShrink:0 }}>
        {statCards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} onClick={() => onTabChange(c.tab)} style={{
              background:"#fff", borderRadius:14, padding:"16px 18px",
              boxShadow:"0 2px 12px rgba(55,48,163,0.07)", border:"1px solid #e0e7ff",
              display:"flex", flexDirection:"column", gap:10,
              cursor:"pointer", transition:"transform 0.18s,box-shadow 0.18s",
              position:"relative", overflow:"hidden",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(55,48,163,0.13)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 2px 12px rgba(55,48,163,0.07)"; }}
            >
              <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:c.color, borderRadius:"14px 14px 0 0" }} />
              <div style={{ width:38, height:38, borderRadius:10, background:c.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon size={20} color={c.color} />
              </div>
              <div>
                <div style={{ fontSize:28, fontWeight:800, color:c.color, fontFamily:"'Poppins',sans-serif", lineHeight:1 }}>{c.value}</div>
                <div style={{ fontSize:11, fontWeight:600, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.5px", marginTop:4 }}>{c.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Two-column: Submissions + Attendance ── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, flexShrink:0 }}>

        {/* Submission rate */}
        <div style={{ background:"#fff", borderRadius:14, padding:"18px 22px", boxShadow:"0 2px 12px rgba(55,48,163,0.07)", border:"1px solid #e0e7ff" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <div>
              <span style={{ fontSize:13, fontWeight:700, color:"#1e1b6e", fontFamily:"'Poppins',sans-serif", display:"block", marginBottom:2 }}>Submission Rate</span>
              <span style={{ fontSize:11, color:"#9ca3af", fontWeight:500 }}>{stats.total} total submissions</span>
            </div>
            <span style={{ fontSize:28, fontWeight:800, color:"#3730a3", fontFamily:"'Poppins',sans-serif" }}>{submissionRate}%</span>
          </div>
          <div style={{ height:8, background:"#f3f4f6", borderRadius:99, overflow:"hidden", display:"flex" }}>
            <div style={{ height:"100%", width:`${submissionRate}%`, background:"linear-gradient(90deg,#059669,#34d399)", transition:"width 0.7s" }} />
            <div style={{ height:"100%", width:`${pendingRate}%`,    background:"linear-gradient(90deg,#f59e0b,#fbbf24)", transition:"width 0.7s" }} />
            <div style={{ height:"100%", width:`${lateRate}%`,       background:"linear-gradient(90deg,#dc2626,#f87171)", transition:"width 0.7s" }} />
          </div>
          <div style={{ display:"flex", gap:14, marginTop:10, flexWrap:"wrap" }}>
            {[{ color:"#059669", label:`${stats.submitted} Submitted` }, { color:"#d97706", label:`${stats.pending} Pending` }, { color:"#dc2626", label:`${stats.late} Late` }].map((l) => (
              <span key={l.label} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:"#6b7280", fontWeight:600 }}>
                <span style={{ width:8, height:8, borderRadius:2, background:l.color, display:"inline-block" }} />
                {l.label}
              </span>
            ))}
          </div>
        </div>

        {/* Attendance for selected date */}
        <div style={{ background:"#fff", borderRadius:14, padding:"18px 22px", boxShadow:"0 2px 12px rgba(55,48,163,0.07)", border:"1px solid #e0e7ff" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <div>
              <span style={{ fontSize:13, fontWeight:700, color:"#1e1b6e", fontFamily:"'Poppins',sans-serif", display:"block", marginBottom:2 }}>
                Attendance
              </span>
              <span style={{ fontSize:11, color:"#9ca3af", fontWeight:500 }}>
                {selectedDate
                  ? new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", { day:"numeric", month:"short" })
                  : "Today"}
              </span>
            </div>
            <span style={{ fontSize:28, fontWeight:800, color: attendancePct >= 75 ? "#059669" : attendancePct >= 50 ? "#d97706" : "#dc2626", fontFamily:"'Poppins',sans-serif" }}>
              {attendanceTaken ? `${attendancePct}%` : "—"}
            </span>
          </div>

          {attendanceTaken ? (
            <>
              <div style={{ height:8, background:"#f3f4f6", borderRadius:99, overflow:"hidden" }}>
                <div style={{
                  height:"100%", width:`${attendancePct}%`,
                  background: attendancePct>=75 ? "linear-gradient(90deg,#059669,#34d399)" : attendancePct>=50 ? "linear-gradient(90deg,#d97706,#fbbf24)" : "linear-gradient(90deg,#dc2626,#f87171)",
                  transition:"width 0.7s",
                }} />
              </div>
              <div style={{ display:"flex", gap:14, marginTop:10 }}>
                <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:"#059669", fontWeight:700 }}>
                  <MdCheckCircle size={12} /> {presentCount} Present
                </span>
                <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:"#dc2626", fontWeight:700 }}>
                  <MdWarning size={12} /> {absentCount} Absent
                </span>
              </div>
            </>
          ) : (
            <div style={{ textAlign:"center", padding:"12px 0" }}>
              <p style={{ fontSize:12, color:"#9ca3af", margin:0 }}>No attendance recorded for this date.</p>
              <button onClick={() => onTabChange("attendance")} style={{
                marginTop:8, fontSize:11, fontWeight:700, color:"#6366f1",
                background:"none", border:"1px solid #c7d2fe", borderRadius:8,
                padding:"5px 12px", cursor:"pointer",
              }}>Mark Attendance</button>
            </div>
          )}
        </div>
      </div>

      {/* ── Assignments due on selected date (when filtering) ── */}
      {isFilter && dueOnDate.length > 0 && (
        <div style={{ background:"#fff", border:"1px solid #fde68a", borderRadius:14, overflow:"hidden", boxShadow:"0 2px 12px rgba(55,48,163,0.06)", flexShrink:0 }}>
          <div style={{ padding:"12px 18px", background:"#fffbeb", borderBottom:"1px solid #fde68a", display:"flex", alignItems:"center", gap:8 }}>
            <MdAssignment size={16} color="#d97706" />
            <span style={{ fontSize:13, fontWeight:700, color:"#92400e", fontFamily:"'Poppins',sans-serif" }}>
              {dueOnDate.length} Assignment{dueOnDate.length !== 1 ? "s" : ""} Due on {dateLabel}
            </span>
          </div>
          <div style={{ padding:"12px 18px", display:"flex", flexDirection:"column", gap:8 }}>
            {dueOnDate.map((a) => {
              const subs = Object.values(a.submissions || {});
              const submitted = subs.filter((s) => s.status === "Submitted").length;
              const pct = subs.length > 0 ? Math.round((submitted / subs.length) * 100) : 0;
              return (
                <div key={a.id} onClick={() => onTabChange("assignments")} style={{
                  display:"flex", alignItems:"center", gap:12,
                  padding:"10px 14px", background:"#fffbeb",
                  border:"1px solid #fde68a", borderRadius:10, cursor:"pointer",
                  transition:"box-shadow 0.15s",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow="0 4px 12px rgba(217,119,6,0.15)"}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow="none"}
                >
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:13, fontWeight:700, color:"#1e1b6e", margin:"0 0 3px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{a.title}</p>
                    <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:99, background:"#e0e7ff", color:"#3730a3" }}>{a.subject}</span>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontSize:14, fontWeight:800, color: pct===100?"#059669":pct>60?"#6366f1":"#d97706" }}>{pct}%</div>
                    <div style={{ fontSize:10, color:"#9ca3af" }}>{submitted}/{subs.length}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Quick Access ── */}
      <div style={{ flexShrink:0 }}>
        <p style={{ fontSize:11, fontWeight:800, color:"#9ca3af", fontFamily:"'Poppins',sans-serif", textTransform:"uppercase", letterSpacing:"1px", margin:"0 0 12px" }}>
          Quick Access
        </p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
          {quickLinks.map((q) => {
            const Icon = q.Icon;
            return (
              <button key={q.tab} onClick={() => onTabChange(q.tab)} style={{
                background:q.gradient, border:"1px solid rgba(0,0,0,0.05)", borderRadius:14,
                padding:"20px 18px", textAlign:"left", cursor:"pointer",
                transition:"transform 0.18s,box-shadow 0.18s",
                boxShadow:"0 2px 8px rgba(55,48,163,0.06)",
                display:"flex", flexDirection:"column", gap:12, position:"relative", overflow:"hidden",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(55,48,163,0.16)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 2px 8px rgba(55,48,163,0.06)"; }}
              >
                <div style={{ width:40, height:40, borderRadius:10, background:"rgba(255,255,255,0.7)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.08)" }}>
                  <Icon size={22} color={q.accent} />
                </div>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:q.accent, fontFamily:"'Poppins',sans-serif", marginBottom:3 }}>{q.title}</div>
                  <div style={{ fontSize:11, color:"#6b7280", lineHeight:1.4 }}>{q.desc}</div>
                </div>
                <MdArrowForward size={16} color={q.accent} style={{ position:"absolute", bottom:14, right:14, opacity:0.5 }} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
