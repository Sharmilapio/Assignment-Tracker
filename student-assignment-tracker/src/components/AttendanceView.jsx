import { useState, useEffect } from "react";
import { MdCameraAlt, MdCheckCircle, MdCancel, MdClearAll, MdDoneAll } from "react-icons/md";

function AttendanceView({ students }) {
  const [loggedIn, setLoggedIn] = useState(() => {
    const saved = localStorage.getItem("attendance");
    return saved ? JSON.parse(saved) : {};
  });

  const [photos, setPhotos] = useState({});

  useEffect(() => {
    localStorage.setItem("attendance", JSON.stringify(loggedIn));
  }, [loggedIn]);

  const toggleLogin = (studentId) => {
    setLoggedIn((prev) => ({ ...prev, [studentId]: !prev[studentId] }));
  };

  const handlePhotoUpload = (studentId, file) => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setPhotos((prev) => {
      if (prev[studentId]) URL.revokeObjectURL(prev[studentId]);
      return { ...prev, [studentId]: objectUrl };
    });
  };

  const loginCount = Object.values(loggedIn).filter(Boolean).length;
  const absentCount = students.length - loginCount;
  const attendancePct = students.length > 0 ? Math.round((loginCount / students.length) * 100) : 0;

  return (
    <div className="attendance-view">

      {/* Stats header */}
      <div style={{
        background: "#fff",
        border: "1px solid #e0e7ff",
        borderRadius: 16,
        padding: "20px 24px",
        boxShadow: "0 2px 12px rgba(55,48,163,0.07)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 16, marginBottom: 16,
        }}>
          <div>
            <h2 style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 20, fontWeight: 800, color: "#1e1b6e", margin: "0 0 4px",
            }}>
              Attendance
            </h2>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: 0, fontWeight: 500 }}>
              Click on a student card to toggle their attendance
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              { label: "Present", value: loginCount, bg: "#d1fae5", color: "#059669", Icon: MdCheckCircle },
              { label: "Absent",  value: absentCount, bg: "#fee2e2", color: "#dc2626", Icon: MdCancel },
              { label: "Total",   value: students.length, bg: "#e0e7ff", color: "#3730a3", Icon: null },
            ].map((s) => (
              <div key={s.label} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "8px 16px",
                background: s.bg, borderRadius: 10,
              }}>
                {s.Icon && <s.Icon size={16} color={s.color} />}
                <span style={{ fontSize: 20, fontWeight: 800, color: s.color, fontFamily: "'Poppins', sans-serif", lineHeight: 1 }}>
                  {s.value}
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: s.color }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>Attendance Rate</span>
            <span style={{ fontSize: 13, color: "#3730a3", fontWeight: 800 }}>{attendancePct}%</span>
          </div>
          <div style={{ height: 8, background: "#f3f4f6", borderRadius: 99, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${attendancePct}%`,
              background: attendancePct >= 75
                ? "linear-gradient(90deg, #059669, #34d399)"
                : attendancePct >= 50
                ? "linear-gradient(90deg, #d97706, #fbbf24)"
                : "linear-gradient(90deg, #dc2626, #f87171)",
              borderRadius: 99,
              transition: "width 0.6s ease",
            }} />
          </div>
        </div>
      </div>

      {/* Student Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
        gap: 14,
      }}>
        {[...students]
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((student) => {
            const isPresent = loggedIn[student.id];
            const initials = student.name
              .split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

            return (
              <div
                key={student.id}
                onClick={() => toggleLogin(student.id)}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  padding: "18px 12px 14px",
                  borderRadius: 14,
                  background: isPresent ? "#f0fdf4" : "#fff",
                  border: `2px solid ${isPresent ? "#4ade80" : "#e5e7eb"}`,
                  boxShadow: isPresent
                    ? "0 4px 16px rgba(74,222,128,0.2)"
                    : "0 2px 8px rgba(0,0,0,0.05)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  position: "relative",
                  gap: 10,
                }}
                onMouseEnter={(e) => {
                  if (!isPresent) {
                    e.currentTarget.style.borderColor = "#c7d2fe";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(55,48,163,0.12)";
                  } else {
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(74,222,128,0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isPresent) {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
                  } else {
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(74,222,128,0.2)";
                  }
                }}
              >
                {/* Status badge */}
                <div style={{
                  position: "absolute", top: 8, right: 8,
                  width: 18, height: 18, borderRadius: "50%",
                  background: isPresent ? "#4ade80" : "#f87171",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: `0 2px 6px ${isPresent ? "rgba(74,222,128,0.4)" : "rgba(248,113,113,0.4)"}`,
                }}>
                  {isPresent
                    ? <MdCheckCircle size={12} color="#fff" />
                    : <MdCancel size={12} color="#fff" />
                  }
                </div>

                {/* Avatar / Photo */}
                <label style={{ cursor: "pointer", position: "relative" }}>
                  {photos[student.id] ? (
                    <img
                      src={photos[student.id]}
                      alt={student.name}
                      style={{
                        width: 70, height: 70, borderRadius: "50%",
                        objectFit: "cover",
                        border: `3px solid ${isPresent ? "#4ade80" : "#e5e7eb"}`,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                  ) : (
                    <div style={{
                      width: 70, height: 70, borderRadius: "50%",
                      background: isPresent
                        ? "linear-gradient(135deg, #4ade80, #059669)"
                        : "linear-gradient(135deg, #c7d2fe, #a5b4fc)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 22, fontWeight: 800, color: "#fff",
                      fontFamily: "'Poppins', sans-serif",
                      border: `3px solid ${isPresent ? "#4ade80" : "#c7d2fe"}`,
                      boxShadow: `0 4px 14px ${isPresent ? "rgba(74,222,128,0.3)" : "rgba(99,102,241,0.15)"}`,
                      transition: "all 0.2s",
                    }}>
                      {initials}
                    </div>
                  )}

                  {/* Camera overlay */}
                  <div style={{
                    position: "absolute", bottom: 0, right: 0,
                    width: 22, height: 22, borderRadius: "50%",
                    background: "#fff",
                    border: "2px solid #e0e7ff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <MdCameraAlt size={11} color="#6366f1" />
                  </div>

                  <input
                    type="file" accept="image/*"
                    onChange={(e) => {
                      e.stopPropagation();
                      handlePhotoUpload(student.id, e.target.files[0]);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    hidden
                  />
                </label>

                {/* Name */}
                <div style={{ textAlign: "center" }}>
                  <div style={{
                    fontSize: 12, fontWeight: 700,
                    color: "#1e1b6e",
                    fontFamily: "'Poppins', sans-serif",
                    lineHeight: 1.3,
                  }}>
                    {student.name}
                  </div>
                  <div style={{
                    fontSize: 11, fontWeight: 600, marginTop: 3,
                    color: isPresent ? "#059669" : "#ef4444",
                  }}>
                    {isPresent ? "Present" : "Absent"}
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", paddingBottom: 8 }}>
        <button
          onClick={() => {
            const all = {};
            students.forEach((s) => { all[s.id] = true; });
            setLoggedIn(all);
          }}
          style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "10px 22px",
            background: "linear-gradient(135deg, #059669, #10b981)",
            color: "#fff", border: "none", borderRadius: 10,
            fontWeight: 700, fontSize: 13, cursor: "pointer",
            fontFamily: "'Poppins', sans-serif",
            boxShadow: "0 4px 12px rgba(5,150,105,0.3)",
            transition: "opacity 0.15s, transform 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          <MdDoneAll size={16} /> Mark All Present
        </button>

        <button
          onClick={() => setLoggedIn({})}
          style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "10px 22px",
            background: "#fff",
            color: "#dc2626",
            border: "1.5px solid #fecaca",
            borderRadius: 10,
            fontWeight: 700, fontSize: 13, cursor: "pointer",
            fontFamily: "'Poppins', sans-serif",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#fef2f2";
            e.currentTarget.style.borderColor = "#f87171";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#fff";
            e.currentTarget.style.borderColor = "#fecaca";
          }}
        >
          <MdClearAll size={16} /> Clear All
        </button>
      </div>
    </div>
  );
}

export default AttendanceView;
