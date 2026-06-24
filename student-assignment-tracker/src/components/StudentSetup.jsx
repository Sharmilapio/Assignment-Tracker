import { useState } from "react";

function StudentSetup({ onSave }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!username || !password) {
      alert("Please enter username and password.");
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
          "Gokul Raj", "Yogesh K", "Ashwin Kumar"
        ]);
      } else {
        alert("Invalid Username or Password");
        setLoading(false);
      }
    }, 600);
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
      background: "linear-gradient(135deg, #1e1b6e 0%, #3730a3 50%, #6366f1 100%)",
      padding: "20px",
      position: "fixed",
      inset: 0,
      zIndex: 9999,
    }}>
      {/* Background decorative circles */}
      <div style={{
        position: "absolute", width: "300px", height: "300px",
        borderRadius: "50%", background: "rgba(255,255,255,0.05)",
        top: "-60px", left: "-60px", pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute", width: "200px", height: "200px",
        borderRadius: "50%", background: "rgba(255,255,255,0.05)",
        bottom: "40px", right: "-40px", pointerEvents: "none"
      }} />

      <div style={{
        background: "#fff",
        borderRadius: "20px",
        padding: "44px 40px",
        width: "100%",
        maxWidth: "420px",
        boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
        position: "relative",
        zIndex: 1,
      }}>

        {/* Logo / Icon */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "16px",
            background: "linear-gradient(135deg, #3730a3, #6366f1)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontSize: "28px", marginBottom: "16px",
            boxShadow: "0 8px 20px rgba(99,102,241,0.35)",
          }}>
            📚
          </div>
          <h2 style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "22px", fontWeight: "700",
            color: "#1e1b6e", margin: "0 0 6px",
          }}>
            Tracking Hub
          </h2>
          <p style={{
            fontSize: "13px", color: "#6b7280", margin: 0,
            fontFamily: "'Inter', sans-serif",
          }}>
            St. Joseph's College for Women
          </p>
          <p style={{
            fontSize: "12px", color: "#9ca3af", margin: "2px 0 0",
            fontFamily: "'Inter', sans-serif",
          }}>
            Department of Computer Science with Data Analytics
          </p>
        </div>

        {/* Divider */}
        <div style={{
          height: "1px", background: "#e5e7eb", margin: "0 0 28px"
        }} />

        {/* Form label */}
        <p style={{
          fontSize: "15px", fontWeight: "600", color: "#374151",
          marginBottom: "20px", fontFamily: "'Poppins', sans-serif",
        }}>
          Sign in to your account
        </p>

        {/* Username */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{
            display: "block", fontSize: "12px", fontWeight: "600",
            color: "#374151", marginBottom: "6px",
            fontFamily: "'Inter', sans-serif", textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}>
            Username
          </label>
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute", left: "12px", top: "50%",
              transform: "translateY(-50%)", fontSize: "16px",
            }}>👤</span>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                width: "100%", padding: "11px 14px 11px 38px",
                border: "1.5px solid #e0e7ff", borderRadius: "10px",
                fontSize: "14px", fontFamily: "'Inter', sans-serif",
                color: "#1e1b3a", background: "#f9f8ff",
                outline: "none", boxSizing: "border-box",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#6366f1";
                e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e0e7ff";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

        {/* Password */}
        <div style={{ marginBottom: "24px" }}>
          <label style={{
            display: "block", fontSize: "12px", fontWeight: "600",
            color: "#374151", marginBottom: "6px",
            fontFamily: "'Inter', sans-serif", textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}>
            Password
          </label>
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute", left: "12px", top: "50%",
              transform: "translateY(-50%)", fontSize: "16px",
            }}>🔒</span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                width: "100%", padding: "11px 40px 11px 38px",
                border: "1.5px solid #e0e7ff", borderRadius: "10px",
                fontSize: "14px", fontFamily: "'Inter', sans-serif",
                color: "#1e1b3a", background: "#f9f8ff",
                outline: "none", boxSizing: "border-box",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#6366f1";
                e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e0e7ff";
                e.target.style.boxShadow = "none";
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute", right: "12px", top: "50%",
                transform: "translateY(-50%)", background: "none",
                border: "none", cursor: "pointer", fontSize: "15px",
                color: "#9ca3af", padding: 0,
              }}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%", padding: "13px",
            background: loading
              ? "#a5b4fc"
              : "linear-gradient(135deg, #3730a3, #6366f1)",
            color: "#fff", border: "none", borderRadius: "10px",
            fontSize: "15px", fontWeight: "600",
            fontFamily: "'Poppins', sans-serif",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 6px 18px rgba(99,102,241,0.35)",
            transition: "opacity 0.2s, transform 0.15s",
            letterSpacing: "0.3px",
          }}
          onMouseEnter={(e) => { if (!loading) e.target.style.opacity = "0.9"; }}
          onMouseLeave={(e) => { e.target.style.opacity = "1"; }}
        >
          {loading ? "⏳ Signing in..." : "Login →"}
        </button>

        {/* Footer note */}
        <p style={{
          textAlign: "center", fontSize: "12px", color: "#9ca3af",
          marginTop: "20px", fontFamily: "'Inter', sans-serif",
        }}>
          🔐 Secure access · Academic Year 2025–2026
        </p>
      </div>
    </div>
  );
}

export default StudentSetup;