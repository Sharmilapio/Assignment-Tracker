import { useState } from "react";
import { Input, SelectPicker, DatePicker, Button, Panel } from "rsuite";
import { MdAdd, MdAssignment } from "react-icons/md";

function AssignmentForm({ onAdd, subjects = [] }) {
  const [title, setTitle] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [customSubject, setCustomSubject] = useState("");
  const [dueDate, setDueDate] = useState(null);

  const subjectOptions = [
    ...subjects.map((s) => ({ label: s, value: s })),
    { label: "Other / Custom", value: "__other__" },
  ];

  const handleSubmit = () => {
    const finalSubject = selectedSubject === "__other__" ? customSubject.trim() : selectedSubject;
    if (!title || !finalSubject || !dueDate) {
      alert("Please fill in all fields");
      return;
    }
    const formatted = dueDate.toISOString().split("T")[0];
    onAdd({ title, subject: finalSubject, dueDate: formatted });
    setTitle("");
    setSelectedSubject(null);
    setCustomSubject("");
    setDueDate(null);
  };

  return (
    <Panel
      bordered
      style={{
        background: "#fff",
        borderRadius: 14,
        marginBottom: 20,
        boxShadow: "0 4px 20px rgba(55,48,163,0.08)",
        border: "1px solid #e0e7ff",
      }}
      header={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <MdAssignment size={20} color="#3730a3" />
          <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, color: "#1e1b6e" }}>
            New Assignment
          </span>
        </div>
      }
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `2fr 2fr ${selectedSubject === "__other__" ? "2fr " : ""}1.2fr auto`,
          gap: "16px",
          alignItems: "end",
        }}
      >
        {/* Title */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>Title</label>
          <Input
            placeholder="Assignment title"
            value={title}
            onChange={setTitle}
            style={{ borderColor: "#e0e7ff", width: "100%" }}
          />
        </div>

        {/* Subject */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>Subject</label>
          <SelectPicker
            data={subjectOptions}
            value={selectedSubject}
            onChange={setSelectedSubject}
            placeholder="Select subject"
            searchable={false}
            style={{ width: "100%" }}
            menuStyle={{ zIndex: 9999 }}
          />
        </div>

        {/* Custom Subject */}
        {selectedSubject === "__other__" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>Custom Subject</label>
            <Input
              placeholder="Enter subject name"
              value={customSubject}
              onChange={setCustomSubject}
              style={{ width: "100%" }}
            />
          </div>
        )}

        {/* Due Date */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>Due Date</label>
          <DatePicker
            value={dueDate}
            onChange={setDueDate}
            placeholder="Select date"
            style={{ width: "100%" }}
            oneTap
            menuStyle={{ zIndex: 9999 }}
          />
        </div>

        {/* Button */}
        <div>
          <Button
            appearance="primary"
            onClick={handleSubmit}
            startIcon={<MdAdd size={18} />}
            style={{
              background: "linear-gradient(135deg, #3730a3, #6366f1)",
              border: "none",
              fontFamily: "'Poppins',sans-serif",
              fontWeight: 600,
              padding: "8px 20px",
              whiteSpace: "nowrap",
              width: "100%",
            }}
          >
            Add Assignment
          </Button>
        </div>
      </div>
    </Panel>
  );
}

export default AssignmentForm;