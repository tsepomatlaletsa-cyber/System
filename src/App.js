import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./Login";
import Register from "./Register";
import LecturerDashboard from "./LecturerDashboard";
import StudentDashboard from "./StudentDashboard";
import PRLDashboard from "./PRLDashboard";
import PLDashboard from "./PLDashboard";
import ReportsPage from "./ReportsPage";

function App() {
  
  const [role, setRole] = useState(null);

  const handleLogin = (userRole) => {
    setRole(userRole);
    localStorage.setItem("role", userRole); 
  };

  return (
    <Router>
      <div className="d-flex">
        <div className="flex-grow-1">
          <Routes>
            {/* Always start with login first */}
            <Route path="/" element={!role ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route
              path="/dashboard"
              element={
                role === "Lecturer" ? (
                  <LecturerDashboard />
                ) : role === "Student" ? (
                  <StudentDashboard />
                ) : role === "PRL" ? (
                  <PRLDashboard />
                ) : role === "PL" ? (
                  <PLDashboard />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
