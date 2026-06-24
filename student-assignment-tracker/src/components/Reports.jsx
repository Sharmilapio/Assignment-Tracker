import { useState } from "react";
import { Panel, Button } from "rsuite";
import { MdBarChart, MdAssignment, MdCalendarToday, MdPeople, MdDownload, MdAutoAwesome } from "react-icons/md";

function Reports() {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const reports = [
    { icon: <MdAssignment size={26} />, title: "Assignment Report",    desc: "Summary of all assignments and submissions", color: "#e0e7ff", iconBg: "#3730a3" },
    { icon: <MdCalendarToday size={26} />, title: "Attendance Report", desc: "Daily and monthly attendance summary",        color: "#d1fae5", iconBg: "#059669" },
    { icon: <MdPeople size={26} />,      title: "Student Performance", desc: "Individual student submission tracking",     color: "#fef3c7", iconBg: "#d97706" },
  ];

  const generateSummary = async () => {
    setLoading(true); setSummary("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6", max_tokens: 1000,
          messages: [{ role: "user", content: `Generate a professional academic report summary for St. Joseph's College for Women, Department of Computer Science with Data Analytics. Include: assignment completion rates, attendance overview, and student performance insights. Use dummy data and make it realistic for an academic tracker. Keep it concise and professional.` }]
        })
      });
      const data = await res.json();
      setSummary(data.content[0].text);
    } catch { setSummary("Failed to generate summary. Please try again."); }
    setLoading(false);
  };

  return (
    <div className="pg-wrapper">
      {/* Hero */}
      <Panel style={{
        background: "linear-gradient(135deg, #1e1b6e 0%, #3730a3 60%, #6366f1 100%)",
        borderRadius: 16, padding: "40px 32px", textAlign: "center", border: "none",
      }}>
        <MdBarChart size={48} color="#fff" style={{ marginBottom: 12 }} />
        <h2 style={{ color: "#fff", fontFamily: "'Poppins',sans-serif", fontSize: 26, fontWeight: 700, margin: "0 0 8px" }}>
          Reports
        </h2>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: 0 }}>
          View, download, and generate AI-powered academic reports.
        </p>
      </Panel>

      {/* Available Reports */}
      <Panel bordered header={
        <span style={{ fontWeight: 700, color: "#1e1b6e", fontFamily: "'Poppins',sans-serif" }}>📊 Available Reports</span>
      } style={{ borderRadius: 16, border: "1px solid #e0e7ff", background: "#fff" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {reports.map((r, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 16,
              background: "#f5f3ff", border: `1px solid #e0e7ff`,
              borderLeft: `4px solid ${r.iconBg}`,
              borderRadius: 12, padding: "18px 20px",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(55,48,163,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: r.color, display: "flex", alignItems: "center",
                justifyContent: "center", color: r.iconBg, flexShrink: 0,
              }}>
                {r.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: 15, color: "#1e1b6e", margin: "0 0 4px", fontWeight: 600 }}>{r.title}</h4>
                <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{r.desc}</p>
              </div>
              <Button
                appearance="primary"
                startIcon={<MdDownload size={16} />}
                style={{ background: r.iconBg, border: "none", borderRadius: 10, fontWeight: 600 }}
              >
                Download
              </Button>
            </div>
          ))}
        </div>
      </Panel>

      {/* AI Summary */}
      <Panel bordered header={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <MdAutoAwesome size={18} color="#6366f1" />
          <span style={{ fontWeight: 700, color: "#1e1b6e", fontFamily: "'Poppins',sans-serif" }}>AI Report Summary</span>
        </div>
      } style={{ borderRadius: 16, border: "1px solid #e0e7ff", background: "#fff" }}>
        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>
          Click below to generate an AI-powered academic performance summary.
        </p>
        <Button
          appearance="primary"
          loading={loading}
          onClick={generateSummary}
          startIcon={<MdAutoAwesome size={16} />}
          style={{
            background: "linear-gradient(135deg,#3730a3,#6366f1)",
            border: "none", borderRadius: 10, fontWeight: 600,
          }}
        >
          Generate AI Summary
        </Button>
        {summary && (
          <Panel bordered style={{
            marginTop: 16, background: "linear-gradient(135deg,#f5f3ff,#ede9fe)",
            border: "1px solid #c4b5fd", borderRadius: 12,
          }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: "#3730a3", marginBottom: 10 }}>📄 AI Generated Summary</h4>
            <p style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.7, margin: 0 }}>{summary}</p>
          </Panel>
        )}
      </Panel>

      <div style={{
        background: "linear-gradient(135deg,#e0e7ff,#c7d2fe)", border: "1px solid #6366f1",
        borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center",
        gap: 12, fontSize: 13, color: "#3730a3",
      }}>
        <span style={{ fontSize: 22 }}>📌</span>
        <p style={{ margin: 0, lineHeight: 1.5 }}>
          Reports are generated based on current data. Download them as <strong>PDF or CSV</strong> for record keeping.
        </p>
      </div>
    </div>
  );
}

export default Reports;