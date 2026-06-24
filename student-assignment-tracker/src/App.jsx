import { useState, useEffect } from "react";
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
      submissions,
    };
    setAssignments([...assignments, newAssignment]);
    if (!availableSubjects.includes(assignment.subject)) {
      setAvailableSubjects([...availableSubjects, assignment.subject]);
    }
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

  const filteredAssignments =
    filterSubject === "All"
      ? assignments
      : assignments.filter((a) => a.subject === filterSubject);

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
                        />
                        <AssignmentList
                          assignments={filteredAssignments}
                          onDelete={deleteAssignment}
                          onOpen={setActiveAssignmentId}
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
                      />
                    ) : (
                      <StudentProfile
                        student={activeStudent}
                        assignments={assignments}
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
  const handleFileChange = (studentId, file) => {
    if (!file) return;
    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      alert("Please attach a PDF file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onUpdate(assignment.id, studentId, {
        file: reader.result,
        fileName: file.name,
        status: "Submitted",
      });
    };
    reader.readAsDataURL(file);
  };

  const isOverdue =
    new Date(assignment.dueDate) < new Date().setHours(0, 0, 0, 0);

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

  return (
    <div className="submission-view">
      <button className="back-btn" onClick={onBack}>
        ← Back to assignments
      </button>
      <div className="submission-header">
        <h2>{assignment.title}</h2>
        <div className="assignment-summary">
          <span>Submitted: {summary.submitted}</span>
          <span>Pending: {summary.pending}</span>
          <span>Late: {summary.late}</span>
        </div>
        <div className="submission-meta">
          <span className="meta-pill subject-pill">{assignment.subject}</span>
          <span className={`meta-pill ${isOverdue ? "overdue-pill" : "due-pill"}`}>
            Due {assignment.dueDate}
          </span>
        </div>
      </div>

      <div className="submission-table-wrap">
        <table className="submission-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Student</th>
              <th>Status</th>
              <th>File</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, idx) => {
              const sub = assignment.submissions[student.id] || {
                status: "Pending",
                file: null,
                fileName: null,
              };
              return (
                <tr key={student.id}>
                  <td>{idx + 1}</td>
                  <td>{student.name}</td>
                  <td>
                    <select
                      value={sub.status}
                      onChange={(e) =>
                        onUpdate(assignment.id, student.id, {
                          status: e.target.value,
                        })
                      }
                      className={`status-select status-${sub.status.toLowerCase()}`}
                    >
                      <option value="Submitted">Submitted</option>
                      <option value="Pending">Pending</option>
                      <option value="Late">Late</option>
                    </select>
                  </td>
                  <td>
                    <label className="file-upload-btn">
                      {sub.fileName ? "Replace" : "Attach"}
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={(e) =>
                          handleFileChange(student.id, e.target.files[0])
                        }
                        hidden
                      />
                    </label>
                    {sub.fileName && (
                      <a
                        className="file-name-link"
                        href={sub.file}
                        download={sub.fileName}
                        title="Download attached file"
                      >
                        {sub.fileName}
                      </a>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;