import { useState } from "react";
import { MdPerson, MdLock, MdVisibility, MdVisibilityOff, MdLogin } from "react-icons/md";

function StudentSetup({ onSave }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    setError("");
    if (!username || !password) {
      setError("Please enter your username and password.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      if (username === "admin" && password === "1234") {
        onSave([
          "Aarav Kumar", "Priya Sharma", "Rahul Verma", "Ananya Singh",
          "Arjun Patel", "Sneha Reddy", "Vikram Gupta", "Meera Nair",
          "Karthik Raj", "Divya Menon", "Rohit Das", "Nisha Joseph",
          "Aditya Rao", "Pooja Iyer", "Sanjay Kumar", "Keerthana S",
          "Tony Daniel J", "Sharmila Pio J", "Sahaya Deepika J",
          "Fahmitha Naseema S", "Ilakkiya T", "Harish Kumar", "Monika Devi",
          "Praveen S", "Swetha R", "Dinesh Kumar", "Abinaya M",
          "Gokul Raj", "Yogesh K", "Ashwin Kumar",
        ]);
      } else {
        setError("Invalid username or password. Please try again.");
        setLoading(false);
      }
    }, 700);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #0f0c3d 0%, #1e1b6e 40%, #3730a3 70%, #6366f1 100%)",
      padding: "20px",
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      overflow: "hidden",
    }}>

      {/* Background orbs */}
      {[
        { w: 320, h: 320, top: "-80px", left: "-80px", op: 0.06 },
        { w: 240, h: 240, bottom: "60px", right: "-60px", op: 0.06 },
        { w: 160, h: 160, top: "40%", left: "60%", op: 0.04 },
      ].map((orb, i) => (
        <div key={i} style={{
          position: "absolute",
          width: orb.w, height: orb.h,
          borderRadius: "50%",
          background: `rgba(255,255,255,${orb.op})`,
          top: orb.top, bottom: orb.bottom,
          left: orb.left, right: orb.right,
          pointerEvents: "none",
          filter: "blur(2px)",
        }} />
      ))}

      {/* Card */}
      <div style={{
        background: "#fff",
        borderRadius: 24,
        padding: "44px 40px",
        width: "100%",
        maxWidth: 420,
        boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
        position: "relative",
        zIndex: 1,
      }}>

        {/* Logo area */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 68, height: 68, borderRadius: 18,
            background: "linear-gradient(135deg, #1e1b6e, #6366f1)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            marginBottom: 18,
            boxShadow: "0 10px 28px rgba(99,102,241,0.4)",
          }}>
            <span style={{ fontSize: 30 }}>📚</span>
          </div>

          <h2 style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 24, fontWeight: 800,
            color: "#1e1b6e", margin: "0 0 6px",
            letterSpacing: "-0.5px",
          }}>
            Tracking Hub
          </h2>

          <p style={{
            fontSize: 13, color: "#6b7280", margin: 0,
            fontFamily: "'Inter', sans-serif", fontWeight: 500,
          }}>
            St. Joseph's College for Women
          </p>
          <p style={{
            fontSize: 11, color: "#9ca3af", margin: "3px 0 0",
            fontFamily: "'Inter', sans-serif",
          }}>
            Computer Science with Data Analytics
          </p>
        </div>

        {/* Divider */}
        <div style={{
          height: 1, background: "linear-gradient(90deg, transparent, #e0e7ff, transparent)",
          margin: "0 0 28px",
        }} />

        <p style={{
          fontSize: 14, fontWeight: 700, color: "#374151",
          marginBottom: 22, fontFamily: "'Poppins', sans-serif",
          textAlign: "center",
        }}>
          Sign in to your account
        </p>

        {/* Error */}
        {error && (
          <div style={{
            background: "#fef2f2", border: "1px solid #fecaca",
            borderRadius: 10, padding: "10px 14px",
            fontSize: 13, color: "#dc2626", fontWeight: 500,
            marginBottom: 18,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Username */}
        <div style={{ marginBottom: 16 }}>
          <label style={{
            display: "block", fontSize: 11, fontWeight: 700,
            color: "#374151", marginBottom: 7,
            fontFamily: "'Inter', sans-serif",
            textTransform: "uppercase", letterSpacing: "0.8px",
          }}>
            Username
          </label>
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute", left: 13, top: "50%",
              transform: "translateY(-50%)",
              color: "#9ca3af", display: "flex",
            }}>
              <MdPerson size={18} />
            </span>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                width: "100%", padding: "12px 14px 12px 40px",
                border: "2px solid #e0e7ff", borderRadius: 12,
                fontSize: 14, fontFamily: "'Inter', sans-serif",
                color: "#1e1b3a", background: "#f9f8ff",
                outline: "none", boxSizing: "border-box",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#6366f1";
                e.target.style.boxShadow = "0 0 0 4px rgba(99,102,241,0.12)";
                e.target.style.background = "#fff";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e0e7ff";
                e.target.style.boxShadow = "none";
                e.target.style.background = "#f9f8ff";
              }}
            />
          </div>
        </div>

        {/* Password */}
        <div style={{ marginBottom: 28 }}>
          <label style={{
            display: "block", fontSize: 11, fontWeight: 700,
            color: "#374151", marginBottom: 7,
            fontFamily: "'Inter', sans-serif",
            textTransform: "uppercase", letterSpacing: "0.8px",
          }}>
            Password
          </label>
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute", left: 13, top: "50%",
              transform: "translateY(-50%)",
              color: "#9ca3af", display: "flex",
            }}>
              <MdLock size={18} />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                width: "100%", padding: "12px 44px 12px 40px",
                border: "2px solid #e0e7ff", borderRadius: 12,
                fontSize: 14, fontFamily: "'Inter', sans-serif",
                color: "#1e1b3a", background: "#f9f8ff",
                outline: "none", boxSizing: "border-box",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#6366f1";
                e.target.style.boxShadow = "0 0 0 4px rgba(99,102,241,0.12)";
                e.target.style.background = "#fff";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e0e7ff";
                e.target.style.boxShadow = "none";
                e.target.style.background = "#f9f8ff";
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute", right: 12, top: "50%",
                transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer",
                color: "#9ca3af", padding: 4, display: "flex",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#6366f1"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#9ca3af"}
            >
              {showPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
            </button>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%", padding: "14px",
            background: loading
              ? "#a5b4fc"
              : "linear-gradient(135deg, #1e1b6e, #4f46e5)",
            color: "#fff", border: "none", borderRadius: 12,
            fontSize: 15, fontWeight: 700,
            fontFamily: "'Poppins', sans-serif",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: loading ? "none" : "0 6px 20px rgba(99,102,241,0.4)",
            transition: "all 0.2s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            letterSpacing: "0.3px",
          }}
          onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = "0.9"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          {loading ? (
            <>
              <span style={{
                display: "inline-block", width: 16, height: 16,
                border: "2px solid rgba(255,255,255,0.4)",
                borderTopColor: "#fff",
                borderRadius: "50%",
                animation: "spin 0.7s linear infinite",
              }} />
              Signing in…
            </>
          ) : (
            <>
              <MdLogin size={18} />
              Sign In
            </>
          )}
        </button>

        <p style={{
          textAlign: "center", fontSize: 11, color: "#9ca3af",
          marginTop: 20, fontFamily: "'Inter', sans-serif",
        }}>
          🔐 Secure access · Academic Year 2025–2026
        </p>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default StudentSetup;
