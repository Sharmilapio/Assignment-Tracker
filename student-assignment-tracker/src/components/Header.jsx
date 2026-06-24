import { Header, Nav, Button } from "rsuite";

function AppHeader({ activeTab, onTabChange, showTabs }) {
  const tabs = [
    { id: "attendance",  label: "Attendance" },
    { id: "assignments", label: "Assignments" },
    { id: "students",    label: "Students" },
  ];

  return (
    <Header
      style={{
        background: "linear-gradient(135deg, #1e1b6e 0%, #3730a3 40%, #6366f1 100%)",
        color: "white",
        width: "100%",
      }}
    >
      <div style={{
        width: "100%", padding: "12px 20px",
        display: "flex", justifyContent: "center",
        alignItems: "center", gap: 15, boxSizing: "border-box",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src="/Milestone.png" alt="SJC Logo"
            style={{ width: 45, height: 45, objectFit: "contain" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>
            St.Joseph's College for Women
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.9)" }}>
            Department of Computer Science with Data Analytics
          </div>
        </div>
      </div>

      {showTabs && (
        <Nav
          appearance="subtle"
          style={{
            display: "flex", width: "100%", borderTop: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          {tabs.map((t) => (
            <Nav.Item
              key={t.id}
              active={activeTab === t.id}
              onClick={() => onTabChange(t.id)}
              style={{
                flex: 1,
                textAlign: "center",
                color: activeTab === t.id ? "#3730a3" : "rgba(255,255,255,0.72)",
                background: activeTab === t.id ? "#fff" : "rgba(255,255,255,0.12)",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: activeTab === t.id ? 600 : 500,
                fontSize: 13,
                padding: "10px 0",
                borderRadius: 0,
                cursor: "pointer",
              }}
            >
              {t.label}
            </Nav.Item>
          ))}
        </Nav>
      )}
    </Header>
  );
}

export default AppHeader;