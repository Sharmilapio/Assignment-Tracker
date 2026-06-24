import {
  MdDashboard, MdCheckCircle, MdAssignment, MdPeople,
  MdBarChart, MdSettings, MdHelpOutline, MdLogout,
  MdChevronRight, MdChevronLeft,
} from "react-icons/md";

function Sidebar({ activeTab, onTabChange, showMenu, onLogout, collapsed, onToggle }) {
  const menuItems = [
    { id: "dashboard",   label: "Dashboard",       Icon: MdDashboard },
    { id: "attendance",  label: "Attendance",      Icon: MdCheckCircle },
    { id: "assignments", label: "Assignments",     Icon: MdAssignment },
    { id: "students",    label: "Students",        Icon: MdPeople },
    { id: "reports",     label: "Reports",         Icon: MdBarChart },
    { id: "settings",    label: "Settings",        Icon: MdSettings },
    { id: "help",        label: "Help",            Icon: MdHelpOutline },
  ];

  if (!showMenu) return null;

  const COLLAPSED_W = 72;
  const EXPANDED_W  = 220;

  return (
    <div style={{
      width: collapsed ? COLLAPSED_W : EXPANDED_W,
      background: "linear-gradient(180deg, #1e1b6e 0%, #312a8c 100%)",
      position: "fixed",
      top: 70,
      left: 0,
      height: "calc(100vh - 70px)",
      zIndex: 1000,
      display: "flex",
      flexDirection: "column",
      transition: "width 0.25s ease",
      overflowY: "auto",
      overflowX: "hidden",
      borderRight: "1px solid rgba(255,255,255,0.06)",
    }}>

      {/* Toggle button */}
      <button onClick={onToggle} style={{
        position: "absolute", top: 18, right: 10, // Adjusted position inside sidebar
        width: 26, height: 26, borderRadius: "50%",
        border: "1px solid #e0e7ff", background: "#fff", color: "#3730a3",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", boxShadow: "0 3px 8px rgba(30,27,110,0.25)",
        zIndex: 1001, padding: 0, flexShrink: 0,
      }}>
        {collapsed ? <MdChevronRight size={16} /> : <MdChevronLeft size={16} />}
      </button>

      {/* Nav */}
      <nav style={{
        display: "flex", flexDirection: "column", gap: 6, // Increased gap for a cleaner look
        padding: "50px 8px 12px", flex: 1, // Added top padding to clear toggle button
      }}>
        {menuItems.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              title={label}
              style={{
                position: "relative",
                display: "flex",
                flexDirection: collapsed ? "column" : "row", /* Collapsed standard column, Expand aagumbothu row layout */
                alignItems: "center",
                justifyContent: collapsed ? "center" : "flex-start",
                gap: collapsed ? 3 : 12, // Gap space handles spacing naturally now
                width: "100%",
                height: 50, // Standard heights for better view
                padding: collapsed ? "6px 4px" : "6px 14px",
                border: "none",
                borderRadius: 9,
                background: isActive ? "rgba(255,255,255,0.14)" : "transparent",
                color: isActive ? "#fff" : "rgba(255,255,255,0.68)",
                fontFamily: "'Inter', sans-serif",
                cursor: "pointer",
                transition: "background 0.15s ease, color 0.15s ease",
                minWidth: 0,
                boxSizing: "border-box",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.95)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(255,255,255,0.68)";
                }
              }}
            >
              {/* Active indicator */}
              {isActive && (
                <span style={{
                  position: "absolute", left: 0, top: 10, bottom: 10,
                  width: 3, borderRadius: "0 3px 3px 0", background: "#818cf8",
                }} />
              )}

              {/* Icon */}
              <Icon size={20} style={{ flexShrink: 0 }} />

              {/* Universal Label handling */}
              <span style={{
                fontSize: collapsed ? 9 : 14,
                fontWeight: isActive ? 600 : 500,
                lineHeight: 1.2,
                textAlign: collapsed ? "center" : "left",
                width: collapsed ? 60 : "auto",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                opacity: collapsed ? 0.85 : 1,
              }}>
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: "8px" }} className="logout-wrapper">
        <button
          onClick={() => onLogout && onLogout()}
          title="Logout"
          style={{
            display: "flex",
            flexDirection: collapsed ? "column" : "row",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            gap: collapsed ? 3 : 12,
            width: "100%", height: 50,
            padding: collapsed ? "6px 4px" : "6px 14px",
            border: "none", borderRadius: 9,
            background: "transparent", color: "#ff9d92",
            fontFamily: "'Inter', sans-serif",
            cursor: "pointer",
            transition: "background 0.15s ease, color 0.15s ease",
            minWidth: 0, boxSizing: "border-box",
            position: "relative",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,138,128,0.14)";
            e.currentTarget.style.color = "#ffb4ab";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#ff9d92";
          }}
        >
          <MdLogout size={20} style={{ flexShrink: 0 }} />
          <span style={{
            fontSize: collapsed ? 9 : 14, 
            fontWeight: 500, 
            lineHeight: 1.2,
            textAlign: collapsed ? "center" : "left", 
            width: collapsed ? 60 : "auto",
            overflow: "hidden", textOverflow: "ellipsis",
            whiteSpace: "nowrap", opacity: 0.85,
          }}>
            Logout
          </span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;