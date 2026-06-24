import { Table, SelectPicker, Button, Tag, Avatar, Panel, Badge } from "rsuite";
import { MdArrowBack, MdAttachFile, MdDownload, MdCheckCircle, MdPending, MdWarning } from "react-icons/md";

const { Column, HeaderCell, Cell } = Table;

function StudentProfile({ student, assignments, onBack, onUpdate }) {
  const handleFileChange = (assignmentId, file) => {
    if (!file) return;
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) { alert("Please attach a PDF file."); return; }
    const reader = new FileReader();
    reader.onload = () => {
      onUpdate(assignmentId, student.id, { file: reader.result, fileName: file.name, status: "Submitted" });
    };
    reader.readAsDataURL(file);
  };

  let submitted = 0, pending = 0, late = 0;
  assignments.forEach((a) => {
    const sub = a.submissions[student.id];
    if (sub?.status === "Submitted") submitted++;
    else if (sub?.status === "Late") late++;
    else pending++;
  });

  const tableData = assignments.map((a) => ({
    id: a.id,
    title: a.title,
    subject: a.subject,
    dueDate: a.dueDate,
    isOverdue: new Date(a.dueDate) < new Date().setHours(0, 0, 0, 0),
    sub: a.submissions[student.id] || { status: "Pending", file: null, fileName: null },
  }));

  const statusOptions = [
    { label: "Submitted", value: "Submitted" },
    { label: "Pending",   value: "Pending" },
    { label: "Late",      value: "Late" },
  ];

  const statusColor = { Submitted: "green", Pending: "yellow", Late: "red" };
  const statusIcon = {
    Submitted: <MdCheckCircle size={14} />,
    Pending: <MdPending size={14} />,
    Late: <MdWarning size={14} />,
  };

  return (
    <div>
      <Button
        appearance="subtle"
        startIcon={<MdArrowBack size={18} />}
        onClick={onBack}
        style={{ color: "#6366f1", fontWeight: 600, marginBottom: 16 }}
      >
        Back to roster
      </Button>

      {/* Profile Header */}
      <Panel bordered style={{
        background: "linear-gradient(135deg, #e0e7ff, #ede9fe)",
        border: "1px solid #c7d2fe", borderRadius: 14,
        marginBottom: 20, padding: "20px 24px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Avatar
            circle
            size="lg"
            style={{
              background: "linear-gradient(135deg, #3730a3, #6366f1)",
              fontSize: 22, fontWeight: 800, color: "#fff",
              width: 60, height: 60,
            }}
          >
            {student.name.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <h2 style={{ fontFamily: "'Poppins',sans-serif", color: "#1e1b6e", margin: "0 0 8px" }}>
              {student.name}
            </h2>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Tag color="green" startIcon={<MdCheckCircle size={12} />}>{submitted} Submitted</Tag>
              <Tag color="yellow" startIcon={<MdPending size={12} />}>{pending} Pending</Tag>
              {late > 0 && <Tag color="red" startIcon={<MdWarning size={12} />}>{late} Late</Tag>}
            </div>
          </div>
        </div>
      </Panel>

      {assignments.length === 0 ? (
        <Panel bordered style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
          No assignments created yet.
        </Panel>
      ) : (
        <Panel bordered style={{ borderRadius: 14, border: "1px solid #e0e7ff", background: "#fff" }}>
          <Table
            data={tableData}
            autoHeight
            wordWrap="break-word"
            style={{ borderRadius: 10 }}
            rowHeight={56}
          >
            <Column flexGrow={2} minWidth={150}>
              <HeaderCell style={{ fontWeight: 700, color: "#1e1b6e", fontSize: 13 }}>Assignment</HeaderCell>
              <Cell dataKey="title" style={{ fontSize: 13, color: "#374151", fontWeight: 500 }} />
            </Column>

            <Column flexGrow={1} minWidth={120}>
              <HeaderCell style={{ fontWeight: 700, color: "#1e1b6e", fontSize: 13 }}>Subject</HeaderCell>
              <Cell>
                {(row) => <Tag color="violet" style={{ fontSize: 11 }}>{row.subject}</Tag>}
              </Cell>
            </Column>

            <Column flexGrow={1} minWidth={110}>
              <HeaderCell style={{ fontWeight: 700, color: "#1e1b6e", fontSize: 13 }}>Due Date</HeaderCell>
              <Cell>
                {(row) => (
                  <Tag color={row.isOverdue ? "red" : "green"} style={{ fontSize: 11 }}>
                    {row.dueDate}
                  </Tag>
                )}
              </Cell>
            </Column>

            <Column flexGrow={1} minWidth={140}>
              <HeaderCell style={{ fontWeight: 700, color: "#1e1b6e", fontSize: 13 }}>Status</HeaderCell>
              <Cell>
                {(row) => (
                  <SelectPicker
                    data={statusOptions}
                    value={row.sub.status}
                    onChange={(val) => onUpdate(row.id, student.id, { status: val })}
                    searchable={false}
                    cleanable={false}
                    size="sm"
                    style={{ width: 130 }}
                    menuStyle={{ zIndex: 9999 }}
                    renderValue={(val) => (
                      <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        {statusIcon[val]}
                        <Tag color={statusColor[val]} style={{ fontSize: 11 }}>{val}</Tag>
                      </span>
                    )}
                  />
                )}
              </Cell>
            </Column>

            <Column flexGrow={1} minWidth={150}>
              <HeaderCell style={{ fontWeight: 700, color: "#1e1b6e", fontSize: 13 }}>File</HeaderCell>
              <Cell>
                {(row) => (
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <label style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      cursor: "pointer", fontSize: 12, fontWeight: 600,
                      color: "#6366f1", padding: "4px 10px",
                      border: "1px solid #c7d2fe", borderRadius: 8,
                      background: "#f5f3ff",
                    }}>
                      <MdAttachFile size={14} />
                      {row.sub.fileName ? "Replace" : "Attach"}
                      <input
                        type="file" accept=".pdf,application/pdf" hidden
                        onChange={(e) => handleFileChange(row.id, e.target.files[0])}
                      />
                    </label>
                    {row.sub.fileName && (
                      <a
                        href={row.sub.file}
                        download={row.sub.fileName}
                        style={{ fontSize: 11, color: "#059669", display: "flex", alignItems: "center", gap: 3 }}
                      >
                        <MdDownload size={14} />
                        {row.sub.fileName.length > 12 ? row.sub.fileName.slice(0, 12) + "…" : row.sub.fileName}
                      </a>
                    )}
                  </div>
                )}
              </Cell>
            </Column>
          </Table>
        </Panel>
      )}
    </div>
  );
}

export default StudentProfile;