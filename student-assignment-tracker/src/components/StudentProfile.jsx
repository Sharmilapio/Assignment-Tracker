import { useState } from "react";
import {
  MdArrowBack, MdAttachFile, MdDownload,
  MdCheckCircle, MdPending, MdWarning,
  MdCalendarToday, MdBook, MdFilterList,
} from "react-icons/md";

const AVATAR_GRADIENTS = [
  ["#1e1b6e","#6366f1"], ["#065f46","#10b981"], ["#92400e","#f59e0b"],
  ["#7c1d6f","#ec4899"], ["#1e3a5f","#3b82f6"], ["#3b0764","#8b5cf6"],
  ["#7f1d1d","#f87171"], ["#0c4a6e","#38bdf8"],
];

const SC = {
  Submitted: { color:"#059669", bg:"#d1fae5", border:"#a7f3d0", Icon:MdCheckCircle },
  Pending:   { color:"#d97706", bg:"#fef3c7", border:"#fde68a", Icon:MdPending },
  Late:      { color:"#dc2626", bg:"#fee2e2", border:"#fecaca", Icon:MdWarning },
};

function StudentProfile({ student, assignments, students, onBack, onUpdate }) {
  const [statusFilter, setStatusFilter] = useState("All");
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2200); };

  const handleFileChange = (assignmentId, file) => {
    if (!file) return;
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) { showToast("⚠️ Only PDF files are supported."); return; }
    const reader = new FileReader();
    reader.onload = () => {
      onUpdate(assignmentId, student.id, { file: reader.result, fileName: file.name, status: "Submitted" });
      showToast("✅ File attached and marked Submitted.");
    };
    reader.readAsDataURL(file);
  };

  /* Stats */
  let submitted = 0, pending = 0, late = 0;
  assignments.forEach((a) => {
    const sub = a.submissions?.[student.id];
    if (sub?.status === "Submitted") submitted++;
    else if (sub?.status === "Late") late++;
    else pending++;
  });
  const pct = assignments.length > 0 ? Math.round((submitted / assignments.length) * 100) : 0;

  /* Student index for avatar gradient */
  const gradIdx = students ? students.findIndex((s) => s.id === student.id) : 0;
  const [c1, c2] = AVATAR_GRADIENTS[Math.max(0, gradIdx) % AVATAR_GRADIENTS.length];

  /* Filtered assignments */
  const visibleAssignments = statusFilter === "All"
    ? assignments
    : assignments.filter((a) => {
        const sub = a.submissions?.[student.id] || { status: "Pending" };
        return sub.status === statusFilter;
      });

  const barColor = pct === 100 ? "#059669" : pct > 60 ? "#6366f1" : pct > 30 ? "#d97706" : "#ef4444";

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)",
          background:"#1e1b6e", color:"#fff", padding:"11px 22px",
          borderRadius:10, fontSize:13, fontWeight:600, zIndex:9999,
          boxShadow:"0 8px 24px rgba(0,0,0,0.2)",
        }}>
          {toast}
        </div>
      )}

      {/* Back */}
      <button onClick={onBack} className="back-btn">← Back to students</button>

      {/* Profile hero */}
      <div style={{
        background:`linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`,
        borderRadius:16, padding:"24px",
        boxShadow:`0 8px 28px ${c1}44`,
        position:"relative", overflow:"hidden",
      }}>
        <div style={{
          position:"absolute", top:-30, right:-30,
          width:120, height:120, borderRadius:"50%",
          background:"rgba(255,255,255,0.08)", pointerEvents:"none",
        }} />
        <div style={{ display:"flex", alignItems:"center", gap:18, flexWrap:"wrap" }}>
          {/* Avatar */}
          <div style={{
            width:72, height:72, borderRadius:18,
            background:"rgba(255,255,255,0.2)",
            border:"2px solid rgba(255,255,255,0.35)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:28, fontWeight:900, color:"#fff",
            fontFamily:"'Poppins',sans-serif", flexShrink:0,
            boxShadow:"0 4px 16px rgba(0,0,0,0.2)",
          }}>
            {student.name.charAt(0).toUpperCase()}
          </div>

          <div style={{ flex:1, minWidth:160 }}>
            <h2 style={{ fontFamily:"'Poppins',sans-serif", fontSize:22, fontWeight:800, color:"#fff", margin:"0 0 10px" }}>
              {student.name}
            </h2>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {[
                { label:`${submitted} Submitted`, sc: SC.Submitted },
                { label:`${pending} Pending`,     sc: SC.Pending },
                ...(late > 0 ? [{ label:`${late} Late`, sc: SC.Late }] : []),
              ].map(({ label, sc }) => (
                <span key={label} style={{
                  display:"inline-flex", alignItems:"center", gap:5,
                  padding:"5px 12px",
                  background:"rgba(255,255,255,0.18)",
                  border:"1px solid rgba(255,255,255,0.25)",
                  borderRadius:99, fontSize:12, fontWeight:700, color:"#fff",
                }}>
                  <sc.Icon size={13} /> {label}
                </span>
              ))}
            </div>
          </div>

          {/* Completion stat */}
          <div style={{
            display:"flex", flexDirection:"column", alignItems:"center",
            padding:"14px 20px",
            background:"rgba(255,255,255,0.18)",
            border:"1px solid rgba(255,255,255,0.25)",
            borderRadius:14, minWidth:100,
          }}>
            <span style={{ fontSize:34, fontWeight:900, color:"#fff", fontFamily:"'Poppins',sans-serif", lineHeight:1 }}>
              {pct}%
            </span>
            <span style={{ fontSize:10, color:"rgba(255,255,255,0.75)", fontWeight:700, marginTop:4, textTransform:"uppercase", letterSpacing:"0.5px" }}>
              Completion
            </span>
            <div style={{ width:"100%", height:4, background:"rgba(255,255,255,0.2)", borderRadius:99, marginTop:8, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${pct}%`, background:"#fff", borderRadius:99, transition:"width 0.5s ease" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Assignments section */}
      {assignments.length === 0 ? (
        <div style={{
          background:"#fff", border:"1px solid #e0e7ff", borderRadius:16,
          padding:"48px 24px", textAlign:"center", color:"#9ca3af", fontSize:13,
        }}>
          No assignments created yet.
        </div>
      ) : (
        <div style={{ background:"#fff", border:"1px solid #e0e7ff", borderRadius:16, overflow:"hidden", boxShadow:"0 2px 12px rgba(55,48,163,0.06)" }}>

          {/* Table header + filter */}
          <div style={{
            padding:"14px 20px", background:"#f9f8ff",
            borderBottom:"1px solid #e0e7ff",
            display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10,
          }}>
            <h4 style={{ fontFamily:"'Poppins',sans-serif", fontSize:14, fontWeight:700, color:"#1e1b6e", margin:0 }}>
              Assignment Submissions
              <span style={{ marginLeft:8, fontSize:11, color:"#9ca3af", fontWeight:500 }}>
                ({visibleAssignments.length} of {assignments.length})
              </span>
            </h4>

            <div style={{ display:"flex", gap:6 }}>
              {["All","Submitted","Pending","Late"].map((f) => {
                const cfg = f === "All" ? { color:"#3730a3", bg:"#e0e7ff" } : SC[f];
                return (
                  <button key={f} onClick={() => setStatusFilter(f)} style={{
                    padding:"4px 12px", borderRadius:99, border:"none",
                    background: statusFilter===f ? cfg.color : "#f3f4f6",
                    color: statusFilter===f ? "#fff" : "#6b7280",
                    fontWeight: statusFilter===f ? 700 : 500,
                    fontSize:11, cursor:"pointer", transition:"all 0.15s",
                  }}>{f}</button>
                );
              })}
            </div>
          </div>

          {visibleAssignments.length === 0 ? (
            <div style={{ padding:"32px", textAlign:"center", color:"#9ca3af", fontSize:13 }}>
              No {statusFilter.toLowerCase()} assignments.
            </div>
          ) : (
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                <thead>
                  <tr style={{ background:"#f9f8ff", borderBottom:"2px solid #e0e7ff" }}>
                    {["#","Assignment","Subject","Due Date","Status","File"].map((h) => (
                      <th key={h} style={{
                        padding:"11px 16px", textAlign:"left", fontWeight:700, color:"#1e1b6e",
                        fontFamily:"'Poppins',sans-serif", fontSize:10,
                        textTransform:"uppercase", letterSpacing:"0.5px",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleAssignments.map((a, idx) => {
                    const sub = a.submissions?.[student.id] || { status:"Pending", file:null, fileName:null };
                    const isOverdue = new Date(a.dueDate) < new Date().setHours(0,0,0,0);
                    const cfg = SC[sub.status] || SC.Pending;
                    const StatusIcon = cfg.Icon;

                    return (
                      <tr key={a.id}
                        style={{ borderBottom:"1px solid #f3f4f6", transition:"background 0.15s" }}
                        onMouseEnter={(e) => e.currentTarget.style.background="#fafaff"}
                        onMouseLeave={(e) => e.currentTarget.style.background="transparent"}
                      >
                        <td style={{ padding:"12px 16px", color:"#9ca3af", fontWeight:600 }}>{idx+1}</td>
                        <td style={{ padding:"12px 16px", fontWeight:600, color:"#1e1b3a", maxWidth:200 }}>
                          {a.title}
                          {a.description && (
                            <p style={{ fontSize:11, color:"#9ca3af", margin:"2px 0 0", fontWeight:400 }}>{a.description}</p>
                          )}
                        </td>
                        <td style={{ padding:"12px 16px" }}>
                          <span style={{ padding:"3px 10px", borderRadius:99, background:"#e0e7ff", color:"#3730a3", fontSize:11, fontWeight:700 }}>
                            {a.subject}
                          </span>
                        </td>
                        <td style={{ padding:"12px 16px" }}>
                          <span style={{
                            display:"inline-flex", alignItems:"center", gap:4,
                            padding:"3px 10px", borderRadius:99, fontSize:11, fontWeight:700,
                            background: isOverdue ? "#fee2e2" : "#d1fae5",
                            color: isOverdue ? "#dc2626" : "#059669",
                          }}>
                            <MdCalendarToday size={10} /> {a.dueDate}
                          </span>
                        </td>
                        <td style={{ padding:"12px 16px" }}>
                          <select
                            value={sub.status}
                            onChange={(e) => onUpdate(a.id, student.id, { status: e.target.value })}
                            style={{
                              padding:"6px 28px 6px 10px",
                              border:`1.5px solid ${cfg.border}`,
                              borderRadius:8, fontSize:12, fontWeight:700,
                              color:cfg.color, background:cfg.bg,
                              outline:"none", cursor:"pointer",
                              fontFamily:"'Inter',sans-serif",
                              appearance:"none", WebkitAppearance:"none",
                              backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(cfg.color)}' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                              backgroundRepeat:"no-repeat",
                              backgroundPosition:"right 7px center",
                              minWidth:118, transition:"all 0.15s",
                            }}
                          >
                            <option value="Submitted">✓ Submitted</option>
                            <option value="Pending">⏳ Pending</option>
                            <option value="Late">⚠ Late</option>
                          </select>
                        </td>
                        <td style={{ padding:"12px 16px" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                            <label style={{
                              display:"inline-flex", alignItems:"center", gap:4,
                              cursor:"pointer", fontSize:11, fontWeight:700,
                              color:"#6366f1", padding:"5px 10px",
                              border:"1px solid #c7d2fe", borderRadius:7,
                              background:"#f5f3ff", transition:"all 0.15s",
                            }}
                              onMouseEnter={(e) => { e.currentTarget.style.background="#e0e7ff"; e.currentTarget.style.borderColor="#a5b4fc"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background="#f5f3ff"; e.currentTarget.style.borderColor="#c7d2fe"; }}
                            >
                              <MdAttachFile size={13} />
                              {sub.fileName ? "Replace" : "Attach"}
                              <input type="file" accept=".pdf,application/pdf" hidden onChange={(e) => handleFileChange(a.id, e.target.files[0])} />
                            </label>
                            {sub.fileName && (
                              <a href={sub.file} download={sub.fileName} style={{
                                display:"inline-flex", alignItems:"center", gap:4,
                                fontSize:11, color:"#059669", fontWeight:700,
                                textDecoration:"none", padding:"5px 9px",
                                background:"#f0fdf4", borderRadius:7, border:"1px solid #bbf7d0",
                              }}>
                                <MdDownload size={13} />
                                {sub.fileName.length > 14 ? sub.fileName.slice(0,14)+"…" : sub.fileName}
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default StudentProfile;
