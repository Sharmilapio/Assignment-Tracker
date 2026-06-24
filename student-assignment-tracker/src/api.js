

const KEYS = {
  students:    "students",
  assignments: "assignments",
  subjects:    "subjects",
  attendance:  "attendance",   
};



function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function todayISO() {
  return new Date().toISOString().split("T")[0];
}


export async function fetchStudents() {
  return read(KEYS.students, []);
}

 
export async function createStudent(name) {
  const students = read(KEYS.students, []);
  const newStudent = { id: Date.now(), name };
  write(KEYS.students, [...students, newStudent]);
  return newStudent;
}


export async function deleteStudent(id) {
  const students = read(KEYS.students, []);
  write(KEYS.students, students.filter((s) => s.id !== id));
  return { success: true };
}


export async function seedStudents(names) {
  const students = names.map((name, i) => ({ id: i + 1, name }));
  write(KEYS.students, students);
  return students;
}

export async function fetchAssignments() {
  return read(KEYS.assignments, []);
}


export async function createAssignment({ title, subject, dueDate, description }, students) {
  const submissions = {};
  students.forEach((s) => {
    submissions[s.id] = { status: "Pending", file: null, fileName: null };
  });
  const assignment = { id: Date.now(), title, subject, dueDate, description: description || "", submissions };
  const existing = read(KEYS.assignments, []);
  write(KEYS.assignments, [...existing, assignment]);
  return assignment;
}


export async function updateAssignment(id, updates) {
  const assignments = read(KEYS.assignments, []);
  const updated = assignments.map((a) => (a.id === id ? { ...a, ...updates } : a));
  write(KEYS.assignments, updated);
  return updated.find((a) => a.id === id);
}


export async function deleteAssignment(id) {
  const assignments = read(KEYS.assignments, []);
  write(KEYS.assignments, assignments.filter((a) => a.id !== id));
  return { success: true };
}


export async function updateSubmission(assignmentId, studentId, updates) {
  const assignments = read(KEYS.assignments, []);
  const updated = assignments.map((a) => {
    if (a.id !== assignmentId) return a;
    return {
      ...a,
      submissions: {
        ...a.submissions,
        [studentId]: { ...(a.submissions[studentId] || {}), ...updates },
      },
    };
  });
  write(KEYS.assignments, updated);
  return { success: true };
}


export async function fetchAssignmentsByDate(dateISO) {
  const all = read(KEYS.assignments, []);
  if (!dateISO) return all;
  return all.filter((a) => a.dueDate === dateISO);
}



export const DEFAULT_SUBJECTS = [
  "Python",
  "Data Structure",
  "Data Warehousing",
  "Data Mining",
  "Deep Learning",
];


export async function fetchSubjects() {
  return read(KEYS.subjects, DEFAULT_SUBJECTS);
}


export async function addSubject(name) {
  const subjects = read(KEYS.subjects, DEFAULT_SUBJECTS);
  if (subjects.includes(name)) return subjects;
  const updated = [...subjects, name];
  write(KEYS.subjects, updated);
  return updated;
}


export async function fetchAllAttendance() {
  return read(KEYS.attendance, {});
}


export async function fetchAttendanceByDate(dateISO) {
  const all = read(KEYS.attendance, {});
  return all[dateISO] || {};
}


export async function saveAttendanceForDate(dateISO, record) {
  const all = read(KEYS.attendance, {});
  all[dateISO] = record;
  write(KEYS.attendance, all);
  return { success: true, date: dateISO, record };
}

export async function clearAttendanceForDate(dateISO) {
  const all = read(KEYS.attendance, {});
  delete all[dateISO];
  write(KEYS.attendance, all);
  return { success: true };
}


export async function fetchAttendanceSummary() {
  const all = read(KEYS.attendance, {});
  const summary = {};
  Object.entries(all).forEach(([date, record]) => {
    Object.entries(record).forEach(([sid, present]) => {
      if (!summary[sid]) summary[sid] = { present: 0, absent: 0, dates: [] };
      if (present) summary[sid].present++;
      else summary[sid].absent++;
      summary[sid].dates.push(date);
    });
  });
  return summary;
}


export async function fetchAttendanceDates() {
  const all = read(KEYS.attendance, {});
  return Object.keys(all).sort((a, b) => b.localeCompare(a));
}



export const INSTITUTION = {
  name:       "St. Joseph's College for Women",
  department: "Computer Science with Data Analytics",
  year:       "2025 – 2026",
};
