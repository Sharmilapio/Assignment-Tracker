import { useState } from "react";
import {
  MdBusiness, MdSchool, MdCalendarToday, MdPalette,
  MdEdit, MdCheck, MdClose, MdSettings,
} from "react-icons/md";

function Settings() {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  const [settings, setSettings] = useState([
    {
      Icon: MdBusiness, iconBg: "#e0e7ff", iconColor: "#3730a3",
      label: "Institution Name",
      value: "St. Joseph's College for Women",
    },
    {
      Icon: MdSchool, iconBg: "#d1fae5", iconColor: "#059669",
      label: "Department",
      value: "Computer Science with Data Analytics",
    },
    {
      Icon: MdCalendarToday, iconBg: "#fef3c7", iconColor: "#d97706",
      label: "Academic Year",
      value: "2025 – 2026",
    },
    {
      Icon: MdPalette, iconBg: "#ede9fe", iconColor: "#7c3aed",
      label: "Theme",
      value: "Indigo Purple",
    },
  ]);

  const startEdit = (i) => {
    setEditingIndex(i);
    setEditValue(settings[i].value);
  };

  const saveEdit = (i) => {
    if (!editValue.trim()) return;
    const updated = [...settings];
    updated[i] = { ...updated[i], value: editValue.trim() };
    setSettings(updated);
    setEditingIndex(null);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditValue("");
  };

  return (
    <div className="pg-wrapper">

      {/* Hero */}
      <div className="page-hero">
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: "rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "1px solid rgba(255,255,255,0.2)",
            flexShrink: 0,
          }}>
            <MdSettings size={28} color="#fff" />
          </div>
          <div>
            <h2 style={{
              color: "#fff", fontFamily: "'Poppins',sans-serif",
              fontSize: 24, fontWeight: 800, margin: "0 0 5px",
              letterSpacing: "-0.3px",
            }}>
              Settings
            </h2>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, margin: 0 }}>
              Manage your application preferences and configurations
            </p>
          </div>
        </div>
      </div>

      {/* Settings cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {settings.map((s, i) => {
          const Icon = s.Icon;
          const isEditing = editingIndex === i;

          return (
            <div
              key={i}
              style={{
                background: "#fff",
                border: "1px solid #e0e7ff",
                borderRadius: 14,
                padding: "18px 20px",
                display: "flex", alignItems: "center", gap: 16,
                boxShadow: "0 2px 12px rgba(55,48,163,0.06)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!isEditing) {
                  e.currentTarget.style.transform = "translateX(4px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(55,48,163,0.1)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateX(0)";
                e.currentTarget.style.boxShadow = "0 2px 12px rgba(55,48,163,0.06)";
              }}
            >
              {/* Icon */}
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: s.iconBg,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <Icon size={22} color={s.iconColor} />
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: 10, color: "#9ca3af", fontWeight: 700, margin: "0 0 4px",
                  textTransform: "uppercase", letterSpacing: "0.8px",
                }}>
                  {s.label}
                </p>

                {isEditing ? (
                  <input
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(i);
                      if (e.key === "Escape") cancelEdit();
                    }}
                    style={{
                      fontSize: 14, fontWeight: 600,
                      color: "#1e1b6e", padding: "6px 12px",
                      border: "2px solid #6366f1",
                      borderRadius: 8, outline: "none",
                      background: "#f5f3ff",
                      width: "100%", boxSizing: "border-box",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  />
                ) : (
                  <p style={{
                    fontSize: 15, fontWeight: 700, color: "#1e1b6e", margin: 0,
                    fontFamily: "'Inter', sans-serif",
                  }}>
                    {s.value}
                  </p>
                )}
              </div>

              {/* Actions */}
              {isEditing ? (
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button
                    onClick={() => saveEdit(i)}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      padding: "7px 14px",
                      background: "linear-gradient(135deg, #059669, #10b981)",
                      color: "#fff", border: "none", borderRadius: 8,
                      fontWeight: 700, fontSize: 12, cursor: "pointer",
                      boxShadow: "0 3px 10px rgba(5,150,105,0.3)",
                    }}
                  >
                    <MdCheck size={15} /> Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      padding: "7px 12px",
                      background: "#f3f4f6", color: "#6b7280",
                      border: "none", borderRadius: 8,
                      fontWeight: 600, fontSize: 12, cursor: "pointer",
                    }}
                  >
                    <MdClose size={15} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startEdit(i)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "8px 16px",
                    background: "transparent",
                    color: "#6366f1",
                    border: "1.5px solid #c7d2fe",
                    borderRadius: 9, fontWeight: 700, fontSize: 12,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    fontFamily: "'Poppins', sans-serif",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f5f3ff";
                    e.currentTarget.style.borderColor = "#a5b4fc";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = "#c7d2fe";
                  }}
                >
                  <MdEdit size={14} /> Edit
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Info note */}
      <div style={{
        background: "linear-gradient(135deg, #fef3c7, #fde68a)",
        border: "1px solid #fcd34d",
        borderRadius: 12, padding: "14px 18px",
        display: "flex", alignItems: "center", gap: 12,
        fontSize: 13, color: "#92400e",
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9,
          background: "#d97706",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 16 }}>💡</span>
        </div>
        <p style={{ margin: 0, lineHeight: 1.5 }}>
          Changes to settings are saved <strong>locally</strong> in this session. Contact your system administrator to update institution-wide settings.
        </p>
      </div>
    </div>
  );
}

export default Settings;
