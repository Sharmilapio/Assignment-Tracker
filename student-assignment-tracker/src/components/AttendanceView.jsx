import { useState, useEffect, useCallback } from "react";
import {
  MdCheckCircle, MdCancel, MdClearAll, MdDoneAll,
  MdCalendarToday, MdChevronLeft, MdChevronRight, MdCameraAlt,
} from "react-icons/md";
import { fetchAttendanceByDate, saveAttendanceForDate, fetchAttendanceDates, todayISO } from "../api";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function buildCalendar(year, month) {
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

function pad(n) { return String(n).padStart(2, "0"); }

function AttendanceView({ students, selectedDate, onDateChange }) {
  const today = todayISO();
  const viewDate = selectedDate || today;

  const [y, m] = viewDate.split("-").map(Number);
  const [calYear,  setCalYear]  = useState(y);
  const [calMonth, setCalMonth] = useState(m - 1); // 0-indexed

  const [record,   setRecord]   = useState({});     // { [studentId]: boolean }
  const [savedDates, setSavedDates] = useState([]);
  const [photos,   setPhotos]   = useState({});
  const [saving,   setSaving]   = useState(false);
  const [toast,    setToast]    = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2200); };

  /* load attendance for current viewDate */
  useEffect(() => {
    fetchAttendanceByDate(viewDate).then(setRecord);
  }, [viewDate]);

  /* load all dates that have records (for calendar dots) */
  useEffect(() => {
    fetchAttendanceDates().then(setSavedDates);
  }, []);

  /* sync calendar nav to viewDate */
  useEffect(() => {
    const [yr, mo] = viewDate.split("-").map(Number);
    setCalYear(yr);
    setCalMonth(mo - 1);
  }, [viewDate]);

  const toggle = useCallback((sid) => {
    setRecord((prev) => ({ ...prev, [sid]: !prev[sid] }));
  }, []);

  const save = async () => {
    setSaving(true);
    await saveAttendanceForDate(viewDate, record);
    const updated = await fetchAttendanceDates();
    setSavedDates(updated);
    setSaving(false);
    showToast(`✅ Attendance saved for ${fmtShort(viewDate)}`);
  };

  const markAll = async (val) => {
    const next = {};
    students.forEach((s) => { next[s.id] = val; });
    setRecord(next);
    await saveAttendanceForDate(viewDate, next);
    const updated = await fetchAttendanceDates();
    setSavedDates(updated);
    showToast(val ? "✅ All marked Present" : "✅ All marked Absent");
  };

  const handlePhoto = (sid, file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotos((p) => { if (p[sid]) URL.revokeObjectURL(p[sid]); return { ...p, [sid]: url }; });
  };

  const presentCount    = Object.values(record).filter(Boolean).length;
  const absentCount     = students.length - presentCount;
  const attendancePct   = students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0;
  const cells           = buildCalendar(calYear, calMonth);
  const hasSavedSet     = new Set(savedDates);

  const prevMonth = () => { if (calMonth === 0) { setCalYear(y => y-1); setCalMonth(11); } else setCalMonth(m => m-1); };
  const nextMonth = () => {
    const todayParts = today.split("-").map(Number);
    if (calYear > todayParts[0] || (calYear === todayParts[0] && calMonth >= todayParts[1]-1)) return;
    if (calMonth === 11) { setCalYear(y => y+1); setCalMonth(0); } else setCalMonth(m => m+1);
  };

  return (
    <div className="attendance-view">

      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", background:"#1e1b6e", color:"#fff", padding:"11px 22px", borderRadius:10, fontSize:13, fontWeight:600, zIndex:9999, boxShadow:"0 8px 24px rgba(0,0,0,0.2)" }}>
          {toast}
        </div>
      )}

      {/* ── Calendar + Stats row ── */}
      <div style={{ display:"grid", gridTemplateColumns:"300px 1fr", gap:16 }}>

        {/* Calendar */}
        <div style={{ background:"#fff", border:"1px solid #e0e7ff", borderRadius:16, padding:"18px", boxShadow:"0 2px 12px rgba(55,48,163,0.07)", alignSelf:"start" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
            <button onClick={prevMonth} style={{ background:"none", border:"none", cursor:"pointer", color:"#6b7280", display:"flex", padding:4, borderRadius:8 }}
              onMouseEnter={(e) => e.currentTarget.style.background="#f3f4f6"}
              onMouseLeave={(e) => e.currentTarget.style.background="none"}
            ><MdChevronLeft size={20} /></button>
            <span style={{ fontSize:14, fontWeight:700, color:"#1e1b6e", fontFamily:"'Poppins',sans-serif" }}>
              {MONTHS[calMonth]} {calYear}
            </span>
            <button onClick={nextMonth} style={{ background:"none", border:"none", cursor:"pointer", color:"#6b7280", display:"flex", padding:4, borderRadius:8 }}
              onMouseEnter={(e) => e.currentTarget.style.background="#f3f4f6"}
              onMouseLeave={(e) => e.currentTarget.style.background="none"}
            ><MdChevronRight size={20} /></button>
          </div>

          {/* Day headers */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, marginBottom:6 }}>
            {DAYS.map((d) => (
              <div key={d} style={{ textAlign:"center", fontSize:10, fontWeight:700, color:"#9ca3af", padding:"4px 0" }}>{d}</div>
            ))}
          </div>

          {/* Date cells */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2 }}>
            {cells.map((day, i) => {
              if (!day) return <div key={`e-${i}`} />;
              const iso     = `${calYear}-${pad(calMonth+1)}-${pad(day)}`;
              const isToday = iso === today;
              const isSel   = iso === viewDate;
              const hasDot  = hasSavedSet.has(iso);
              const isFuture = iso > today;

              return (
                <button
                  key={iso}
                  onClick={() => !isFuture && onDateChange(iso)}
                  disabled={isFuture}
                  style={{
                    position:"relative",
                    width:"100%", aspectRatio:"1",
                    border:"none", borderRadius:8, cursor: isFuture ? "default" : "pointer",
                    background: isSel ? "#3730a3" : isToday ? "#e0e7ff" : "transparent",
                    color: isSel ? "#fff" : isFuture ? "#d1d5db" : isToday ? "#3730a3" : "#374151",
                    fontWeight: isSel || isToday ? 700 : 400,
                    fontSize:12, transition:"all 0.15s",
                    outline:"none",
                    display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:1,
                  }}
                  onMouseEnter={(e) => { if (!isSel && !isFuture) e.currentTarget.style.background="#f5f3ff"; }}
                  onMouseLeave={(e) => { if (!isSel) e.currentTarget.style.background = isToday ? "#e0e7ff" : "transparent"; }}
                >
                  {day}
                  {hasDot && (
                    <span style={{ width:4, height:4, borderRadius:"50%", background: isSel ? "#a5b4fc" : "#6366f1", display:"block" }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ marginTop:12, display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center" }}>
            {[
              { color:"#e0e7ff", textColor:"#3730a3", label:"Today" },
              { color:"#3730a3", textColor:"#fff",    label:"Selected" },
              { color:"#6366f1", textColor:"#6366f1", dot:true, label:"Has record" },
            ].map((l) => (
              <span key={l.label} style={{ display:"flex", alignItems:"center", gap:5, fontSize:10, color:"#6b7280" }}>
                {l.dot
                  ? <span style={{ width:6, height:6, borderRadius:"50%", background:l.color }} />
                  : <span style={{ width:12, height:12, borderRadius:4, background:l.color, border:"1px solid #e0e7ff" }} />
                }
                {l.label}
              </span>
            ))}
          </div>
        </div>

        {/* Stats panel */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {/* Date heading */}
          <div style={{ background:"#fff", border:"1px solid #e0e7ff", borderRadius:16, padding:"18px 22px", boxShadow:"0 2px 12px rgba(55,48,163,0.07)" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12, marginBottom:14 }}>
              <div>
                <h2 style={{ fontFamily:"'Poppins',sans-serif", fontSize:18, fontWeight:800, color:"#1e1b6e", margin:"0 0 3px" }}>
                  {fmtFull(viewDate)}
                </h2>
                <p style={{ fontSize:11, color:"#9ca3af", margin:0 }}>
                  {viewDate === today ? "Today · " : ""}Click student cards to mark attendance
                </p>
              </div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {[
                  { label:"Present", value:presentCount, bg:"#d1fae5", color:"#059669", Icon:MdCheckCircle },
                  { label:"Absent",  value:absentCount,  bg:"#fee2e2", color:"#dc2626", Icon:MdCancel },
                  { label:"Total",   value:students.length, bg:"#e0e7ff", color:"#3730a3", Icon:null },
                ].map((s) => (
                  <div key={s.label} style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 14px", background:s.bg, borderRadius:10 }}>
                    {s.Icon && <s.Icon size={15} color={s.color} />}
                    <span style={{ fontSize:18, fontWeight:800, color:s.color, fontFamily:"'Poppins',sans-serif" }}>{s.value}</span>
                    <span style={{ fontSize:11, fontWeight:600, color:s.color }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress */}
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ fontSize:12, color:"#6b7280", fontWeight:600 }}>Attendance Rate</span>
              <span style={{ fontSize:13, color:"#3730a3", fontWeight:800 }}>{students.length > 0 ? `${attendancePct}%` : "—"}</span>
            </div>
            <div style={{ height:8, background:"#f3f4f6", borderRadius:99, overflow:"hidden" }}>
              <div style={{
                height:"100%", width:`${attendancePct}%`,
                background: attendancePct>=75 ? "linear-gradient(90deg,#059669,#34d399)" : attendancePct>=50 ? "linear-gradient(90deg,#d97706,#fbbf24)" : "linear-gradient(90deg,#dc2626,#f87171)",
                transition:"width 0.6s",
              }} />
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            <button onClick={() => markAll(true)} style={{
              flex:1, display:"inline-flex", alignItems:"center", justifyContent:"center", gap:7,
              padding:"10px", background:"linear-gradient(135deg,#059669,#10b981)",
              color:"#fff", border:"none", borderRadius:10,
              fontWeight:700, fontSize:12, cursor:"pointer", boxShadow:"0 4px 12px rgba(5,150,105,0.3)",
              transition:"opacity 0.15s",
            }}
              onMouseEnter={(e) => e.currentTarget.style.opacity="0.9"}
              onMouseLeave={(e) => e.currentTarget.style.opacity="1"}
            ><MdDoneAll size={16} /> Mark All Present</button>

            <button onClick={() => markAll(false)} style={{
              flex:1, display:"inline-flex", alignItems:"center", justifyContent:"center", gap:7,
              padding:"10px", background:"#fff",
              color:"#dc2626", border:"1.5px solid #fecaca", borderRadius:10,
              fontWeight:700, fontSize:12, cursor:"pointer", transition:"all 0.15s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background="#fef2f2"; e.currentTarget.style.borderColor="#f87171"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background="#fff"; e.currentTarget.style.borderColor="#fecaca"; }}
            ><MdClearAll size={16} /> Mark All Absent</button>

            <button onClick={save} disabled={saving} style={{
              flex:1, display:"inline-flex", alignItems:"center", justifyContent:"center", gap:7,
              padding:"10px",
              background: saving ? "#a5b4fc" : "linear-gradient(135deg,#3730a3,#6366f1)",
              color:"#fff", border:"none", borderRadius:10,
              fontWeight:700, fontSize:12, cursor: saving ? "not-allowed" : "pointer",
              boxShadow:"0 4px 12px rgba(99,102,241,0.3)", transition:"opacity 0.15s",
            }}>
              {saving
                ? <><span style={{ display:"inline-block", width:13, height:13, border:"2px solid rgba(255,255,255,0.4)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} /> Saving…</>
                : "💾 Save Attendance"
              }
            </button>
          </div>
        </div>
      </div>

      {/* ── Student grid ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(148px,1fr))", gap:12 }}>
        {[...students].sort((a, b) => a.name.localeCompare(b.name)).map((student) => {
          const isPresent = !!record[student.id];
          const initials  = student.name.split(" ").map((w) => w[0]).slice(0,2).join("").toUpperCase();

          return (
            <div key={student.id} onClick={() => toggle(student.id)} style={{
              display:"flex", flexDirection:"column", alignItems:"center",
              padding:"16px 10px 12px", borderRadius:14, cursor:"pointer",
              background: isPresent ? "#f0fdf4" : "#fff",
              border:`2px solid ${isPresent ? "#4ade80" : "#e5e7eb"}`,
              boxShadow: isPresent ? "0 4px 14px rgba(74,222,128,0.18)" : "0 2px 8px rgba(0,0,0,0.05)",
              transition:"all 0.2s", position:"relative", gap:9,
            }}
              onMouseEnter={(e) => {
                if (!isPresent) { e.currentTarget.style.borderColor="#c7d2fe"; e.currentTarget.style.boxShadow="0 4px 14px rgba(55,48,163,0.1)"; }
                else e.currentTarget.style.boxShadow="0 6px 18px rgba(74,222,128,0.28)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = isPresent ? "#4ade80" : "#e5e7eb";
                e.currentTarget.style.boxShadow   = isPresent ? "0 4px 14px rgba(74,222,128,0.18)" : "0 2px 8px rgba(0,0,0,0.05)";
              }}
            >
              {/* Status dot */}
              <div style={{ position:"absolute", top:8, right:8, width:18, height:18, borderRadius:"50%", background: isPresent ? "#4ade80" : "#f87171", display:"flex", alignItems:"center", justifyContent:"center" }}>
                {isPresent ? <MdCheckCircle size={12} color="#fff" /> : <MdCancel size={12} color="#fff" />}
              </div>

              {/* Avatar */}
              <label style={{ cursor:"pointer", position:"relative" }} onClick={(e) => e.stopPropagation()}>
                {photos[student.id]
                  ? <img src={photos[student.id]} alt={student.name} style={{ width:64, height:64, borderRadius:"50%", objectFit:"cover", border:`3px solid ${isPresent ? "#4ade80" : "#e5e7eb"}` }} />
                  : (
                    <div style={{
                      width:64, height:64, borderRadius:"50%",
                      background: isPresent ? "linear-gradient(135deg,#4ade80,#059669)" : "linear-gradient(135deg,#c7d2fe,#a5b4fc)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:20, fontWeight:800, color:"#fff",
                      border:`3px solid ${isPresent ? "#4ade80" : "#c7d2fe"}`,
                    }}>{initials}</div>
                  )
                }
                <div style={{ position:"absolute", bottom:0, right:0, width:20, height:20, borderRadius:"50%", background:"#fff", border:"2px solid #e0e7ff", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <MdCameraAlt size={10} color="#6366f1" />
                </div>
                <input type="file" accept="image/*" hidden onChange={(e) => handlePhoto(student.id, e.target.files[0])} />
              </label>

              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:11, fontWeight:700, color:"#1e1b6e", fontFamily:"'Poppins',sans-serif", lineHeight:1.3 }}>{student.name}</div>
                <div style={{ fontSize:10, fontWeight:700, marginTop:3, color: isPresent ? "#059669" : "#ef4444" }}>
                  {isPresent ? "Present" : "Absent"}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function fmtFull(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m-1, d).toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long", year:"numeric" });
}

function fmtShort(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m-1, d).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });
}

export default AttendanceView;
