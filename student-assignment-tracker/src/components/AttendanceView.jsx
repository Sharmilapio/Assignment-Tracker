import { useState, useEffect } from "react";

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
    setLoggedIn((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
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

  return (
    <div className="attendance-view">
      <div className="attendance-header">
        <h2>Student Attendance</h2>

        <div className="attendance-stats">
          <span className="stat-box present">
            <strong>{loginCount}</strong> Present
          </span>

          <span className="stat-box absent">
            <strong>{absentCount}</strong> Absent
          </span>

          <span className="stat-box total">
            <strong>{students.length}</strong> Total
          </span>
        </div>
      </div>

      <div className="attendance-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: "16px",
        padding: "16px 0",
      }}>
        {[...students]
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((student) => (
            <div
              key={student.id}
              className={`attendance-card ${
                loggedIn[student.id] ? "logged-in" : "absent"
              }`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "16px 12px",
                borderRadius: "12px",
                background: loggedIn[student.id] ? "#f0fff4" : "#fff5f5",
                border: `2px solid ${loggedIn[student.id] ? "#68d391" : "#fc8181"}`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                transition: "transform 0.15s, box-shadow 0.15s",
                cursor: "pointer",
              }}
            >
              <label className="attendance-avatar-label">
                {photos[student.id] ? (
                  <img
                    src={photos[student.id]}
                    alt={student.name}
                    className="attendance-photo"
                  />
                ) : (
                  <div
                    className="attendance-avatar"
                    style={{
                      width: "75px",
                      height: "75px",
                      borderRadius: "50%",
                      background: "#ffffff",
                      color: "#2d3748",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                      fontWeight: "700",
                      fontFamily: "'Segoe UI', sans-serif",
                      border: "2px solid #e2e8f0",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                      letterSpacing: "1px",
                    }}
                  >
                    {student.name
                      .split(" ")
                      .map((word) => word[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handlePhotoUpload(student.id, e.target.files[0])
                  }
                  hidden
                  className="photo-input"
                />

                <div className="upload-hint">📸</div>
              </label>

              <button
                onClick={() => toggleLogin(student.id)}
                className="attendance-btn"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "center",
                  padding: "8px 0 0 0",
                }}
              >
                <div className="attendance-info" style={{ textAlign: "center" }}>
                  <div
                    className="attendance-name"
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    {student.name}
                  </div>

                  <div
                    className="attendance-status"
                    style={{
                      marginTop: "5px",
                    }}
                  >
                    {loggedIn[student.id]
                      ? "✅ Present"
                      : "❌ Absent"}
                  </div>
                </div>
              </button>
            </div>
          ))}
      </div>

      <div className="attendance-actions">
        <button
          className="primary-btn"
          onClick={() => {
            setLoggedIn({});
          }}
        >
          Clear All
        </button>

        <button
          className="primary-btn"
          onClick={() => {
            const allPresent = {};

            students.forEach((s) => {
              allPresent[s.id] = true;
            });

            setLoggedIn(allPresent);
          }}
        >
          Mark All Present
        </button>
      </div>
    </div>
  );
}

export default AttendanceView;