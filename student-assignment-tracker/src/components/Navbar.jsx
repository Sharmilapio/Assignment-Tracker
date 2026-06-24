import { Navbar, Nav } from "rsuite";
import { MdTrackChanges } from "react-icons/md";

function AppNavbar({ title = "Tracking Hub" }) {
  return (
    <Navbar
      style={{
        background: "linear-gradient(135deg, #1e1b6e 0%, #3730a3 50%, #6366f1 100%)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1001,
        height: "70px",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        boxShadow: "0 2px 10px rgba(30,27,110,0.2)",
      }}
    >
      <Navbar.Brand style={{ display: "flex", alignItems: "center", gap: 10, padding: 0 }}>
        <MdTrackChanges size={28} color="#fff" />
        <span style={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 700, fontSize: 22, color: "#fff",
        }}>
          {title}
        </span>
      </Navbar.Brand>

      <Nav style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <span style={{
          color: "rgba(255,255,255,0.9)",
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 600, fontSize: 18,
        }}>
          Assignment Tracker
        </span>
      </Nav>

      <Nav pullRight style={{ display: "flex", alignItems: "center" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "7px 14px 7px 7px",
          background: "rgba(255,255,255,0.15)",
          borderRadius: 30,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "rgba(255,255,255,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 14, color: "#fff",
          }}>A</div>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Admin</span>
        </div>
      </Nav>
    </Navbar>
  );
}

export default AppNavbar;