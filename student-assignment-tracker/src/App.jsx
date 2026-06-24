import { useState, useEffect, useMemo } from "react";
import AppNavbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AppHeader from "./components/Header";
import Dashboard from "./components/Dashboard";
import StudentSetup from "./components/StudentSetup";
import AssignmentForm from "./components/AssignmentForm";
import FilterBar from "./components/FilterBar";
import AssignmentList from "./components/AssignmentList";
import StudentRoster from "./components/StudentRoster";
import StudentProfile from "./components/StudentProfile";
import AttendanceView from "./components/AttendanceView";
import Reports from "./components/Reports";
import Settings from "./components/Settings";
import HelpSupport from "./components/HelpSupport";
import "./App.css";

function App() {
  const defaultSubjects = [
    "Python",
    "Data Structure",
    "Data Warehousing",
    "Data Mining",
    "Deep Learning",
  ];

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem("students");
    return saved ? JSON.parse(saved) : [];
  });
  const [assignments, setAssignments] = useState(() => {
    const saved = localStorage.getItem("assignments");
    return saved ? JSON.parse(saved) : [];
  });
  const [availableSubjects, setAvailableSubjects] = useState(() => {
    const saved = localStorage.getItem("subjects");
    if (saved) return JSON.parse(saved);
    return defaultSubjects;
  });
  const [filterSubject, setFilterSubject] = useState("All");
  const [assignmentSearch, setAssignmentSearch] = useState("");
  const [assignmentSort, setAssignmentSort] = useState("newest"); // newest | oldest | az
  const [activeAssignmentId, setActiveAssignmentId] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeStudentId, setActiveStudentId] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem("assignments", JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem("subjects", JSON.stringify(availableSubjects));
  }, [availableSubjects]);

  const saveStudents = (names) => {
    setStudents(names.map((name, i) => ({ id: i + 1, name })));
  };

  const addAssignment = (assignment) => {
    const submissions = {};
    students.forEach((s) => {
      submissions[s.id] = { status: "Pending", file: null, fileName: null };
    });
    const newAssignment = {
      id: Date.now(),
      title: assignment.title,
      subject: assignment.subject,
      dueDate: assignment.dueDate,
      description: assignment.description || "",
      submissions,
    };
    setAssignments([...assignments, newAssignment]);
    if (!availableSubjects.includes(assignment.subject)) {
      setAvailableSubjects([...availableSubjects, assignment.subject]);
    }
  };

  const editAssignment = (id, updates) => {
    setAssignments(assignments.map((a) =>
      a.id === id ? { ...a, ...updates } : a
    ));
  };

  const deleteAssignment = (id) => {
    setAssignments(assignments.filter((a) => a.id !== id));
    if (activeAssignmentId === id) setActiveAssignmentId(null);
  };

  const updateSubmission = (assignmentId, studentId, updates) => {
    setAssignments(
      assignments.map((a) => {
        if (a.id !== assignmentId) return a;
        return {
          ...a,
          submissions: {
            ...a.submissions,
            [studentId]: { ...a.submissions[studentId], ...updates },
          },
        };
      })
    );
  };

  const subjectsForFilter = [
    "All",
    ...new Set([...availableSubjects, ...assignments.map((a) => a.subject)]),
  ];

  // Filter → search → sort
  const filteredAssignments = useMemo(() => {
    let list = filterSubject === "All"
      ? assignments
      : assignments.filter((a) => a.subject === filterSubject);

    if (assignmentSearch.trim()) {
      const q = assignmentSearch.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.subject.toLowerCase().includes(q) ||
          (a.description || "").toLowerCase().includes(q)
      );
    }

    if (assignmentSort === "newest") {
      list = [...list].sort((a, b) => b.id - a.id);
    } else if (assignmentSort === "oldest") {
      list = [...list].sort((a, b) => a.id - b.id);
    } else if (assignmentSort === "az") {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [assignments, filterSubject, assignmentSearch, assignmentSort]);

  const activeAssignment = assignments.find((a) => a.id === activeAssignmentId);
  const activeStudent = students.find((s) => s.id === activeStudentId);

  const stats = { total: 0, submitted: 0, pending: 0, late: 0 };
  assignments.forEach((assignment) => {
    const dueDate = new Date(assignment.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    Object.values(assignment.submissions || {}).forEach((sub) => {
      stats.total++;
      if (sub.status === "Submitted") stats.submitted++;
      else if (dueDate < today) stats.late++;
      else stats.pending++;
    });
  });

  const goToTab = (tab) => {
    setActiveTab(tab);
    setActiveAssignmentId(null);
    setActiveStudentId(null);
  };

  const handleLogout = () => {
    if (!window.confirm("Logout will clear session data and return to setup. Continue?")) return;
    localStorage.removeItem("students");
    localStorage.removeItem("assignments");
    localStorage.removeItem("subjects");
    localStorage.removeItem("attendance");
    localStorage.removeItem("studentPhotos");
    setStudents([]);
    setAssignments([]);
    setAvailableSubjects(defaultSubjects);
    setFilterSubject("All");
    setActiveAssignmentId(null);
    setActiveStudentId(null);
    setActiveTab("dashboard");
  };

  return (
    <div className="app-layout">
      <div className="app-container">
        <Sidebar
          activeTab={activeTab}
          onTabChange={goToTab}
          showMenu={students.length > 0}
          onLogout={handleLogout}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <div className={`app ${!sidebarCollapsed ? "expanded" : ""}`}>
          <AppNavbar />
          <AppHeader 
            activeTab={activeTab}
            onTabChange={goToTab}
            showTabs={
              students.length > 0 &&
              (activeTab === "assignments" ||
                activeTab === "attendance" ||
                activeTab === "students")
            }
          />
          <main className={`main-content ${activeTab === "dashboard" ? "dashboard-active" : ""}`}>
            {students.length === 0 ? (
              <StudentSetup onSave={saveStudents} />
            ) : (
              <>
                {activeTab === "dashboard" && (
                  <Dashboard
                    stats={stats}
                    studentCount={students.length}
                    assignmentCount={assignments.length}
                    onTabChange={goToTab}
                  />
                )}

                {activeTab === "assignments" && (
                  <>
                    {!activeAssignment ? (
                      <>
                        <AssignmentForm onAdd={addAssignment} subjects={availableSubjects} />
                        <FilterBar
                          subjects={subjectsForFilter}
                          selected={filterSubject}
                          onChange={setFilterSubject}
                          search={assignmentSearch}
                          onSearch={setAssignmentSearch}
                          sortOrder={assignmentSort}
                          onSort={setAssignmentSort}
                          total={assignments.length}
                          filtered={filteredAssignments.length}
                        />
                        <AssignmentList
                          assignments={filteredAssignments}
                          onDelete={deleteAssignment}
                          onOpen={setActiveAssignmentId}
                          onEdit={editAssignment}
                        />
                      </>
                    ) : (
                      <SubmissionView
                        assignment={activeAssignment}
                        students={students}
                        onBack={() => setActiveAssignmentId(null)}
                        onUpdate={updateSubmission}
                      />
                    )}
                  </>
                )}

                {activeTab === "students" && (
                  <>
                    {!activeStudent ? (
                      <StudentRoster
                        students={students}
                        assignments={assignments}
                        onOpen={setActiveStudentId}
                        onAddStudent={(name) => {
                          const newId = Date.now();
                          const newStudent = { id: newId, name };
                          const newStudents = [...students, newStudent];
                          setStudents(newStudents);
                          setAssignments(assignments.map((a) => ({
                            ...a,
                            submissions: {
                              ...a.submissions,
                              [newId]: { status: "Pending", file: null, fileName: null },
                            },
                          })));
                        }}
                        onDeleteStudent={(id) => {
                          setStudents(students.filter((s) => s.id !== id));
                          if (activeStudentId === id) setActiveStudentId(null);
                        }}
                      />
                    ) : (
                      <StudentProfile
                        student={activeStudent}
                        assignments={assignments}
                        students={students}
                        onBack={() => setActiveStudentId(null)}
                        onUpdate={updateSubmission}
                      />
                    )}
                  </>
                )}

                {activeTab === "attendance" && (
                  <AttendanceView students={students} />
                )}

                {activeTab === "reports" && <Reports />}

                {activeTab === "settings" && <Settings />}

                {activeTab === "help" && <HelpSupport />}

                {activeTab !== "dashboard" && (
                  <div className="manage-students-link">
                    <button
                      className="link-btn"
                      onClick={() => {
                        if (window.confirm("Re-setting students will reset all assignment submission lists. Continue?")) {
                          setStudents([]);
                          setAssignments([]);
                        }
                      }}
                    >
                      Reset student list
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function SubmissionView({ assignment, students, onBack, onUpdate }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2400);
  };

  const handleFileChange = (studentId, file) => {
    if (!file) return;
    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) { showToast("⚠️ Only PDF files are supported."); return; }
    const reader = new FileReader();
    reader.onload = () => {
      onUpdate(assignment.id, studentId, {
        file: reader.result, fileName: file.name, status: "Submitted",
      });
      showToast("✅ File attached and marked as Submitted.");
    };
    reader.readAsDataURL(file);
  };

  const handleBulkStatus = (status) => {
    const targets = visibleStudents.filter((s) => {
      const sub = assignment.submissions[s.id] || { status: "Pending" };
      return sub.status !== status;
    });
    targets.forEach((s) => onUpdate(assignment.id, s.id, { status }));
    showToast(`✅ ${targets.length} student${targets.length !== 1 ? "s" : ""} marked as ${status}.`);
  };

  const isOverdue = new Date(assignment.dueDate) < new Date().setHours(0, 0, 0, 0);

  const summary = { submitted: 0, pending: 0, late: 0 };
  students.forEach((student) => {
    const sub = assignment.submissions[student.id] || { status: "Pending" };
    const dueDate = new Date(assignment.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (sub.status === "Submitted") summary.submitted++;
    else if (dueDate < today) summary.late++;
    else summary.pending++;
  });

  const submittedPct = students.length > 0
    ? Math.round((summary.submitted / students.length) * 100) : 0;

  // Filter students by search + status tab
  const visibleStudents = students.filter((s) => {
    const sub = assignment.submissions[s.id] || { status: "Pending" };
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || sub.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusCfg = {
    Submitted: { color: "#059669", bg: "#d1fae5", border: "#a7f3d0" },
    Pending:   { color: "#d97706", bg: "#fef3c7", border: "#fde68a" },
    Late:      { color: "#dc2626", bg: "#fee2e2", border: "#fecaca" },
  };

  return (
    <div className="submission-view">
      {/* Back */}
      <button className="back-btn" onClick={onBack}>← Back to assignments</button>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          background: "#1e1b6e", color: "#fff",
          padding: "11px 22px", borderRadius: 10,
          fontSize: 13, fontWeight: 600, zIndex: 9999,
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          animation: "fadeSlideUp 0.2s ease",
        }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="submission-header">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <h2 style={{ margin: "0 0 8px" }}>{assignment.title}</h2>
            {assignment.description && (
              <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 10px", lineHeight: 1.5 }}>
                {assignment.description}
              </p>
            )}
            <div className="submission-meta" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span className="meta-pill subject-pill">{assignment.subject}</span>
              <span className={`meta-pill ${isOverdue ? "overdue-pill" : "due-pill"}`}>
                📅 {isOverdue ? "Overdue · " : "Due "}{assignment.dueDate}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", flexShrink: 0 }}>
            {[
              { label: "Submitted", value: summary.submitted, ...statusCfg.Submitted },
              { label: "Pending",   value: summary.pending,   ...statusCfg.Pending },
              { label: "Late",      value: summary.late,      ...statusCfg.Late },
            ].map((s) => (
              <button
                key={s.label}
                onClick={() => setStatusFilter(statusFilter === s.label ? "All" : s.label)}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  padding: "10px 16px", background: s.bg,
                  border: `2px solid ${statusFilter === s.label ? s.color : s.border}`,
                  borderRadius: 10, minWidth: 68, cursor: "pointer",
                  transition: "all 0.15s",
                  boxShadow: statusFilter === s.label ? `0 4px 12px ${s.color}30` : "none",
                  transform: statusFilter === s.label ? "translateY(-2px)" : "none",
                }}
              >
                <span style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: "'Poppins',sans-serif", lineHeight: 1 }}>
                  {s.value}
                </span>
                <span style={{ fontSize: 10, color: s.color, fontWeight: 700, marginTop: 3, textTransform: "uppercase" }}>
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>Submission Progress</span>
            <span style={{ fontSize: 13, color: "#3730a3", fontWeight: 800 }}>{submittedPct}%</span>
          </div>
          <div style={{ height: 8, background: "#f3f4f6", borderRadius: 99, overflow: "hidden", display: "flex" }}>
            <div style={{ height: "100%", width: `${(summary.submitted / students.length) * 100}%`, background: "#059669", transition: "width 0.6s ease" }} />
            <div style={{ height: "100%", width: `${(summary.late / students.length) * 100}%`, background: "#ef4444", transition: "width 0.6s ease" }} />
            <div style={{ height: "100%", width: `${(summary.pending / students.length) * 100}%`, background: "#fbbf24", transition: "width 0.6s ease" }} />
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 6 }}>
            {[
              { color: "#059669", label: "Submitted" },
              { color: "#ef4444", label: "Late" },
              { color: "#fbbf24", label: "Pending" },
            ].map((l) => (
              <span key={l.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#6b7280", fontWeight: 600 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: l.color, display: "inline-block" }} />
                {l.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Toolbar: search + bulk actions */}
      <div style={{
        background: "#fff", border: "1px solid #e0e7ff",
        borderRadius: 12, padding: "12px 16px",
        display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
        boxShadow: "0 2px 8px rgba(55,48,163,0.05)",
      }}>
        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: 160 }}>
          <span style={{
            position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
            color: "#9ca3af", pointerEvents: "none", display: "flex",
          }}>
            🔍
          </span>
          <input
            type="text"
            placeholder="Search student…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "8px 10px 8px 32px",
              border: "1.5px solid #e0e7ff", borderRadius: 8,
              fontSize: 12, color: "#374151", background: "#f9f8ff",
              outline: "none", boxSizing: "border-box",
              fontFamily: "'Inter', sans-serif",
              transition: "border-color 0.18s",
            }}
            onFocus={(e) => { e.target.style.borderColor = "#6366f1"; e.target.style.background = "#fff"; }}
            onBlur={(e) => { e.target.style.borderColor = "#e0e7ff"; e.target.style.background = "#f9f8ff"; }}
          />
        </div>

        <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, whiteSpace: "nowrap" }}>
          {visibleStudents.length} of {students.length}
          {statusFilter !== "All" && ` · ${statusFilter}`}
        </span>

        {/* Bulk actions */}
        <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
          {[
            { label: "Mark All Submitted", status: "Submitted", color: "#059669", bg: "#d1fae5" },
            { label: "Mark All Late",      status: "Late",      color: "#dc2626", bg: "#fee2e2" },
          ].map((b) => (
            <button
              key={b.status}
              onClick={() => handleBulkStatus(b.status)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "7px 14px",
                background: b.bg, color: b.color,
                border: `1.5px solid ${b.color}33`,
                borderRadius: 8, fontWeight: 700, fontSize: 11,
                cursor: "pointer", fontFamily: "'Poppins', sans-serif",
                transition: "all 0.15s", whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = b.color;
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = b.bg;
                e.currentTarget.style.color = b.color;
              }}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="submission-table-wrap">
        <table className="submission-table">
          <thead>
            <tr>
              <th style={{ width: 44 }}>#</th>
              <th>Student</th>
              <th style={{ width: 160 }}>Status</th>
              <th>Attachment</th>
            </tr>
          </thead>
          <tbody>
            {visibleStudents.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: "32px", color: "#9ca3af", fontSize: 13, fontWeight: 500 }}>
                  No students match your search.
                </td>
              </tr>
            ) : (
              visibleStudents.map((student, idx) => {
                const sub = assignment.submissions[student.id] || {
                  status: "Pending", file: null, fileName: null,
                };
                const cfg = statusCfg[sub.status] || statusCfg.Pending;

                return (
                  <tr key={student.id}>
                    <td style={{ color: "#9ca3af", fontWeight: 600, textAlign: "center" }}>
                      {idx + 1}
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: "50%",
                          background: "linear-gradient(135deg, #3730a3, #6366f1)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 13, fontWeight: 800, color: "#fff",
                          fontFamily: "'Poppins',sans-serif", flexShrink: 0,
                          boxShadow: "0 2px 8px rgba(99,102,241,0.25)",
                        }}>
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600, color: "#1e1b3a", fontSize: 13 }}>{student.name}</span>
                      </div>
                    </td>
                    <td>
                      <select
                        value={sub.status}
                        onChange={(e) => onUpdate(assignment.id, student.id, { status: e.target.value })}
                        style={{
                          padding: "7px 12px",
                          border: `1.5px solid ${cfg.border}`,
                          borderRadius: 8,
                          fontSize: 12, fontWeight: 700,
                          fontFamily: "'Inter', sans-serif",
                          cursor: "pointer",
                          color: cfg.color,
                          background: cfg.bg,
                          outline: "none",
                          appearance: "none",
                          WebkitAppearance: "none",
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(cfg.color)}' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 8px center",
                          paddingRight: 28,
                          transition: "all 0.15s",
                          minWidth: 130,
                        }}
                      >
                        <option value="Submitted">✓ Submitted</option>
                        <option value="Pending">⏳ Pending</option>
                        <option value="Late">⚠ Late</option>
                      </select>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <label style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          padding: "6px 12px",
                          background: "#f5f3ff", color: "#6366f1",
                          border: "1.5px solid #c7d2fe",
                          borderRadius: 8, fontSize: 12, fontWeight: 700,
                          cursor: "pointer", transition: "all 0.15s",
                          fontFamily: "'Inter', sans-serif",
                        }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "#e0e7ff"; e.currentTarget.style.borderColor = "#a5b4fc"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "#f5f3ff"; e.currentTarget.style.borderColor = "#c7d2fe"; }}
                        >
                          📎 {sub.fileName ? "Replace" : "Attach PDF"}
                          <input
                            type="file" accept=".pdf,application/pdf" hidden
                            onChange={(e) => handleFileChange(student.id, e.target.files[0])}
                          />
                        </label>
                        {sub.fileName && (
                          <a
                            href={sub.file}
                            download={sub.fileName}
                            style={{
                              display: "inline-flex", alignItems: "center", gap: 4,
                              fontSize: 11, color: "#059669", fontWeight: 700,
                              textDecoration: "none", padding: "6px 10px",
                              background: "#f0fdf4", borderRadius: 8,
                              border: "1px solid #bbf7d0",
                            }}
                          >
                            ↓ {sub.fileName.length > 16 ? sub.fileName.slice(0, 16) + "…" : sub.fileName}
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translate(-50%, 12px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}

export default App;