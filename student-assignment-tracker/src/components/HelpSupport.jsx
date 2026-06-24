import { useState } from "react";
import { Panel, Input, Button, Accordion } from "rsuite";
import { MdSmartToy, MdSend, MdEmail, MdPhone, MdAccessTime, MdQuestionAnswer } from "react-icons/md";

function HelpSupport() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const faqs = [
    { q: "How do I add an assignment?", a: "Go to the Assignments tab, fill in the title, subject, and due date, then click Add Assignment." },
    { q: "How do I mark attendance?", a: "Go to the Attendance tab and click on each student card to toggle present or absent." },
    { q: "How do I reset the student list?", a: "Scroll to the bottom of any page and click Reset student list. This will clear all data." },
    { q: "How do I view student submissions?", a: "Go to Assignments tab, click on any assignment card to open the submission view." },
    { q: "How do I download a report?", a: "Go to the Reports tab and click Download next to the report you need." },
  ];

  const askAI = async () => {
    if (!question.trim()) return;
    setLoading(true); setAnswer("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6", max_tokens: 1000,
          messages: [{ role: "user", content: `You are a helpful support assistant for an academic assignment tracker app called "Tracking Hub" used by St. Joseph's College for Women. Answer this user question helpfully and concisely: ${question}` }]
        })
      });
      const data = await res.json();
      setAnswer(data.content[0].text);
    } catch { setAnswer("Failed to get answer. Please try again."); }
    setLoading(false);
  };

  return (
    <div className="pg-wrapper">
      {/* Hero */}
      <Panel style={{
        background: "linear-gradient(135deg, #1e1b6e 0%, #3730a3 60%, #6366f1 100%)",
        borderRadius: 16, padding: "40px 32px", textAlign: "center", border: "none",
      }}>
        <MdSmartToy size={48} color="#fff" style={{ marginBottom: 12 }} />
        <h2 style={{ color: "#fff", fontFamily: "'Poppins',sans-serif", fontSize: 26, fontWeight: 700, margin: "0 0 8px" }}>
          Smart Assistance Center
        </h2>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: 0 }}>
          Get instant answers, troubleshoot issues, and explore features with AI support.
        </p>
      </Panel>

      {/* AI Assistant */}
      <Panel bordered header={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <MdSmartToy size={18} color="#6366f1" />
          <span style={{ fontWeight: 700, color: "#1e1b6e", fontFamily: "'Poppins',sans-serif" }}>Ask AI Assistant</span>
        </div>
      } style={{ borderRadius: 16, border: "1px solid #e0e7ff", background: "#fff" }}>
        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 14 }}>
          Have a question? Ask our AI and get an instant answer.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <Input
            placeholder="e.g. How do I export attendance data?"
            value={question}
            onChange={setQuestion}
            onPressEnter={askAI}
            style={{ flex: 1 }}
          />
          <Button
            appearance="primary"
            onClick={askAI}
            loading={loading}
            startIcon={<MdSend size={16} />}
            style={{
              background: "linear-gradient(135deg,#3730a3,#6366f1)",
              border: "none", borderRadius: 10, fontWeight: 600,
            }}
          >
            Ask
          </Button>
        </div>
        {answer && (
          <Panel bordered style={{
            marginTop: 16, background: "linear-gradient(135deg,#f5f3ff,#ede9fe)",
            border: "1px solid #c4b5fd", borderRadius: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <MdQuestionAnswer size={16} color="#6366f1" />
              <span style={{ fontWeight: 700, color: "#3730a3", fontSize: 14 }}>AI Answer</span>
            </div>
            <p style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.7, whiteSpace: "pre-line", margin: 0 }}>{answer}</p>
          </Panel>
        )}
      </Panel>

      {/* FAQ */}
      <Panel bordered header={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <MdQuestionAnswer size={18} color="#6366f1" />
          <span style={{ fontWeight: 700, color: "#1e1b6e", fontFamily: "'Poppins',sans-serif" }}>Frequently Asked Questions</span>
        </div>
      } style={{ borderRadius: 16, border: "1px solid #e0e7ff", background: "#fff" }}>
        <Accordion bordered>
          {faqs.map((faq, i) => (
            <Accordion.Panel
              key={i}
              header={<span style={{ fontWeight: 600, color: "#1e1b6e", fontSize: 14 }}>{faq.q}</span>}
              style={{ borderBottom: "1px solid #f3f4f6" }}
            >
              <p style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.6, margin: 0 }}>{faq.a}</p>
            </Accordion.Panel>
          ))}
        </Accordion>
      </Panel>

      {/* Contact */}
      <Panel bordered header={
        <span style={{ fontWeight: 700, color: "#1e1b6e", fontFamily: "'Poppins',sans-serif" }}>📞 Contact Support</span>
      } style={{ borderRadius: 16, border: "1px solid #e0e7ff", background: "#fff" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {[
            { icon: <MdEmail size={26} color="#3730a3" />, label: "Email Us", value: "admin@tracker.edu", bg: "#e0e7ff", link: "mailto:admin@tracker.edu" },
            { icon: <MdPhone size={26} color="#059669" />, label: "Call Us", value: "+91 98765 43210", bg: "#d1fae5" },
            { icon: <MdAccessTime size={26} color="#d97706" />, label: "Support Hours", value: "Mon – Fri, 9AM – 5PM", bg: "#fef3c7" },
          ].map((c, i) => (
            <div key={i} style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              textAlign: "center", gap: 10, background: "#f9f8ff",
              border: "1px solid #e5e7eb", borderRadius: 14, padding: "24px 16px",
            }}>
              <div style={{ width: 54, height: 54, borderRadius: 14, background: c.bg,
                display: "flex", alignItems: "center", justifyContent: "center" }}>
                {c.icon}
              </div>
              <p style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500, margin: 0 }}>{c.label}</p>
              {c.link
                ? <a href={c.link} style={{ fontSize: 14, fontWeight: 600, color: "#6366f1", textDecoration: "none" }}>{c.value}</a>
                : <p style={{ fontSize: 14, fontWeight: 600, color: "#1e1b6e", margin: 0 }}>{c.value}</p>
              }
            </div>
          ))}
        </div>
      </Panel>

      <div style={{
        background: "linear-gradient(135deg,#fef3c7,#fde68a)", border: "1px solid #fcd34d",
        borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12,
        fontSize: 13, color: "#92400e",
      }}>
        <span style={{ fontSize: 22 }}>💡</span>
        <p style={{ margin: 0, lineHeight: 1.5 }}>
          For urgent issues, please email us directly. We typically respond within <strong>24 hours</strong>.
        </p>
      </div>
    </div>
  );
}

export default HelpSupport;