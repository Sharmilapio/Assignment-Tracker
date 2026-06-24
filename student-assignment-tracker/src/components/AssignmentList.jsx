 

function AssignmentList({ assignments, onDelete, onOpen }) {
  if (assignments.length === 0) {
    return (
      <div className="card empty-state">
        <p>No assignments yet. Add your first assignment above.</p>
      </div>
    );
  }

  return (
    <div className="assignment-grid">
      {assignments.map((a) => {
        const subs = Object.values(a.submissions || {});
        const total = subs.length;
        const submitted = subs.filter((s) => s.status === "Submitted").length;
        const pct = total > 0 ? Math.round((submitted / total) * 100) : 0;
        const isOverdue = new Date(a.dueDate) < new Date().setHours(0, 0, 0, 0);

        return (
          <div
            key={a.id}
            className="assignment-card"
            onClick={() => onOpen(a.id)}
          >
            <div className="assignment-card-top">
              <span className="meta-pill subject-pill">{a.subject}</span>
              <button
                className="delete-icon-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(a.id);
                }}
                title="Delete assignment"
              >
                ✕
              </button>
            </div>
            <h3>{a.title}</h3>
            <span className={`meta-pill ${isOverdue ? "overdue-pill" : "due-pill"}`}>
              Due {a.dueDate}
            </span>

            <div className="progress-row">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${pct}%` }} />
              </div>
              <span className="progress-text">
                {submitted}/{total} submitted
              </span>
            </div>

            <span className="open-link">View submissions →</span>
          </div>
        );
      })}
    </div>
  );
}

export default AssignmentList;