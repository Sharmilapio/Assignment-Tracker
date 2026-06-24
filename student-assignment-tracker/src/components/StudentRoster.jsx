import { useState } from "react";
import { List, Panel, Progress, Badge, Avatar, Input, Button } from "rsuite";
import { MdPeople, MdChevronRight, MdAdd, MdDelete } from "react-icons/md";

function StudentRoster({ students, assignments, onOpen, onAddStudent, onDeleteStudent }) {
  const totalAssignments = assignments.length;
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    onAddStudent(trimmed);
    setNewName("");
    setAdding(false);
  };

  return (
    <Panel
      bordered
      style={{ borderRadius: 14, background: "#fff", border: "1px solid #e0e7ff",
        boxShadow: "0 4px 20px rgba(55,48,163,0.08)" }}
      header={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <MdPeople size={20} color="#3730a3" />
          <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, color: "#1e1b6e", fontSize: 16 }}>
            Class Roster
          </span>
          <Badge content={students.length} style={{ background: "#6366f1", marginLeft: 4 }} />
          <div style={{ marginLeft: "auto" }}>
            <Button
              size="sm"
              appearance="primary"
              startIcon={<MdAdd size={15} />}
              onClick={() => setAdding((v) => !v)}
              style={{
                background: "linear-gradient(135deg, #3730a3, #6366f1)",
                border: "none",
                fontFamily: "'Poppins',sans-serif",
                fontWeight: 600,
                fontSize: 12,
              }}
            >
              Add Student
            </Button>
          </div>
        </div>
      }
    >
      {/* Add student input row */}
      {adding && (
        <div style={{
          display: "flex", gap: 8, alignItems: "center",
          marginBottom: 14, padding: "10px 12px",
          background: "#f5f3ff", borderRadius: 10,
          border: "1px dashed #c7d2fe",
        }}>
          <Input
            placeholder="Enter student name"
            value={newName}
            onChange={setNewName}
            onPressEnter={handleAdd}
            autoFocus
            style={{ flex: 1, borderColor: "#c7d2fe" }}
          />
          <Button
            size="sm"
            appearance="primary"
            onClick={handleAdd}
            style={{ background: "#3730a3", border: "none", fontWeight: 600 }}
          >
            Add
          </Button>
          <Button
            size="sm"
            appearance="subtle"
            onClick={() => { setAdding(false); setNewName(""); }}
          >
            Cancel
          </Button>
        </div>
      )}

      {totalAssignments === 0 ? (
        <p style={{ color: "#9ca3af", fontSize: 13, margin: "8px 0 0" }}>
          No assignments yet. Once added, each student's submission progress will appear here.
        </p>
      ) : (
        <p style={{ color: "#9ca3af", fontSize: 13, margin: "8px 0 12px" }}>
          Tap a student to view their personal submission dashboard.
        </p>
      )}

      <List hover style={{ borderRadius: 10, overflow: "hidden" }}>
        {students.map((student) => {
          let submitted = 0, late = 0;
          assignments.forEach((a) => {
            const sub = a.submissions[student.id];
            if (sub?.status === "Submitted") submitted++;
            if (sub?.status === "Late") late++;
          });
          const pct = totalAssignments > 0 ? Math.round((submitted / totalAssignments) * 100) : 0;

          return (
            <List.Item
              key={student.id}
              style={{
                cursor: "pointer", padding: "12px 16px",
                display: "flex", alignItems: "center", gap: 14,
                borderBottom: "1px solid #f3f4f6",
              }}
            >
              <Avatar
                circle
                size="sm"
                style={{
                  background: "linear-gradient(135deg, #3730a3, #6366f1)",
                  fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0,
                }}
              >
                {student.name.charAt(0).toUpperCase()}
              </Avatar>

              {/* Clickable name + progress */}
              <div style={{ flex: 1, minWidth: 0 }} onClick={() => onOpen(student.id)}>
                <div style={{
                  fontSize: 14, fontWeight: 600, color: "#1e1b3a",
                  fontFamily: "'Inter',sans-serif", marginBottom: 4,
                }}>
                  {student.name}
                </div>
                {totalAssignments > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Progress.Line
                      percent={pct}
                      strokeColor={pct === 100 ? "#059669" : "#6366f1"}
                      trailColor="#e0e7ff"
                      strokeWidth={5}
                      showInfo={false}
                      style={{ flex: 1, marginBottom: 0 }}
                    />
                    <span style={{ fontSize: 11, color: "#6366f1", fontWeight: 600, width: 32, textAlign: "right" }}>
                      {pct}%
                    </span>
                  </div>
                )}
              </div>

              {late > 0 && (
                <Badge
                  content={`${late} late`}
                  style={{ background: "#dc2626", fontSize: 10 }}
                />
              )}

              {/* Delete button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Remove "${student.name}" from roster?`)) {
                    onDeleteStudent(student.id);
                  }
                }}
                title="Remove student"
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "#fca5a5", padding: "4px 6px", borderRadius: 6,
                  display: "flex", alignItems: "center",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#dc2626"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#fca5a5"}
              >
                <MdDelete size={18} />
              </button>

              <MdChevronRight
                size={20} color="#c7d2fe"
                onClick={() => onOpen(student.id)}
                style={{ cursor: "pointer", flexShrink: 0 }}
              />
            </List.Item>
          );
        })}
      </List>
    </Panel>
  );
}

export default StudentRoster;