import React from "react";
import "./DashboardLayout.css";

function DashboardLayout({ title, children }) {
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      
      {/* Main Content */}
      <div className="main-content">
        <nav className="navbar">
          <h3>{title}</h3>
          <div className="user-info">
            <span className="email">{email}</span>
            <button className="logout-btn" onClick={handleLogout}>Log out</button>
          </div>
        </nav>

        <div className="page-content">
          </div>
          {children}
        </div>
      </div>
    
  );
}

export default DashboardLayout;
