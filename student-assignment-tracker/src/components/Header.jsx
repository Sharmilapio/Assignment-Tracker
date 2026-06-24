import { Nav } from "rsuite";
import { MdCheckCircle, MdAssignment, MdPeople } from "react-icons/md";

const tabIcons = {
  attendance:  MdCheckCircle,
  assignments: MdAssignment,
  students:    MdPeople,
};

function AppHeader({ activeTab, onTabChange, showTabs }) {
  const tabs = [
    { id: "attendance",  label: "Attendance" },
    { id: "assignments", label: "Assignments" },
    { id: "students",    label: "Students" },
  ];

  return (
    <div style={{
      background: "linear-gradient(135deg, #1e1b6e 0%, #3730a3 55%, #6366f1 100%)",
      width: "100%",
      boxShadow: "0 2px 10px rgba(30,27,110,0.18)",
    }}>
      {/* Institution banner */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 14,
        padding: "14px 24px",
      }}>
        <div style={{
          width: 44, height: 44,
          background: "rgba(255,255,255,0.15)",
          borderRadius: 12,
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "1px solid rgba(255,255,255,0.2)",
          overflow: "hidden",
          flexShrink: 0,
        }}>
          <img
            src="/Milestone.png"
            alt="SJC Logo"
            style={{ width: 36, height: 36, objectFit: "contain" }}
          />
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontSize: 15, fontWeight: 700, color: "#fff",
            fontFamily: "'Poppins', sans-serif",
            letterSpacing: "0.1px", lineHeight: 1.3,
          }}>
            St. Joseph's College for Women
          </div>
          <div style={{
            fontSize: 12, color: "rgba(255,255,255,0.75)",
            fontFamily: "'Inter', sans-serif",
            marginTop: 2,
          }}>
            Department of Computer Science with Data Analytics
          </div>
        </div>
      </div>

      {/* Tab strip */}
      {showTabs && (
        <div style={{
          display: "flex",
          borderTop: "1px solid rgba(255,255,255,0.12)",
        }}>
          {tabs.map((t) => {
            const Icon = tabIcons[t.id];
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onTabChange(t.id)}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                  padding: "11px 0",
                  border: "none",
                  cursor: "pointer",
                  background: isActive ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.06)",
                  color: isActive ? "#3730a3" : "rgba(255,255,255,0.75)",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 13,
                  transition: "all 0.18s ease",
                  borderBottom: isActive ? "none" : "none",
                  borderTop: isActive ? "2px solid #818cf8" : "2px solid transparent",
                  boxShadow: isActive ? "0 -2px 12px rgba(129,140,248,0.3)" : "none",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                }}
              >
                <Icon size={15} />
                {t.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AppHeader;
