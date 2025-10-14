import React from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Limkokwing.jpg"; 


function Navbar() {
  const location = useLocation();

  const linkStyle = (path) => ({
    color: location.pathname === path ? "#00bfff" : "white",
    textDecoration: "none",
    fontWeight: "500",
    margin: "0 15px",
    transition: "color 0.3s ease",
  });

  return (
    <nav
      style={{
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(8px)",
        padding: "15px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img
          src={Logo}
          alt="Limkokwing University"
          style={{ width: "50px", height: "50px", borderRadius: "8px" }}
        />
        <h3 style={{ color: "white", margin: 0, fontWeight: "600" }}>
          Limkokwing Portal
        </h3>
      </div>

      <div>
        <Link to="/" style={linkStyle("/")}>Home</Link>
        <Link to="/login" style={linkStyle("/login")}>Login</Link>
        <Link to="/register" style={linkStyle("/register")}>Register</Link>
      </div>
    </nav>
  );
}

export default Navbar;
