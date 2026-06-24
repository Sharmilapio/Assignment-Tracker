import {
  MdDashboard, MdCheckCircle, MdAssignment, MdPeople,
  MdBarChart, MdSettings, MdHelpOutline, MdLogout,
  MdChevronRight, MdChevronLeft,
} from "react-icons/md";

const menuItems = [
  { id: "dashboard",   label: "Dashboard",   Icon: MdDashboard,   color: "#818cf8" },
  { id: "attendance",  label: "Attendance",  Icon: MdCheckCircle, color: "#34d399" },
  { id: "assignments", label: "Assignments", Icon: MdAssignment,  color: "#60a5fa" },
  { id: "students",    label: "Students",    Icon: MdPeople,      color: "#f472b6" },
  { id: "reports",     label: "Reports",     Icon: MdBarChart,    color: "#fbbf24" },
  { id: "settings",    label: "Settings",    Icon: MdSettings,    color: "#a78bfa" },
  { id: "help",        label: "Help",        Icon: MdHelpOutline, color: "#38bdf8" },
];

function Sidebar({ activeTab, onTabChange, showMenu, onLogout, collapsed, onToggle }) {
  if (!showMenu) return null;

  const W = collapsed ? 68 : 228;

  return (
    <div style={{
      width: W,
      background: "linear-gradient(180deg, #0f0c3d 0%, #1a1760 40%, #251f8c 100%)",
      position: "fixed",
      top: 66, left: 0,
      height: "calc(100vh - 66px)",
      zIndex: 1000,
      display: "flex",
      flexDirection: "column",
      transition: "width 0.28s cubic-bezier(0.4,0,0.2,1)",
      overflowY: "auto", overflowX: "hidden",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      boxShadow: "4px 0 24px rgba(15,12,61,0.25)",
    }}>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        title={collapsed ? "Expand" : "Collapse"}
        style={{
          position: "absolute", top: 16,
          right: collapsed ? "50%" : 10,
          transform: collapsed ? "translateX(50%)" : "none",
          width: 24, height: 24, borderRadius: "50%",
          border: "1.5px solid rgba(255,255,255,0.2)",
          background: "rgba(255,255,255,0.1)",
          color: "rgba(255,255,255,0.8)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
          zIndex: 1001, padding: 0, flexShrink: 0,
          backdropFilter: "blur(4px)",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.2)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.1)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
        }}
      >
        {collapsed ? <MdChevronRight size={14} /> : <MdChevronLeft size={14} />}
      </button>

      {/* Nav */}
      <nav style={{
        display: "flex", flexDirection: "column", gap: 4,
        padding: collapsed ? "52px 8px 12px" : "52px 10px 12px",
        flex: 1,
      }}>
        {menuItems.map(({ id, label, Icon, color }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              title={collapsed ? label : undefined}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: collapsed ? "center" : "flex-start",
                gap: 11,
                width: "100%",
                height: 44,
                padding: collapsed ? "0" : "0 13px",
                border: "none",
                borderRadius: 10,
                background: isActive
                  ? "rgba(255,255,255,0.13)"
                  : "transparent",
                color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
                cursor: "pointer",
                transition: "all 0.18s ease",
                minWidth: 0,
                boxSizing: "border-box",
                boxShadow: isActive ? "inset 0 0 0 1px rgba(255,255,255,0.1)" : "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.9)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                }
              }}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span style={{
                  position: "absolute", left: 0, top: 8, bottom: 8,
                  width: 3, borderRadius: "0 3px 3px 0",
                  background: color,
                  boxShadow: `0 0 8px ${color}80`,
                }} />
              )}

              {/* Icon with colored bg when active */}
              <span style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                background: isActive ? `${color}22` : "transparent",
                transition: "background 0.18s",
              }}>
                <Icon size={18} style={{ color: isActive ? color : "inherit" }} />
              </span>

              {!collapsed && (
                <span style={{
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 500,
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "0.1px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>
                  {label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div style={{
        height: 1,
        margin: "0 12px",
        background: "rgba(255,255,255,0.08)",
      }} />

      {/* Logout */}
      <div style={{ padding: "10px 8px 14px" }}>
        <button
          onClick={() => onLogout && onLogout()}
          title={collapsed ? "Logout" : undefined}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            gap: 11,
            width: "100%", height: 44,
            padding: collapsed ? "0" : "0 13px",
            border: "none", borderRadius: 10,
            background: "transparent",
            color: "#fc8181",
            cursor: "pointer",
            transition: "all 0.18s ease",
            minWidth: 0, boxSizing: "border-box",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(252,129,129,0.1)";
            e.currentTarget.style.color = "#fca5a5";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#fc8181";
          }}
        >
          <span style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 30, height: 30, borderRadius: 8, flexShrink: 0,
          }}>
            <MdLogout size={18} />
          </span>
          {!collapsed && (
            <span style={{ fontSize: 13, fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>
              Logout
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
