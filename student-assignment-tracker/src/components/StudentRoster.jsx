import { useState } from "react";
import {
  MdPeople, MdAdd, MdDelete, MdSearch, MdSort,
  MdCheckCircle, MdWarning, MdPending, MdClose,
  MdGridView, MdViewList, MdFilterList,
} from "react-icons/md";

/* Avatar gradient pool — cycles through for variety */
const AVATAR_GRADIENTS = [
  ["#1e1b6e","#6366f1"], ["#065f46","#10b981"], ["#92400e","#f59e0b"],
  ["#7c1d6f","#ec4899"], ["#1e3a5f","#3b82f6"], ["#3b0764","#8b5cf6"],
  ["#7f1d1d","#f87171"], ["#0c4a6e","#38bdf8"],
];
const grad = (i) => AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length];

function StudentRoster({ students, assignments, onOpen, onAddStudent, onDeleteStudent }) {
  const total = assignments.length;
  const [newName, setNewName]       = useState("");
  const [adding, setAdding]         = useState(false);
  const [addError, setAddError]     = useState("");
  const [search, setSearch]         = useState("");
  const [sortBy, setSortBy]         = useState("name");   // name | pct | late
  const [filterStatus, setFilterStatus] = useState("all"); // all | perfect | struggling | none
  const [deleteId, setDeleteId]     = useState(null);
  const [view, setView]             = useState("grid");    // grid | list

  const handleAdd = () => {
    const trimmed = newName.trim();
    if (!trimmed) { setAddError("Please enter a name."); return; }
    if (students.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setAddError("A student with this name already exists.");
      return;
    }
    onAddStudent(trimmed);
    setNewName(""); setAdding(false); setAddError("");
  };

  /* Build enriched student list */
  const enriched = students.map((s, i) => {
    let submitted = 0, late = 0, pending = 0;
    assignments.forEach((a) => {
      const sub = a.submissions?.[s.id];
      if (sub?.status === "Submitted") submitted++;
      else if (sub?.status === "Late") late++;
      else pending++;
    });
    const pct = total > 0 ? Math.round((submitted / total) * 100) : 0;
    return { ...s, submitted, late, pending, pct, gradIdx: i };
  });

  /* Filter */
  let list = enriched.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );
  if (filterStatus === "perfect")    list = list.filter((s) => s.pct === 100);
  if (filterStatus === "struggling") list = list.filter((s) => s.pct < 50 && total > 0);
  if (filterStatus === "none")       list = list.filter((s) => s.submitted === 0 && total > 0);

  /* Sort */
  if (sortBy === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
  if (sortBy === "pct")  list = [...list].sort((a, b) => b.pct - a.pct);
  if (sortBy === "late") list = [...list].sort((a, b) => b.late - a.late);

  /* Overall class stats */
  const avgPct = enriched.length > 0
    ? Math.round(enriched.reduce((s, e) => s + e.pct, 0) / enriched.length) : 0;
  const topStudents  = enriched.filter((s) => s.pct === 100).length;
  const lateStudents = enriched.filter((s) => s.late > 0).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* ── Header card ── */}
      <div style={{
        background: "linear-gradient(135deg, #1e1b6e 0%, #3730a3 55%, #6366f1 100%)",
        borderRadius: 16, padding: "20px 24px",
        boxShadow: "0 4px 20px rgba(30,27,110,0.2)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position:"absolute", top:-40, right:-40, width:160, height:160,
          borderRadius:"50%", background:"rgba(255,255,255,0.05)", pointerEvents:"none",
        }} />
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{
              width:44, height:44, borderRadius:12,
              background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.2)",
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              <MdPeople size={24} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, color:"#fff", fontSize:18, margin:"0 0 2px" }}>
                Class Roster
              </h2>
              <p style={{ fontSize:12, color:"rgba(255,255,255,0.7)", margin:0 }}>
                {students.length} students · {total} assignments
              </p>
            </div>
          </div>
          <button
            onClick={() => { setAdding((v) => !v); setAddError(""); }}
            style={{
              display:"inline-flex", alignItems:"center", gap:6,
              padding:"9px 18px",
              background: adding ? "rgba(255,255,255,0.15)" : "#fff",
              color: adding ? "#fff" : "#3730a3",
              border: adding ? "1px solid rgba(255,255,255,0.3)" : "none",
              borderRadius:10, fontWeight:700, fontSize:13, cursor:"pointer",
              fontFamily:"'Poppins',sans-serif",
              boxShadow: adding ? "none" : "0 4px 12px rgba(0,0,0,0.15)",
              transition:"all 0.15s",
            }}
          >
            {adding ? <><MdClose size={16} /> Cancel</> : <><MdAdd size={16} /> Add Student</>}
          </button>
        </div>

        {/* Class summary chips */}
        <div style={{ display:"flex", gap:10, marginTop:16, flexWrap:"wrap" }}>
          {[
            { label:"Avg Completion", value:`${avgPct}%`, color:"#a5b4fc" },
            { label:"All Submitted",  value:`${topStudents}`,  color:"#6ee7b7" },
            { label:"Have Late",      value:`${lateStudents}`, color:"#fca5a5" },
          ].map((c) => (
            <div key={c.label} style={{
              padding:"6px 14px", borderRadius:99,
              background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.15)",
              display:"flex", gap:6, alignItems:"center",
            }}>
              <span style={{ fontSize:14, fontWeight:800, color:c.color }}>{c.value}</span>
              <span style={{ fontSize:11, color:"rgba(255,255,255,0.65)", fontWeight:500 }}>{c.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Add student form ── */}
      {adding && (
        <div style={{
          background:"#fff", border:"1px solid #e0e7ff", borderRadius:14,
          padding:"16px 18px", boxShadow:"0 4px 16px rgba(55,48,163,0.08)",
        }}>
          <p style={{ fontSize:12, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.6px", margin:"0 0 10px" }}>
            New Student
          </p>
          <div style={{ display:"flex", gap:10 }}>
            <input
              autoFocus
              placeholder="Enter full name…"
              value={newName}
              onChange={(e) => { setNewName(e.target.value); setAddError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              style={{
                flex:1, padding:"10px 14px",
                border:`2px solid ${addError ? "#f87171" : "#c7d2fe"}`, borderRadius:10,
                fontSize:13, fontFamily:"'Inter',sans-serif",
                color:"#1e1b6e", background:"#f9f8ff", outline:"none",
                transition:"border-color 0.2s",
              }}
              onFocus={(e) => e.target.style.borderColor = addError ? "#f87171" : "#6366f1"}
              onBlur={(e) => e.target.style.borderColor = addError ? "#f87171" : "#c7d2fe"}
            />
            <button onClick={handleAdd} style={{
              padding:"10px 20px",
              background:"linear-gradient(135deg,#3730a3,#6366f1)",
              color:"#fff", border:"none", borderRadius:10,
              fontWeight:700, fontSize:13, cursor:"pointer",
              boxShadow:"0 4px 12px rgba(99,102,241,0.3)",
            }}>Add</button>
          </div>
          {addError && (
            <p style={{ fontSize:11, color:"#dc2626", fontWeight:600, margin:"6px 0 0", display:"flex", gap:4, alignItems:"center" }}>
              ⚠ {addError}
            </p>
          )}
        </div>
      )}

      {/* ── Toolbar: search + filters + sort + view toggle ── */}
      <div style={{
        background:"#fff", border:"1px solid #e0e7ff", borderRadius:14,
        padding:"10px 14px", display:"flex", alignItems:"center", gap:10,
        flexWrap:"wrap", boxShadow:"0 2px 8px rgba(55,48,163,0.05)",
      }}>
        {/* Search */}
        <div style={{ position:"relative", flex:1, minWidth:160 }}>
          <MdSearch size={15} color="#9ca3af" style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }} />
          <input
            placeholder="Search students…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width:"100%", padding:"8px 10px 8px 30px",
              border:"1.5px solid #e0e7ff", borderRadius:8,
              fontSize:12, color:"#374151", background:"#f9f8ff",
              outline:"none", boxSizing:"border-box", fontFamily:"'Inter',sans-serif",
              transition:"border-color 0.18s",
            }}
            onFocus={(e) => { e.target.style.borderColor="#6366f1"; e.target.style.background="#fff"; }}
            onBlur={(e) => { e.target.style.borderColor="#e0e7ff"; e.target.style.background="#f9f8ff"; }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{
              position:"absolute", right:8, top:"50%", transform:"translateY(-50%)",
              background:"none", border:"none", cursor:"pointer", color:"#9ca3af", display:"flex", padding:0,
            }}><MdClose size={13} /></button>
          )}
        </div>

        {/* Status filter */}
        <div style={{ display:"flex", gap:5 }}>
          {[
            { key:"all",        label:"All" },
            { key:"perfect",    label:"✓ 100%" },
            { key:"struggling", label:"< 50%" },
            { key:"none",       label:"No sub" },
          ].map((f) => (
            <button key={f.key} onClick={() => setFilterStatus(f.key)} style={{
              padding:"5px 11px", borderRadius:99, border:"none",
              background: filterStatus===f.key ? "#3730a3" : "#f3f4f6",
              color: filterStatus===f.key ? "#fff" : "#6b7280",
              fontWeight: filterStatus===f.key ? 700 : 500,
              fontSize:11, cursor:"pointer", transition:"all 0.15s",
              fontFamily:"'Inter',sans-serif", whiteSpace:"nowrap",
            }}>{f.label}</button>
          ))}
        </div>

        {/* Sort */}
        <button onClick={() => setSortBy(sortBy==="name"?"pct":sortBy==="pct"?"late":"name")}
          style={{
            display:"inline-flex", alignItems:"center", gap:5,
            padding:"6px 11px", border:"1.5px solid #e0e7ff", borderRadius:8,
            background:"#f9f8ff", cursor:"pointer", fontSize:11, fontWeight:700,
            color:"#6b7280", transition:"all 0.15s", whiteSpace:"nowrap",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor="#a5b4fc"; e.currentTarget.style.color="#3730a3"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor="#e0e7ff"; e.currentTarget.style.color="#6b7280"; }}
        >
          <MdSort size={14} />
          {sortBy==="name"?"A→Z":sortBy==="pct"?"Top %":"Most late"}
        </button>

        {/* View toggle */}
        <div style={{ display:"flex", background:"#f3f4f6", borderRadius:8, padding:2, gap:2 }}>
          {[{ v:"grid", Icon:MdGridView }, { v:"list", Icon:MdViewList }].map(({ v, Icon }) => (
            <button key={v} onClick={() => setView(v)} style={{
              width:28, height:28, borderRadius:6, border:"none", cursor:"pointer",
              background: view===v ? "#fff" : "transparent",
              color: view===v ? "#3730a3" : "#9ca3af",
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow: view===v ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
              transition:"all 0.15s",
            }}><Icon size={15} /></button>
          ))}
        </div>

        <span style={{ fontSize:11, color:"#9ca3af", fontWeight:600, whiteSpace:"nowrap", marginLeft:"auto" }}>
          {list.length} of {students.length}
        </span>
      </div>

      {/* ── Empty state ── */}
      {list.length === 0 && (
        <div style={{
          background:"#fff", border:"2px dashed #c7d2fe", borderRadius:16,
          padding:"48px 24px", textAlign:"center",
          display:"flex", flexDirection:"column", alignItems:"center", gap:12,
        }}>
          <div style={{ width:56, height:56, borderRadius:14, background:"#f5f3ff", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <MdPeople size={26} color="#a5b4fc" />
          </div>
          <p style={{ fontSize:14, fontWeight:700, color:"#1e1b6e", margin:0 }}>
            {search || filterStatus !== "all" ? "No students match your filters" : "No students yet"}
          </p>
          <p style={{ fontSize:12, color:"#9ca3af", margin:0 }}>
            {search || filterStatus !== "all" ? "Try adjusting your search or filter." : "Click Add Student to get started."}
          </p>
        </div>
      )}

      {/* ── Grid view ── */}
      {view === "grid" && list.length > 0 && (
        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))",
          gap:14,
        }}>
          {list.map((student) => {
            const [c1, c2] = grad(student.gradIdx);
            const barColor = student.pct===100?"#059669":student.pct>60?"#6366f1":student.pct>30?"#d97706":"#ef4444";
            const isDeleting = deleteId === student.id;

            return (
              <div
                key={student.id}
                style={{
                  background:"#fff",
                  border:"1px solid #e0e7ff",
                  borderRadius:16,
                  overflow:"hidden",
                  boxShadow:"0 2px 12px rgba(55,48,163,0.07)",
                  transition:"transform 0.18s, box-shadow 0.18s",
                  cursor: isDeleting ? "default" : "pointer",
                  position:"relative",
                }}
                onMouseEnter={(e) => { if (!isDeleting) { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 8px 28px rgba(55,48,163,0.14)"; }}}
                onMouseLeave={(e) => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 2px 12px rgba(55,48,163,0.07)"; }}
              >
                {/* Top gradient band */}
                <div style={{ height:6, background:`linear-gradient(90deg, ${c1}, ${c2})` }} />

                {/* Delete confirm overlay */}
                {isDeleting && (
                  <div style={{
                    position:"absolute", inset:0, background:"rgba(255,245,245,0.97)",
                    zIndex:10, display:"flex", flexDirection:"column",
                    alignItems:"center", justifyContent:"center", gap:10, padding:16,
                  }}>
                    <p style={{ fontSize:12, fontWeight:700, color:"#dc2626", textAlign:"center", margin:0 }}>
                      Remove {student.name}?
                    </p>
                    <p style={{ fontSize:11, color:"#6b7280", textAlign:"center", margin:0 }}>
                      All submission records will be removed.
                    </p>
                    <div style={{ display:"flex", gap:8, width:"100%" }}>
                      <button onClick={(e) => { e.stopPropagation(); onDeleteStudent(student.id); setDeleteId(null); }}
                        style={{ flex:1, padding:"7px", background:"#dc2626", color:"#fff", border:"none", borderRadius:8, fontWeight:700, fontSize:12, cursor:"pointer" }}>
                        Remove
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setDeleteId(null); }}
                        style={{ flex:1, padding:"7px", background:"#f3f4f6", color:"#6b7280", border:"none", borderRadius:8, fontWeight:600, fontSize:12, cursor:"pointer" }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div style={{ padding:"16px 14px" }} onClick={() => !isDeleting && onOpen(student.id)}>
                  {/* Avatar + delete btn */}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                    <div style={{
                      width:52, height:52, borderRadius:14,
                      background:`linear-gradient(135deg, ${c1}, ${c2})`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:20, fontWeight:800, color:"#fff",
                      fontFamily:"'Poppins',sans-serif",
                      boxShadow:`0 4px 14px ${c1}55`,
                    }}>
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteId(student.id); }}
                      style={{
                        background:"none", border:"none", cursor:"pointer",
                        color:"#d1d5db", padding:"4px", borderRadius:7,
                        display:"flex", transition:"color 0.15s, background 0.15s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color="#dc2626"; e.currentTarget.style.background="#fee2e2"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color="#d1d5db"; e.currentTarget.style.background="none"; }}
                    >
                      <MdDelete size={16} />
                    </button>
                  </div>

                  {/* Name */}
                  <p style={{ fontSize:13, fontWeight:700, color:"#1e1b3a", margin:"0 0 4px", fontFamily:"'Poppins',sans-serif", lineHeight:1.3 }}>
                    {student.name}
                  </p>

                  {/* Completion % */}
                  {total > 0 && (
                    <p style={{ fontSize:11, color:barColor, fontWeight:800, margin:"0 0 8px" }}>
                      {student.pct}% complete
                    </p>
                  )}

                  {/* Progress bar */}
                  {total > 0 && (
                    <div style={{ height:5, background:"#f3f4f6", borderRadius:99, overflow:"hidden", marginBottom:10 }}>
                      <div style={{ height:"100%", width:`${student.pct}%`, background:barColor, borderRadius:99, transition:"width 0.5s ease" }} />
                    </div>
                  )}

                  {/* Status badges */}
                  <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                    {student.submitted > 0 && (
                      <span style={{ fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:99, background:"#d1fae5", color:"#059669", display:"flex", alignItems:"center", gap:3 }}>
                        <MdCheckCircle size={10} /> {student.submitted}
                      </span>
                    )}
                    {student.late > 0 && (
                      <span style={{ fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:99, background:"#fee2e2", color:"#dc2626", display:"flex", alignItems:"center", gap:3 }}>
                        <MdWarning size={10} /> {student.late} late
                      </span>
                    )}
                    {student.pending > 0 && (
                      <span style={{ fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:99, background:"#fef3c7", color:"#d97706", display:"flex", alignItems:"center", gap:3 }}>
                        <MdPending size={10} /> {student.pending}
                      </span>
                    )}
                    {total === 0 && (
                      <span style={{ fontSize:10, color:"#9ca3af", fontWeight:500 }}>No assignments yet</span>
                    )}
                  </div>
                </div>

                {/* Footer tap hint */}
                <div style={{
                  borderTop:"1px solid #f3f4f6", padding:"8px 14px",
                  display:"flex", justifyContent:"center",
                  background:"#fafaff",
                }}
                  onClick={() => !isDeleting && onOpen(student.id)}
                >
                  <span style={{ fontSize:11, color:"#6366f1", fontWeight:700 }}>View profile →</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── List view ── */}
      {view === "list" && list.length > 0 && (
        <div style={{
          background:"#fff", border:"1px solid #e0e7ff",
          borderRadius:16, overflow:"hidden",
          boxShadow:"0 4px 20px rgba(55,48,163,0.08)",
        }}>
          {list.map((student, idx) => {
            const [c1, c2] = grad(student.gradIdx);
            const barColor = student.pct===100?"#059669":student.pct>60?"#6366f1":student.pct>30?"#d97706":"#ef4444";
            const isDeleting = deleteId === student.id;

            return (
              <div
                key={student.id}
                style={{
                  display:"flex", alignItems:"center", gap:14,
                  padding:"13px 20px",
                  borderBottom: idx < list.length-1 ? "1px solid #f3f4f6" : "none",
                  transition:"background 0.15s", cursor: isDeleting ? "default" : "pointer",
                  background: isDeleting ? "#fef2f2" : "transparent",
                }}
                onMouseEnter={(e) => { if (!isDeleting) e.currentTarget.style.background="#fafaff"; }}
                onMouseLeave={(e) => { if (!isDeleting) e.currentTarget.style.background="transparent"; }}
              >
                {/* Avatar */}
                <div
                  onClick={() => !isDeleting && onOpen(student.id)}
                  style={{
                    width:40, height:40, borderRadius:"50%",
                    background:`linear-gradient(135deg, ${c1}, ${c2})`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:15, fontWeight:800, color:"#fff",
                    fontFamily:"'Poppins',sans-serif", flexShrink:0,
                    boxShadow:`0 3px 8px ${c1}55`,
                  }}>
                  {student.name.charAt(0).toUpperCase()}
                </div>

                {/* Name + bar */}
                <div style={{ flex:1, minWidth:0 }} onClick={() => !isDeleting && onOpen(student.id)}>
                  <p style={{ fontSize:13, fontWeight:700, color:"#1e1b3a", margin:"0 0 5px" }}>
                    {student.name}
                  </p>
                  {total > 0 && (
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ flex:1, height:5, background:"#f3f4f6", borderRadius:99, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${student.pct}%`, background:barColor, borderRadius:99, transition:"width 0.5s" }} />
                      </div>
                      <span style={{ fontSize:11, color:barColor, fontWeight:800, width:32, textAlign:"right" }}>{student.pct}%</span>
                    </div>
                  )}
                </div>

                {/* Badges */}
                {!isDeleting && (
                  <div style={{ display:"flex", gap:5, flexShrink:0 }}>
                    {student.submitted > 0 && <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:99, background:"#d1fae5", color:"#059669" }}>{student.submitted} ✓</span>}
                    {student.late > 0 && <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:99, background:"#fee2e2", color:"#dc2626" }}>{student.late} late</span>}
                  </div>
                )}

                {/* Delete / confirm */}
                {isDeleting ? (
                  <div style={{ display:"flex", gap:7, flexShrink:0 }}>
                    <button onClick={(e) => { e.stopPropagation(); onDeleteStudent(student.id); setDeleteId(null); }}
                      style={{ padding:"5px 12px", background:"#dc2626", color:"#fff", border:"none", borderRadius:7, fontWeight:700, fontSize:11, cursor:"pointer" }}>
                      Remove
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setDeleteId(null); }}
                      style={{ padding:"5px 12px", background:"#f3f4f6", color:"#6b7280", border:"none", borderRadius:7, fontWeight:600, fontSize:11, cursor:"pointer" }}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteId(student.id); }}
                    style={{
                      background:"none", border:"none", cursor:"pointer",
                      color:"#d1d5db", padding:"5px", borderRadius:7,
                      display:"flex", transition:"color 0.15s, background 0.15s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color="#dc2626"; e.currentTarget.style.background="#fef2f2"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color="#d1d5db"; e.currentTarget.style.background="none"; }}
                  >
                    <MdDelete size={16} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default StudentRoster;
