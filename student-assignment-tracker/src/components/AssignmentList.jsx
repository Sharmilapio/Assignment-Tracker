import { useState } from "react";
import {
  MdDelete, MdArrowForward, MdCalendarToday,
  MdEdit, MdCheck, MdClose, MdPeople,
} from "react-icons/md";
import { getSubjectStyle } from "./AssignmentForm";

function AssignmentList({ assignments, onDelete, onOpen, onEdit }) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  const startEdit = (e, a) => {
    e.stopPropagation();
    setEditingId(a.id);
    setEditTitle(a.title);
    setEditDueDate(a.dueDate);
  };

  const saveEdit = (e, a) => {
    e.stopPropagation();
    if (!editTitle.trim()) return;
    onEdit(a.id, { title: editTitle.trim(), dueDate: editDueDate || a.dueDate });
    setEditingId(null);
  };

  const cancelEdit = (e) => {
    e.stopPropagation();
    setEditingId(null);
  };

  if (assignments.length === 0) {
    return (
      <div style={{
        background: "#fff",
        border: "2px dashed #c7d2fe",
        borderRadius: 16,
        padding: "60px 24px",
        textAlign: "center",
        display: "flex", flexDirection: "column",
        alignItems: "center", gap: 14,
      }}>
        <div style={{
          width: 70, height: 70, borderRadius: 18,
          background: "linear-gradient(135deg, #f5f3ff, #ede9fe)",
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "2px solid #e0e7ff",
        }}>
          <span style={{ fontSize: 32 }}>📋</span>
        </div>
        <div>
          <h3 style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 16, fontWeight: 700, color: "#1e1b6e", margin: "0 0 6px",
          }}>
            No assignments found
          </h3>
          <p style={{ fontSize: 13, color: "#9ca3af", maxWidth: 280, lineHeight: 1.6 }}>
            Create your first assignment using the form above, or try clearing the filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="assignment-grid">
      {assignments.map((a) => {
        const subs     = Object.values(a.submissions || {});
        const total    = subs.length;
        const submitted = subs.filter((s) => s.status === "Submitted").length;
        const late      = subs.filter((s) => s.status === "Late").length;
        const pending   = subs.filter((s) => s.status === "Pending").length;
        const pct       = total > 0 ? Math.round((submitted / total) * 100) : 0;
        const isOverdue = new Date(a.dueDate) < new Date().setHours(0, 0, 0, 0);
        const subStyle  = getSubjectStyle(a.subject);
        const isEditing = editingId === a.id;
        const showDeleteConfirm = deleteConfirmId === a.id;

        const barColor =
          pct === 100 ? "#059669" :
          pct > 60    ? "#6366f1" :
          pct > 30    ? "#d97706" : "#ef4444";

        /* days until/since due */
        const dueDt    = new Date(a.dueDate);
        const diffMs   = dueDt - new Date().setHours(0, 0, 0, 0);
        const diffDays = Math.round(diffMs / 86400000);
        const dueBadge =
          diffDays === 0 ? { label: "Due today", color: "#d97706", bg: "#fef3c7" } :
          diffDays  <  0 ? { label: `${Math.abs(diffDays)}d overdue`, color: "#dc2626", bg: "#fee2e2" } :
          diffDays === 1 ? { label: "Due tomorrow", color: "#d97706", bg: "#fef3c7" } :
                           { label: `Due in ${diffDays}d`, color: "#059669", bg: "#d1fae5" };

        return (
          <div
            key={a.id}
            className="assignment-card"
            onClick={() => !isEditing && !showDeleteConfirm && onOpen(a.id)}
            style={{ cursor: isEditing ? "default" : "pointer" }}
          >
            {/* Subject + actions row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
              <span style={{
                padding: "4px 10px",
                background: subStyle.bg, color: subStyle.color,
                borderRadius: 99, fontSize: 11, fontWeight: 700,
                display: "inline-flex", alignItems: "center", gap: 5,
                border: `1px solid ${subStyle.ring}`,
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: subStyle.dot, display: "inline-block",
                }} />
                {a.subject}
              </span>

              {/* Edit / Delete buttons */}
              {!isEditing && !showDeleteConfirm && (
                <div style={{ display: "flex", gap: 4 }} onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => startEdit(e, a)}
                    title="Edit assignment"
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      color: "#9ca3af", padding: "4px 5px", borderRadius: 6,
                      display: "flex", alignItems: "center",
                      transition: "color 0.15s, background 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#6366f1";
                      e.currentTarget.style.background = "#e0e7ff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#9ca3af";
                      e.currentTarget.style.background = "none";
                    }}
                  >
                    <MdEdit size={15} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(a.id); }}
                    title="Delete assignment"
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      color: "#9ca3af", padding: "4px 5px", borderRadius: 6,
                      display: "flex", alignItems: "center",
                      transition: "color 0.15s, background 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#dc2626";
                      e.currentTarget.style.background = "#fee2e2";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#9ca3af";
                      e.currentTarget.style.background = "none";
                    }}
                  >
                    <MdDelete size={15} />
                  </button>
                </div>
              )}
            </div>

            {/* Delete confirm overlay */}
            {showDeleteConfirm && (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: "#fef2f2",
                  border: "1.5px solid #fecaca",
                  borderRadius: 10,
                  padding: "12px 14px",
                  display: "flex", flexDirection: "column", gap: 10,
                }}
              >
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#dc2626" }}>
                  Delete this assignment?
                </p>
                <p style={{ margin: 0, fontSize: 11, color: "#6b7280" }}>
                  All {total} submission records will be removed.
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(a.id); setDeleteConfirmId(null); }}
                    style={{
                      flex: 1, padding: "7px",
                      background: "#dc2626", color: "#fff",
                      border: "none", borderRadius: 8,
                      fontWeight: 700, fontSize: 12, cursor: "pointer",
                    }}
                  >
                    Yes, delete
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(null); }}
                    style={{
                      flex: 1, padding: "7px",
                      background: "#f3f4f6", color: "#6b7280",
                      border: "none", borderRadius: 8,
                      fontWeight: 600, fontSize: 12, cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Inline edit mode */}
            {isEditing && (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{ display: "flex", flexDirection: "column", gap: 8 }}
              >
                <input
                  autoFocus
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit(e, a);
                    if (e.key === "Escape") cancelEdit(e);
                  }}
                  style={{
                    width: "100%", padding: "8px 12px",
                    border: "2px solid #6366f1", borderRadius: 8,
                    fontSize: 13, fontWeight: 600, color: "#1e1b6e",
                    background: "#f5f3ff", outline: "none",
                    boxSizing: "border-box", fontFamily: "'Inter',sans-serif",
                    boxShadow: "0 0 0 3px rgba(99,102,241,0.12)",
                  }}
                  placeholder="Assignment title"
                />
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    style={{
                      flex: 1, padding: "7px 10px",
                      border: "1.5px solid #c7d2fe", borderRadius: 8,
                      fontSize: 12, color: "#374151",
                      background: "#f9f8ff", outline: "none",
                      fontFamily: "'Inter',sans-serif",
                      colorScheme: "light",
                    }}
                  />
                  <button
                    onClick={(e) => saveEdit(e, a)}
                    style={{
                      padding: "7px 14px",
                      background: "#059669", color: "#fff",
                      border: "none", borderRadius: 8,
                      fontWeight: 700, fontSize: 12, cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 4,
                    }}
                  >
                    <MdCheck size={15} /> Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    style={{
                      padding: "7px 10px",
                      background: "#f3f4f6", color: "#6b7280",
                      border: "none", borderRadius: 8,
                      fontWeight: 600, fontSize: 12, cursor: "pointer",
                      display: "flex", alignItems: "center",
                    }}
                  >
                    <MdClose size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* Title */}
            {!isEditing && !showDeleteConfirm && (
              <h3 style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 14, fontWeight: 700,
                color: "#1e1b6e", margin: 0, lineHeight: 1.4,
              }}>
                {a.title}
              </h3>
            )}

            {/* Description */}
            {!isEditing && !showDeleteConfirm && a.description && (
              <p style={{
                fontSize: 11, color: "#6b7280", margin: 0,
                lineHeight: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}>
                {a.description}
              </p>
            )}

            {/* Due date badge + student count */}
            {!isEditing && !showDeleteConfirm && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  padding: "3px 9px",
                  background: dueBadge.bg,
                  border: `1px solid ${dueBadge.color}33`,
                  borderRadius: 99,
                  fontSize: 11, fontWeight: 700, color: dueBadge.color,
                }}>
                  <MdCalendarToday size={10} />
                  {dueBadge.label}
                </span>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  padding: "3px 9px",
                  background: "#f3f4f6", borderRadius: 99,
                  fontSize: 11, fontWeight: 600, color: "#6b7280",
                }}>
                  <MdPeople size={10} />
                  {total} students
                </span>
              </div>
            )}

            {/* Progress */}
            {!isEditing && !showDeleteConfirm && (
              <div>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center", marginBottom: 5,
                }}>
                  <span style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px" }}>
                    Submissions
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: barColor }}>
                    {pct}%
                  </span>
                </div>
                {/* Stacked progress */}
                <div style={{ height: 7, background: "#f3f4f6", borderRadius: 99, overflow: "hidden", display: "flex" }}>
                  <div style={{
                    height: "100%",
                    width: `${total > 0 ? (submitted / total) * 100 : 0}%`,
                    background: "#059669", transition: "width 0.5s ease",
                  }} />
                  <div style={{
                    height: "100%",
                    width: `${total > 0 ? (late / total) * 100 : 0}%`,
                    background: "#ef4444", transition: "width 0.5s ease",
                  }} />
                  <div style={{
                    height: "100%",
                    width: `${total > 0 ? (pending / total) * 100 : 0}%`,
                    background: "#fbbf24", transition: "width 0.5s ease",
                  }} />
                </div>
              </div>
            )}

            {/* Footer */}
            {!isEditing && !showDeleteConfirm && (
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                paddingTop: 6, borderTop: "1px solid #f3f4f6",
              }}>
                <div style={{ display: "flex", gap: 8 }}>
                  {submitted > 0 && (
                    <span style={{ fontSize: 11, color: "#059669", fontWeight: 700 }}>
                      ✓ {submitted}
                    </span>
                  )}
                  {late > 0 && (
                    <span style={{ fontSize: 11, color: "#ef4444", fontWeight: 700 }}>
                      ✗ {late} late
                    </span>
                  )}
                  {pending > 0 && (
                    <span style={{ fontSize: 11, color: "#d97706", fontWeight: 700 }}>
                      ⏳ {pending}
                    </span>
                  )}
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 700, color: "#6366f1",
                  display: "flex", alignItems: "center", gap: 3,
                }}>
                  Open <MdArrowForward size={13} />
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default AssignmentList;
