import { useState } from "react";
import {
  MdHelpOutline, MdExpandMore, MdExpandLess,
  MdEmail, MdPhone, MdAccessTime,
  MdAssignment, MdCheckCircle, MdPeople, MdBarChart,
  MdSettings, MdBook,
} from "react-icons/md";

const faqs = [
  {
    cat: "Assignments",
    Icon: MdAssignment,
    color: "#3730a3",
    items: [
      { q: "How do I add an assignment?", a: "Go to the Assignments tab, fill in the title, subject, and due date in the form at the top, then click Add. You can also press Ctrl + Enter to submit quickly." },
      { q: "How do I edit an assignment?", a: "On any assignment card, click the pencil icon to edit the title and due date inline. Press Enter or click Save to confirm." },
      { q: "How do I delete an assignment?", a: "Click the trash icon on any assignment card. A confirmation panel will appear — confirm to permanently delete it and all its submission records." },
      { q: "How do I view student submissions?", a: "Click on any assignment card to open the submission view. You can see each student's status, attach PDF files, and use bulk actions." },
      { q: "Can I filter assignments by subject?", a: "Yes — use the subject pill filters below the form to instantly filter assignments by subject. You can also search by title or description." },
    ],
  },
  {
    cat: "Attendance",
    Icon: MdCheckCircle,
    color: "#059669",
    items: [
      { q: "How do I mark attendance?", a: "Go to the Attendance tab and click on any student card to toggle them between Present and Absent." },
      { q: "How do I mark all students present?", a: "Click the Mark All Present button at the bottom of the Attendance page." },
      { q: "How do I add a student photo?", a: "On the Attendance page, click the camera icon on any student card to upload a photo from your device." },
      { q: "Is attendance saved automatically?", a: "Yes, attendance is saved to your browser's local storage automatically when you toggle a student." },
    ],
  },
  {
    cat: "Students",
    Icon: MdPeople,
    color: "#d97706",
    items: [
      { q: "How do I add a new student?", a: "Go to the Students tab and click Add Student. Enter the student's full name and press Enter or click Add." },
      { q: "How do I remove a student?", a: "On the Students page, click the trash icon next to any student card. Confirm the removal in the dialog." },
      { q: "How do I view a student's submissions?", a: "Click on any student card to open their individual profile, which shows all assignment submissions and statuses." },
    ],
  },
  {
    cat: "Reports",
    Icon: MdBarChart,
    color: "#7c3aed",
    items: [
      { q: "How do I download a report?", a: "Go to the Reports tab. Each report has CSV and PDF download buttons. Click the format you need." },
      { q: "What reports are available?", a: "Three reports are available: Assignment Report, Attendance Report, and Student Performance report." },
    ],
  },
  {
    cat: "General",
    Icon: MdSettings,
    color: "#6b7280",
    items: [
      { q: "How do I reset the student list?", a: "Scroll to the bottom of any page and click Reset student list. This clears all students and assignments." },
      { q: "Is my data saved between sessions?", a: "Yes — all data (students, assignments, attendance) is saved in your browser's local storage and persists across sessions." },
      { q: "How do I log out?", a: "Click the Logout button at the bottom of the sidebar. This clears all session data." },
    ],
  },
];

function HelpSupport() {
  const [openKey, setOpenKey] = useState(null); // "catIdx-itemIdx"
  const [activeCategory, setActiveCategory] = useState(null);

  const toggle = (key) => setOpenKey(openKey === key ? null : key);

  const displayedFaqs = activeCategory !== null
    ? faqs.filter((_, i) => i === activeCategory)
    : faqs;

  return (
    <div className="pg-wrapper">

      {/* Hero */}
      <div className="page-hero">
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: "rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "1px solid rgba(255,255,255,0.2)", flexShrink: 0,
          }}>
            <MdHelpOutline size={28} color="#fff" />
          </div>
          <div>
            <h2 style={{
              color: "#fff", fontFamily: "'Poppins',sans-serif",
              fontSize: 22, fontWeight: 800, margin: "0 0 5px", letterSpacing: "-0.3px",
            }}>
              Help & Support
            </h2>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, margin: 0 }}>
              Browse guides, FAQs and contact information for the Tracking Hub
            </p>
          </div>
        </div>

        {/* Category chips */}
        <div style={{ display: "flex", gap: 8, marginTop: 18, flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveCategory(null)}
            style={{
              padding: "6px 14px", borderRadius: 99, border: "none",
              background: activeCategory === null ? "#fff" : "rgba(255,255,255,0.15)",
              color: activeCategory === null ? "#3730a3" : "rgba(255,255,255,0.85)",
              fontWeight: 700, fontSize: 12, cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            All Topics
          </button>
          {faqs.map((cat, i) => {
            const Icon = cat.Icon;
            return (
              <button
                key={cat.cat}
                onClick={() => setActiveCategory(activeCategory === i ? null : i)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "6px 14px", borderRadius: 99, border: "none",
                  background: activeCategory === i ? "#fff" : "rgba(255,255,255,0.15)",
                  color: activeCategory === i ? cat.color : "rgba(255,255,255,0.85)",
                  fontWeight: 700, fontSize: 12, cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                <Icon size={13} />
                {cat.cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick reference cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: 12,
      }}>
        {[
          { Icon: MdAssignment,  label: "Create Assignment",  tip: "Form at top of Assignments tab",  color: "#3730a3", bg: "#e0e7ff" },
          { Icon: MdCheckCircle, label: "Mark Attendance",    tip: "Click student card to toggle",   color: "#059669", bg: "#d1fae5" },
          { Icon: MdPeople,      label: "View Student",       tip: "Click any student card",         color: "#d97706", bg: "#fef3c7" },
          { Icon: MdBook,        label: "Track Submission",   tip: "Open assignment → see table",    color: "#7c3aed", bg: "#ede9fe" },
        ].map((c) => {
          const Icon = c.Icon;
          return (
            <div key={c.label} style={{
              background: "#fff", border: "1px solid #e0e7ff",
              borderRadius: 12, padding: "16px",
              display: "flex", gap: 12, alignItems: "flex-start",
              boxShadow: "0 2px 8px rgba(55,48,163,0.05)",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(55,48,163,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(55,48,163,0.05)";
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 9,
                background: c.bg, display: "flex", alignItems: "center",
                justifyContent: "center", flexShrink: 0,
              }}>
                <Icon size={18} color={c.color} />
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#1e1b6e", margin: "0 0 3px" }}>{c.label}</p>
                <p style={{ fontSize: 11, color: "#9ca3af", margin: 0, lineHeight: 1.4 }}>{c.tip}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ */}
      <div style={{
        background: "#fff", border: "1px solid #e0e7ff",
        borderRadius: 16, overflow: "hidden",
        boxShadow: "0 4px 20px rgba(55,48,163,0.07)",
      }}>
        <div style={{
          padding: "16px 22px", borderBottom: "1px solid #f3f4f6",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <MdHelpOutline size={18} color="#6366f1" />
          <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, color: "#1e1b6e", fontSize: 15, margin: 0 }}>
            Frequently Asked Questions
          </h3>
          <span style={{
            marginLeft: "auto", fontSize: 11, color: "#9ca3af", fontWeight: 600,
            background: "#f3f4f6", padding: "3px 10px", borderRadius: 99,
          }}>
            {displayedFaqs.reduce((n, c) => n + c.items.length, 0)} questions
          </span>
        </div>

        <div>
          {displayedFaqs.map((cat, ci) => {
            const CatIcon = cat.Icon;
            const realCi = faqs.indexOf(cat);
            return (
              <div key={cat.cat}>
                {/* Category header */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 22px 8px",
                  background: "#f9f8ff",
                  borderTop: ci > 0 ? "1px solid #f3f4f6" : "none",
                }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: 6,
                    background: "#e0e7ff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <CatIcon size={14} color={cat.color} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: cat.color, textTransform: "uppercase", letterSpacing: "0.7px" }}>
                    {cat.cat}
                  </span>
                  <span style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600 }}>
                    {cat.items.length} questions
                  </span>
                </div>

                {cat.items.map((faq, ii) => {
                  const key = `${realCi}-${ii}`;
                  const isOpen = openKey === key;
                  return (
                    <div key={ii} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <button
                        onClick={() => toggle(key)}
                        style={{
                          width: "100%", display: "flex", alignItems: "center",
                          justifyContent: "space-between",
                          padding: "13px 22px",
                          background: isOpen ? "#f5f3ff" : "transparent",
                          border: "none", cursor: "pointer", textAlign: "left",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => { if (!isOpen) e.currentTarget.style.background = "#fafaff"; }}
                        onMouseLeave={(e) => { if (!isOpen) e.currentTarget.style.background = "transparent"; }}
                      >
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#1e1b6e", paddingRight: 16 }}>
                          {faq.q}
                        </span>
                        <span style={{
                          width: 26, height: 26, borderRadius: 7, flexShrink: 0,
                          background: isOpen ? "#e0e7ff" : "#f3f4f6",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          {isOpen
                            ? <MdExpandLess size={17} color="#3730a3" />
                            : <MdExpandMore size={17} color="#9ca3af" />}
                        </span>
                      </button>

                      {isOpen && (
                        <div style={{ padding: "2px 22px 14px", background: "#f5f3ff" }}>
                          <p style={{
                            fontSize: 13, color: "#4b5563", lineHeight: 1.7, margin: 0,
                            borderLeft: `3px solid ${cat.color}`,
                            paddingLeft: 14,
                          }}>
                            {faq.a}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact */}
      <div style={{
        background: "#fff", border: "1px solid #e0e7ff",
        borderRadius: 16, overflow: "hidden",
        boxShadow: "0 4px 20px rgba(55,48,163,0.07)",
      }}>
        <div style={{ padding: "16px 22px", borderBottom: "1px solid #f3f4f6" }}>
          <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, color: "#1e1b6e", fontSize: 15, margin: 0 }}>
            Contact Support
          </h3>
        </div>
        <div style={{
          padding: "18px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
        }}>
          {[
            { Icon: MdEmail,       label: "Email Us",      value: "admin@tracker.edu",    iconBg: "#e0e7ff", iconColor: "#3730a3", link: "mailto:admin@tracker.edu" },
            { Icon: MdPhone,       label: "Call Us",       value: "+91 98765 43210",      iconBg: "#d1fae5", iconColor: "#059669" },
            { Icon: MdAccessTime,  label: "Support Hours", value: "Mon – Fri, 9AM – 5PM", iconBg: "#fef3c7", iconColor: "#d97706" },
          ].map((c, i) => {
            const Icon = c.Icon;
            return (
              <div key={i} style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                textAlign: "center", gap: 10,
                background: "#f9f8ff", border: "1px solid #e5e7eb",
                borderRadius: 14, padding: "20px 16px",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 16px rgba(55,48,163,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{
                  width: 46, height: 46, borderRadius: 12,
                  background: c.iconBg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={22} color={c.iconColor} />
                </div>
                <p style={{ fontSize: 10, color: "#9ca3af", fontWeight: 700, margin: 0, textTransform: "uppercase", letterSpacing: "0.6px" }}>
                  {c.label}
                </p>
                {c.link
                  ? <a href={c.link} style={{ fontSize: 13, fontWeight: 700, color: "#6366f1", textDecoration: "none" }}>{c.value}</a>
                  : <p style={{ fontSize: 13, fontWeight: 700, color: "#1e1b6e", margin: 0 }}>{c.value}</p>
                }
              </div>
            );
          })}
        </div>
      </div>

      {/* Tip */}
      <div style={{
        background: "linear-gradient(135deg, #fef3c7, #fde68a)",
        border: "1px solid #fcd34d", borderRadius: 12, padding: "14px 18px",
        display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: "#92400e",
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9, background: "#d97706",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <span style={{ fontSize: 16 }}>💡</span>
        </div>
        <p style={{ margin: 0, lineHeight: 1.5 }}>
          For urgent issues, email us directly. We typically respond within <strong>24 hours</strong>.
        </p>
      </div>
    </div>
  );
}

export default HelpSupport;
