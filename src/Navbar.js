import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ role, setRole }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setRole(null);
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <span className="navbar-brand">Reporting System</span>
        <div className="d-flex">
          {role && (
            <>
              <span className="navbar-text text-light me-3">
                Logged in as: <b>{role}</b>
              </span>
              <button className="btn btn-outline-light" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
