import { useState, useRef, useEffect } from "react";
import {
  MdAdd, MdAssignment, MdClose, MdCalendarToday,
  MdBook, MdCheckCircle, MdTitle, MdNotes,
} from "react-icons/md";

/* ── subject accent colours ── */
export const SUBJECT_COLORS = {
  "Python":           { bg: "#fef3c7", color: "#b45309", dot: "#f59e0b", ring: "#fde68a" },
  "Data Structure":   { bg: "#dbeafe", color: "#1d4ed8", dot: "#3b82f6", ring: "#bfdbfe" },
  "Data Warehousing": { bg: "#d1fae5", color: "#065f46", dot: "#10b981", ring: "#a7f3d0" },
  "Data Mining":      { bg: "#ede9fe", color: "#5b21b6", dot: "#8b5cf6", ring: "#c4b5fd" },
  "Deep Learning":    { bg: "#fce7f3", color: "#9d174d", dot: "#ec4899", ring: "#fbcfe8" },
};
export const getSubjectStyle = (s) =>
  SUBJECT_COLORS[s] || { bg: "#e0e7ff", color: "#3730a3", dot: "#6366f1", ring: "#c7d2fe" };

/* shared input base */
const base = (extra = {}) => ({
  width: "100%",
  padding: "10px 14px",
  border: "1.5px solid #e0e7ff",
  borderRadius: 10,
  fontSize: 13,
  fontFamily: "'Inter', sans-serif",
  color: "#1e1b3a",
  background: "#f9f8ff",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.18s, box-shadow 0.18s, background 0.18s",
  ...extra,
});

const onFocusStyle = { borderColor: "#6366f1", boxShadow: "0 0 0 3px rgba(99,102,241,0.14)", background: "#fff" };
const onBlurStyle  = { borderColor: "#e0e7ff", boxShadow: "none", background: "#f9f8ff" };
const errStyle     = { borderColor: "#f87171", boxShadow: "0 0 0 3px rgba(248,113,113,0.12)", background: "#fef2f2" };

function FieldLabel({ icon: Icon, text, optional }) {
  return (
    <label style={{
      display: "flex", alignItems: "center", gap: 5, marginBottom: 6,
      fontSize: 11, fontWeight: 700, color: "#6b7280",
      textTransform: "uppercase", letterSpacing: "0.7px",
      fontFamily: "'Inter', sans-serif",
    }}>
      {Icon && <Icon size={12} color="#6366f1" />}
      {text}
      {optional && (
        <span style={{ fontSize: 10, color: "#9ca3af", fontWeight: 400, textTransform: "none", letterSpacing: 0, marginLeft: 2 }}>
          (optional)
        </span>
      )}
    </label>
  );
}

function ErrorMsg({ msg }) {
  if (!msg) return null;
  return (
    <p style={{ margin: "5px 0 0", fontSize: 11, color: "#dc2626", fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>
      ⚠ {msg}
    </p>
  );
}

function AssignmentForm({ onAdd, subjects = [] }) {
  const [title, setTitle]           = useState("");
  const [selectedSubject, setSubject] = useState("");
  const [customSubject, setCustom]  = useState("");
  const [dueDate, setDueDate]       = useState("");
  const [description, setDesc]      = useState("");
  const [errors, setErrors]         = useState({});
  const [flash, setFlash]           = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const subjectRef                  = useRef(null);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const close = (e) => {
      if (subjectRef.current && !subjectRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const allSubjects   = [...new Set(subjects)];
  const finalSubject  = selectedSubject === "__other__" ? customSubject.trim() : selectedSubject;
  const subStyle      = getSubjectStyle(finalSubject);

  const validate = () => {
    const e = {};
    if (!title.trim() || title.trim().length < 3) e.title   = "Title needs at least 3 characters";
    if (!finalSubject)                              e.subject = "Please select or enter a subject";
    if (!dueDate)                                  e.dueDate = "Please pick a due date";
    return e;
  };

  const clearErr = (key) => setErrors((p) => ({ ...p, [key]: null }));

  const handleSubmit = (ev) => {
    ev?.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onAdd({ title: title.trim(), subject: finalSubject, dueDate, description: description.trim() });
    setTitle(""); setSubject(""); setCustom(""); setDueDate(""); setDesc(""); setErrors({});
    setFlash(true);
    setTimeout(() => setFlash(false), 2400);
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleSubmit();
  };

  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      marginBottom: 20,
      border: "1px solid #e0e7ff",
      boxShadow: "0 4px 24px rgba(55,48,163,0.08)",
      overflow: "visible",        /* ← allow dropdown to escape */
    }}>

      {/* ── Header ── */}
      <div style={{
        background: "linear-gradient(135deg, #1e1b6e 0%, #3730a3 60%, #6366f1 100%)",
        borderRadius: "16px 16px 0 0",
        padding: "14px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: "rgba(255,255,255,0.18)",
            border: "1px solid rgba(255,255,255,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <MdAssignment size={19} color="#fff" />
          </div>
          <div>
            <h3 style={{
              fontFamily: "'Poppins',sans-serif", fontWeight: 800,
              color: "#fff", fontSize: 14, margin: "0 0 1px", letterSpacing: "-0.2px",
            }}>
              Create New Assignment
            </h3>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", margin: 0 }}>
              Assigned to all enrolled students · <kbd style={{
                fontSize: 10, background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 4, padding: "1px 5px", color: "rgba(255,255,255,0.7)",
              }}>Ctrl+Enter</kbd> to submit
            </p>
          </div>
        </div>

        {/* Flash badge */}
        {flash && (
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "6px 14px",
            background: "rgba(16,185,129,0.25)",
            border: "1px solid rgba(16,185,129,0.4)",
            borderRadius: 99, color: "#6ee7b7",
            fontSize: 12, fontWeight: 700,
          }}>
            <MdCheckCircle size={15} /> Assignment added!
          </div>
        )}
      </div>

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} noValidate
        style={{ padding: "18px 20px 20px" }}>

        {/* Row 1 — Title · Subject · Due Date */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 14,
          marginBottom: 14,
        }}>

          {/* Title */}
          <div>
            <FieldLabel icon={MdTitle} text="Assignment Title" />
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="e.g. Unit 3 Lab Report"
                value={title}
                maxLength={80}
                onChange={(e) => { setTitle(e.target.value); clearErr("title"); }}
                style={base({
                  paddingRight: 44,
                  borderColor: errors.title ? "#f87171" : "#e0e7ff",
                  background:  errors.title ? "#fef2f2" : "#f9f8ff",
                })}
                onFocus={(e) => Object.assign(e.target.style, errors.title ? errStyle : onFocusStyle)}
                onBlur={(e)  => Object.assign(e.target.style, errors.title ? errStyle : onBlurStyle)}
              />
              <span style={{
                position: "absolute", right: 10, top: "50%",
                transform: "translateY(-50%)",
                fontSize: 10, fontWeight: 600,
                color: title.length > 70 ? "#dc2626" : "#c4b5fd",
                pointerEvents: "none",
              }}>
                {title.length}/80
              </span>
            </div>
            <ErrorMsg msg={errors.title} />
          </div>

          {/* Subject dropdown */}
          <div>
            <FieldLabel icon={MdBook} text="Subject" />
            <div ref={subjectRef} style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                style={{
                  ...base({
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer", gap: 8,
                    borderColor: errors.subject ? "#f87171" : menuOpen ? "#6366f1" : "#e0e7ff",
                    boxShadow: menuOpen ? "0 0 0 3px rgba(99,102,241,0.14)" : "none",
                    background: errors.subject ? "#fef2f2" : menuOpen ? "#fff" : "#f9f8ff",
                  }),
                }}
              >
                {finalSubject ? (
                  <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 600, color: subStyle.color, minWidth: 0, overflow: "hidden" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: subStyle.dot, flexShrink: 0, boxShadow: `0 0 0 2px ${subStyle.ring}` }} />
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{finalSubject}</span>
                  </span>
                ) : (
                  <span style={{ color: "#9ca3af", fontSize: 13 }}>Select subject…</span>
                )}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke={menuOpen ? "#6366f1" : "#9ca3af"} strokeWidth="2.5"
                  style={{ transform: menuOpen ? "rotate(180deg)" : "none", transition: "transform 0.18s", flexShrink: 0 }}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {menuOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 5px)", left: 0, right: 0,
                  background: "#fff", border: "1.5px solid #e0e7ff", borderRadius: 12,
                  boxShadow: "0 8px 28px rgba(55,48,163,0.16)",
                  zIndex: 9999, overflow: "hidden",
                  animation: "fsd 0.15s ease",
                }}>
                  <div style={{ maxHeight: 200, overflowY: "auto" }}>
                    {allSubjects.map((s) => {
                      const st = getSubjectStyle(s);
                      const active = selectedSubject === s;
                      return (
                        <button key={s} type="button"
                          onClick={() => { setSubject(s); setMenuOpen(false); clearErr("subject"); }}
                          style={{
                            width: "100%", display: "flex", alignItems: "center", gap: 10,
                            padding: "9px 14px", border: "none",
                            background: active ? st.bg : "transparent",
                            cursor: "pointer", textAlign: "left", transition: "background 0.12s",
                          }}
                          onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "#f5f3ff"; }}
                          onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
                        >
                          <span style={{ width: 9, height: 9, borderRadius: "50%", background: st.dot, flexShrink: 0, boxShadow: `0 0 0 2px ${st.ring}` }} />
                          <span style={{ fontSize: 13, fontWeight: active ? 700 : 400, color: active ? st.color : "#374151", flex: 1 }}>{s}</span>
                          {active && <MdCheckCircle size={14} color={st.dot} />}
                        </button>
                      );
                    })}
                    <div style={{ borderTop: "1px solid #f3f4f6", margin: "3px 0" }} />
                    <button type="button"
                      onClick={() => { setSubject("__other__"); setMenuOpen(false); }}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 10,
                        padding: "9px 14px", border: "none",
                        background: selectedSubject === "__other__" ? "#f5f3ff" : "transparent",
                        cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#6366f1",
                        transition: "background 0.12s",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f5f3ff"}
                      onMouseLeave={(e) => e.currentTarget.style.background = selectedSubject === "__other__" ? "#f5f3ff" : "transparent"}
                    >
                      <MdAdd size={15} color="#6366f1" /> Custom subject…
                    </button>
                  </div>
                </div>
              )}
            </div>
            <ErrorMsg msg={errors.subject} />
          </div>

          {/* Due Date */}
          <div>
            <FieldLabel icon={MdCalendarToday} text="Due Date" />
            <div style={{ position: "relative" }}>
              <MdCalendarToday size={14} color="#9ca3af" style={{
                position: "absolute", left: 11, top: "50%",
                transform: "translateY(-50%)", pointerEvents: "none",
              }} />
              <input type="date" value={dueDate} min={today}
                onChange={(e) => { setDueDate(e.target.value); clearErr("dueDate"); }}
                style={base({
                  paddingLeft: 32, colorScheme: "light",
                  borderColor: errors.dueDate ? "#f87171" : "#e0e7ff",
                  background:  errors.dueDate ? "#fef2f2" : "#f9f8ff",
                })}
                onFocus={(e) => Object.assign(e.target.style, errors.dueDate ? errStyle : onFocusStyle)}
                onBlur={(e)  => Object.assign(e.target.style, errors.dueDate ? errStyle : onBlurStyle)}
              />
            </div>
            <ErrorMsg msg={errors.dueDate} />
          </div>
        </div>

        {/* Custom subject input */}
        {selectedSubject === "__other__" && (
          <div style={{ marginBottom: 14 }}>
            <FieldLabel icon={MdBook} text="Custom Subject Name" />
            <div style={{ display: "flex", gap: 8 }}>
              <input autoFocus type="text"
                placeholder="e.g. Machine Learning, DBMS…"
                value={customSubject} maxLength={40}
                onChange={(e) => { setCustom(e.target.value); clearErr("subject"); }}
                style={base({ flex: 1, borderColor: errors.subject ? "#f87171" : "#e0e7ff" })}
                onFocus={(e) => Object.assign(e.target.style, onFocusStyle)}
                onBlur={(e)  => Object.assign(e.target.style, onBlurStyle)}
              />
              <button type="button"
                onClick={() => { setSubject(""); setCustom(""); }}
                style={{
                  flexShrink: 0, padding: "10px 12px",
                  border: "1.5px solid #fecaca", borderRadius: 10,
                  background: "#fef2f2", color: "#dc2626", cursor: "pointer",
                  display: "flex", alignItems: "center",
                }}
                title="Clear custom subject"
              >
                <MdClose size={16} />
              </button>
            </div>
            <ErrorMsg msg={errors.subject} />
          </div>
        )}

        {/* Row 2 — Description */}
        <div style={{ marginBottom: 16 }}>
          <FieldLabel icon={MdNotes} text="Description" optional />
          <input type="text"
            placeholder="Brief description or instructions for students…"
            value={description} maxLength={120}
            onChange={(e) => setDesc(e.target.value)}
            style={base()}
            onFocus={(e) => Object.assign(e.target.style, onFocusStyle)}
            onBlur={(e)  => Object.assign(e.target.style, onBlurStyle)}
          />
        </div>

        {/* Row 3 — Preview + Submit */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>

          {/* Live preview chips */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", minWidth: 0 }}>
            {(title || finalSubject || dueDate) && (
              <span style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.5px", flexShrink: 0 }}>
                Preview:
              </span>
            )}
            {title && (
              <span style={{ fontSize: 12, fontWeight: 700, color: "#1e1b6e", background: "#f5f3ff", padding: "3px 10px", borderRadius: 99, border: "1px solid #e0e7ff", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {title}
              </span>
            )}
            {finalSubject && (
              <span style={{ padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: subStyle.bg, color: subStyle.color, border: `1px solid ${subStyle.ring}`, flexShrink: 0 }}>
                {finalSubject}
              </span>
            )}
            {dueDate && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: "#d1fae5", color: "#059669", flexShrink: 0 }}>
                <MdCalendarToday size={10} /> {dueDate}
              </span>
            )}
          </div>

          {/* Submit */}
          <button type="submit" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "11px 26px",
            background: flash
              ? "linear-gradient(135deg, #059669, #10b981)"
              : "linear-gradient(135deg, #3730a3, #6366f1)",
            color: "#fff", border: "none", borderRadius: 10,
            fontWeight: 700, fontSize: 14,
            fontFamily: "'Poppins',sans-serif", cursor: "pointer",
            boxShadow: flash
              ? "0 4px 14px rgba(5,150,105,0.35)"
              : "0 4px 14px rgba(99,102,241,0.35)",
            transition: "all 0.2s", whiteSpace: "nowrap", flexShrink: 0,
            minWidth: 140, justifyContent: "center",
          }}
            onMouseEnter={(e) => { if (!flash) e.currentTarget.style.opacity = "0.9"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
          >
            {flash
              ? <><MdCheckCircle size={17} /> Added!</>
              : <><MdAdd size={17} /> Add Assignment</>
            }
          </button>
        </div>
      </form>

      <style>{`
        @keyframes fsd {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          position: absolute; width: 100%; height: 100%;
          opacity: 0; cursor: pointer;
        }
      `}</style>
    </div>
  );
}

export default AssignmentForm;
