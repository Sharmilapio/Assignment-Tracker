import { useState, useRef, useEffect } from "react";
import {
  MdAdd, MdAssignment, MdClose, MdCalendarToday,
  MdBook, MdCheckCircle, MdKeyboard,
} from "react-icons/md";

/* ── subject accent colours (shared with list) ── */
export const SUBJECT_COLORS = {
  "Python":           { bg: "#fef3c7", color: "#b45309", dot: "#f59e0b", ring: "#fde68a" },
  "Data Structure":   { bg: "#dbeafe", color: "#1d4ed8", dot: "#3b82f6", ring: "#bfdbfe" },
  "Data Warehousing": { bg: "#d1fae5", color: "#065f46", dot: "#10b981", ring: "#a7f3d0" },
  "Data Mining":      { bg: "#ede9fe", color: "#5b21b6", dot: "#8b5cf6", ring: "#c4b5fd" },
  "Deep Learning":    { bg: "#fce7f3", color: "#9d174d", dot: "#ec4899", ring: "#fbcfe8" },
};
export const getSubjectStyle = (s) =>
  SUBJECT_COLORS[s] || { bg: "#e0e7ff", color: "#3730a3", dot: "#6366f1", ring: "#c7d2fe" };

/* ── tiny reusable field wrapper ── */
function Field({ label, icon: Icon, error, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, minWidth: 0 }}>
      <label style={{
        display: "flex", alignItems: "center", gap: 5,
        fontSize: 11, fontWeight: 700, color: error ? "#dc2626" : "#6b7280",
        textTransform: "uppercase", letterSpacing: "0.7px",
        fontFamily: "'Inter', sans-serif",
      }}>
        {Icon && <Icon size={12} color={error ? "#dc2626" : "#6366f1"} />}
        {label}
      </label>
      {children}
      {error && (
        <span style={{ fontSize: 11, color: "#dc2626", fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>
          ⚠ {error}
        </span>
      )}
    </div>
  );
}

function AssignmentForm({ onAdd, subjects = [] }) {
  const [title, setTitle]               = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [customSubject, setCustomSubject]     = useState("");
  const [dueDate, setDueDate]           = useState("");
  const [description, setDescription]  = useState("");
  const [errors, setErrors]             = useState({});
  const [submitted, setSubmitted]       = useState(false); // flash success
  const [subjectMenuOpen, setSubjectMenuOpen] = useState(false);
  const subjectRef = useRef(null);

  const today = new Date().toISOString().split("T")[0];

  /* close subject dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (subjectRef.current && !subjectRef.current.contains(e.target)) {
        setSubjectMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const allSubjects = [...new Set([...subjects])];
  const finalSubject = selectedSubject === "__other__" ? customSubject.trim() : selectedSubject;

  /* ── validation ── */
  const validate = () => {
    const e = {};
    if (!title.trim())          e.title   = "Title is required";
    else if (title.trim().length < 3) e.title = "At least 3 characters";
    if (!finalSubject)          e.subject = "Select or enter a subject";
    if (!dueDate)               e.dueDate = "Due date is required";
    return e;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    onAdd({ title: title.trim(), subject: finalSubject, dueDate, description: description.trim() });

    /* reset */
    setTitle(""); setSelectedSubject(""); setCustomSubject("");
    setDueDate(""); setDescription(""); setErrors({});
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleSubmit();
  };

  /* field focus style helper */
  const focusStyle = (hasError) => ({
    borderColor: hasError ? "#f87171" : "#6366f1",
    boxShadow: hasError
      ? "0 0 0 3px rgba(248,113,113,0.15)"
      : "0 0 0 3px rgba(99,102,241,0.15)",
    background: "#fff",
    outline: "none",
  });

  const baseInput = {
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
  };

  const subStyle = getSubjectStyle(finalSubject);

  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      marginBottom: 20,
      boxShadow: "0 4px 24px rgba(55,48,163,0.09)",
      border: "1px solid #e0e7ff",
      overflow: "hidden",
      transition: "box-shadow 0.2s",
    }}>

      {/* ── Header ── */}
      <div style={{
        background: "linear-gradient(135deg, #1e1b6e 0%, #3730a3 60%, #6366f1 100%)",
        padding: "16px 22px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "rgba(255,255,255,0.18)",
            border: "1px solid rgba(255,255,255,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <MdAssignment size={20} color="#fff" />
          </div>
          <div>
            <h3 style={{
              fontFamily: "'Poppins', sans-serif", fontWeight: 800,
              color: "#fff", fontSize: 15, margin: "0 0 2px",
              letterSpacing: "-0.2px",
            }}>
              Create New Assignment
            </h3>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", margin: 0 }}>
              Assigns to all {"\u00a0"}
              <span style={{ color: "#a5b4fc", fontWeight: 700 }}>enrolled students</span>
            </p>
          </div>
        </div>

        {/* Keyboard hint */}
        <div style={{
          display: "flex", alignItems: "center", gap: 5,
          padding: "5px 10px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.15)",
        }}>
          <MdKeyboard size={13} color="rgba(255,255,255,0.6)" />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>
            Ctrl + Enter to add
          </span>
        </div>
      </div>

      {/* ── Form body ── */}
      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} noValidate>
        <div style={{ padding: "20px 22px 22px" }}>

          {/* Row 1: Title + Subject + Due Date */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "2fr 1.8fr 1.5fr",
            gap: 16,
            marginBottom: 14,
          }}>

            {/* Title */}
            <Field label="Assignment Title" icon={MdAssignment} error={errors.title}>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="e.g. Unit 3 Lab Report"
                  value={title}
                  maxLength={80}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors((p) => ({ ...p, title: null }));
                  }}
                  style={{
                    ...baseInput,
                    paddingRight: 42,
                    borderColor: errors.title ? "#f87171" : "#e0e7ff",
                    background: errors.title ? "#fef2f2" : "#f9f8ff",
                  }}
                  onFocus={(e) => Object.assign(e.target.style, focusStyle(errors.title))}
                  onBlur={(e) => Object.assign(e.target.style, {
                    borderColor: errors.title ? "#f87171" : "#e0e7ff",
                    boxShadow: "none",
                    background: errors.title ? "#fef2f2" : "#f9f8ff",
                  })}
                />
                {/* char counter */}
                <span style={{
                  position: "absolute", right: 10, top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 10, color: title.length > 70 ? "#dc2626" : "#c4b5fd",
                  fontWeight: 600,
                }}>
                  {title.length}/80
                </span>
              </div>
            </Field>

            {/* Subject custom dropdown */}
            <Field label="Subject" icon={MdBook} error={errors.subject}>
              <div ref={subjectRef} style={{ position: "relative" }}>
                <button
                  type="button"
                  onClick={() => setSubjectMenuOpen((v) => !v)}
                  style={{
                    ...baseInput,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    cursor: "pointer", textAlign: "left", gap: 8,
                    borderColor: errors.subject ? "#f87171" : subjectMenuOpen ? "#6366f1" : "#e0e7ff",
                    boxShadow: subjectMenuOpen ? "0 0 0 3px rgba(99,102,241,0.15)" : "none",
                    background: errors.subject ? "#fef2f2" : subjectMenuOpen ? "#fff" : "#f9f8ff",
                  }}
                >
                  {finalSubject ? (
                    <span style={{
                      display: "flex", alignItems: "center", gap: 7,
                      fontSize: 13, fontWeight: 600, color: subStyle.color,
                    }}>
                      <span style={{
                        width: 8, height: 8, borderRadius: "50%",
                        background: subStyle.dot, display: "inline-block",
                        boxShadow: `0 0 0 2px ${subStyle.ring}`,
                      }} />
                      {finalSubject}
                    </span>
                  ) : (
                    <span style={{ color: "#9ca3af", fontSize: 13 }}>Select subject…</span>
                  )}
                  <svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke={subjectMenuOpen ? "#6366f1" : "#9ca3af"} strokeWidth="2.5"
                    style={{ transform: subjectMenuOpen ? "rotate(180deg)" : "none", transition: "transform 0.18s", flexShrink: 0 }}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {/* Dropdown */}
                {subjectMenuOpen && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
                    background: "#fff",
                    border: "1.5px solid #e0e7ff",
                    borderRadius: 12,
                    boxShadow: "0 8px 28px rgba(55,48,163,0.14)",
                    zIndex: 9999,
                    overflow: "hidden",
                    animation: "fadeSlideDown 0.15s ease",
                  }}>
                    <div style={{ maxHeight: 220, overflowY: "auto" }}>
                      {allSubjects.map((s) => {
                        const st = getSubjectStyle(s);
                        const isActive = selectedSubject === s;
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => {
                              setSelectedSubject(s);
                              setSubjectMenuOpen(false);
                              if (errors.subject) setErrors((p) => ({ ...p, subject: null }));
                            }}
                            style={{
                              width: "100%", display: "flex", alignItems: "center",
                              gap: 10, padding: "10px 14px",
                              border: "none", background: isActive ? st.bg : "transparent",
                              cursor: "pointer", textAlign: "left",
                              transition: "background 0.12s",
                            }}
                            onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "#f5f3ff"; }}
                            onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                          >
                            <span style={{
                              width: 10, height: 10, borderRadius: "50%",
                              background: st.dot, flexShrink: 0,
                              boxShadow: `0 0 0 2px ${st.ring}`,
                            }} />
                            <span style={{
                              fontSize: 13, fontWeight: isActive ? 700 : 500,
                              color: isActive ? st.color : "#374151",
                              flex: 1,
                            }}>
                              {s}
                            </span>
                            {isActive && <MdCheckCircle size={15} color={st.dot} />}
                          </button>
                        );
                      })}

                      {/* Divider + Custom */}
                      <div style={{ borderTop: "1px solid #f3f4f6", margin: "4px 0" }} />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSubject("__other__");
                          setSubjectMenuOpen(false);
                        }}
                        style={{
                          width: "100%", display: "flex", alignItems: "center",
                          gap: 10, padding: "10px 14px",
                          border: "none",
                          background: selectedSubject === "__other__" ? "#f5f3ff" : "transparent",
                          cursor: "pointer", textAlign: "left",
                          transition: "background 0.12s",
                          color: "#6366f1", fontSize: 13, fontWeight: 600,
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#f5f3ff"}
                        onMouseLeave={(e) => e.currentTarget.style.background = selectedSubject === "__other__" ? "#f5f3ff" : "transparent"}
                      >
                        <MdAdd size={16} color="#6366f1" />
                        Custom subject…
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Field>

            {/* Due Date */}
            <Field label="Due Date" icon={MdCalendarToday} error={errors.dueDate}>
              <div style={{ position: "relative" }}>
                <MdCalendarToday
                  size={15} color={errors.dueDate ? "#f87171" : "#9ca3af"}
                  style={{
                    position: "absolute", left: 11, top: "50%",
                    transform: "translateY(-50%)", pointerEvents: "none",
                  }}
                />
                <input
                  type="date"
                  value={dueDate}
                  min={today}
                  onChange={(e) => {
                    setDueDate(e.target.value);
                    if (errors.dueDate) setErrors((p) => ({ ...p, dueDate: null }));
                  }}
                  style={{
                    ...baseInput,
                    paddingLeft: 32,
                    borderColor: errors.dueDate ? "#f87171" : "#e0e7ff",
                    background: errors.dueDate ? "#fef2f2" : "#f9f8ff",
                    colorScheme: "light",
                  }}
                  onFocus={(e) => Object.assign(e.target.style, focusStyle(errors.dueDate))}
                  onBlur={(e) => Object.assign(e.target.style, {
                    borderColor: errors.dueDate ? "#f87171" : "#e0e7ff",
                    boxShadow: "none",
                    background: errors.dueDate ? "#fef2f2" : "#f9f8ff",
                  })}
                />
              </div>
            </Field>
          </div>

          {/* Custom subject input (conditionally shown) */}
          {selectedSubject === "__other__" && (
            <div style={{ marginBottom: 14 }}>
              <Field label="Custom Subject Name" icon={MdBook} error={errors.subject}>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    autoFocus
                    type="text"
                    placeholder="e.g. Machine Learning, DBMS…"
                    value={customSubject}
                    maxLength={40}
                    onChange={(e) => {
                      setCustomSubject(e.target.value);
                      if (errors.subject) setErrors((p) => ({ ...p, subject: null }));
                    }}
                    style={{
                      ...baseInput,
                      flex: 1,
                      borderColor: errors.subject ? "#f87171" : "#e0e7ff",
                    }}
                    onFocus={(e) => Object.assign(e.target.style, focusStyle(errors.subject))}
                    onBlur={(e) => Object.assign(e.target.style, {
                      borderColor: errors.subject ? "#f87171" : "#e0e7ff",
                      boxShadow: "none",
                      background: "#f9f8ff",
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => { setSelectedSubject(""); setCustomSubject(""); }}
                    style={{
                      padding: "10px 12px", border: "1.5px solid #fecaca",
                      borderRadius: 10, background: "#fef2f2",
                      color: "#dc2626", cursor: "pointer", display: "flex",
                      alignItems: "center",
                    }}
                    title="Cancel custom subject"
                  >
                    <MdClose size={16} />
                  </button>
                </div>
              </Field>
            </div>
          )}

          {/* Row 2: Description (optional) + Submit button */}
          <div style={{ display: "flex", gap: 14, alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <label style={{
                display: "flex", alignItems: "center", gap: 5,
                fontSize: 11, fontWeight: 700, color: "#6b7280",
                textTransform: "uppercase", letterSpacing: "0.7px",
                marginBottom: 5, fontFamily: "'Inter', sans-serif",
              }}>
                Description
                <span style={{
                  fontSize: 10, color: "#9ca3af", fontWeight: 500,
                  textTransform: "none", letterSpacing: 0,
                }}>
                  (optional)
                </span>
              </label>
              <input
                type="text"
                placeholder="Brief description or instructions…"
                value={description}
                maxLength={120}
                onChange={(e) => setDescription(e.target.value)}
                style={{ ...baseInput }}
                onFocus={(e) => Object.assign(e.target.style, focusStyle(false))}
                onBlur={(e) => Object.assign(e.target.style, {
                  borderColor: "#e0e7ff", boxShadow: "none", background: "#f9f8ff",
                })}
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "11px 28px",
                background: submitted
                  ? "linear-gradient(135deg, #059669, #10b981)"
                  : "linear-gradient(135deg, #3730a3, #6366f1)",
                color: "#fff", border: "none", borderRadius: 10,
                fontWeight: 700, fontSize: 14,
                fontFamily: "'Poppins', sans-serif",
                cursor: "pointer",
                boxShadow: submitted
                  ? "0 4px 14px rgba(5,150,105,0.35)"
                  : "0 4px 14px rgba(99,102,241,0.35)",
                transition: "all 0.25s ease",
                whiteSpace: "nowrap",
                flexShrink: 0,
                minWidth: 130,
                justifyContent: "center",
              }}
              onMouseEnter={(e) => { if (!submitted) e.currentTarget.style.opacity = "0.9"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
            >
              {submitted ? (
                <>
                  <MdCheckCircle size={18} /> Added!
                </>
              ) : (
                <>
                  <MdAdd size={18} /> Add Assignment
                </>
              )}
            </button>
          </div>

          {/* Preview chip */}
          {(finalSubject || dueDate) && !submitted && (
            <div style={{
              marginTop: 14,
              padding: "8px 14px",
              background: "#f9f8ff",
              border: "1px dashed #c7d2fe",
              borderRadius: 9,
              display: "flex", alignItems: "center", gap: 10,
              fontSize: 12, color: "#6b7280",
            }}>
              <span style={{ fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.4px", fontSize: 10 }}>
                Preview
              </span>
              {title && (
                <span style={{ fontWeight: 700, color: "#1e1b6e" }}>"{title}"</span>
              )}
              {finalSubject && (
                <span style={{
                  padding: "2px 9px", borderRadius: 99, fontSize: 11, fontWeight: 700,
                  background: subStyle.bg, color: subStyle.color,
                }}>
                  {finalSubject}
                </span>
              )}
              {dueDate && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  padding: "2px 9px", borderRadius: 99, fontSize: 11, fontWeight: 700,
                  background: "#d1fae5", color: "#059669",
                }}>
                  <MdCalendarToday size={10} /> {dueDate}
                </span>
              )}
            </div>
          )}
        </div>
      </form>

      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          opacity: 0;
          position: absolute;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

export default AssignmentForm;
