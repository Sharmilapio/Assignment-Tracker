import { Panel, Button } from "rsuite";
import { MdBusiness, MdSchool, MdCalendarToday, MdPalette, MdEdit } from "react-icons/md";

function Settings() {
  const settings = [
    { icon: <MdBusiness size={22} color="#3730a3" />, bg: "#e0e7ff", label: "Institution Name", value: "St. Joseph's College for Women" },
    { icon: <MdSchool size={22} color="#059669" />,   bg: "#d1fae5", label: "Department",        value: "Computer Science with Data Analytics" },
    { icon: <MdCalendarToday size={22} color="#d97706" />, bg: "#fef3c7", label: "Academic Year", value: "2025 - 2026" },
    { icon: <MdPalette size={22} color="#7c3aed" />,  bg: "#ede9fe", label: "Theme",             value: "Indigo Purple" },
  ];

  return (
    <div className="pg-wrapper">
      <Panel style={{
        background: "linear-gradient(135deg, #1e1b6e 0%, #3730a3 60%, #6366f1 100%)",
        borderRadius: 16, padding: "32px", border: "none",
      }}>
        <h1 style={{ color: "#fff", fontFamily: "'Poppins',sans-serif", fontSize: 24, fontWeight: 700, margin: "0 0 6px" }}>
          ⚙️ Settings
        </h1>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, margin: 0 }}>
          Manage your application preferences and configurations
        </p>
      </Panel>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {settings.map((s, i) => (
          <Panel key={i} bordered style={{
            borderRadius: 14, border: "1px solid #e0e7ff", background: "#fff",
            display: "flex", alignItems: "center", gap: 16, padding: "16px 20px",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(55,48,163,0.10)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: s.bg, display: "flex", alignItems: "center",
              justifyContent: "center", flexShrink: 0,
            }}>
              {s.icon}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {s.label}
              </p>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#1e1b6e", margin: 0 }}>{s.value}</p>
            </div>
            <Button
              appearance="ghost"
              startIcon={<MdEdit size={16} />}
              style={{
                borderColor: "#c7d2fe", color: "#3730a3",
                borderRadius: 8, fontWeight: 600, fontSize: 13,
              }}
            >
              Edit
            </Button>
          </Panel>
        ))}
      </div>
    </div>
  );
}

export default Settings;