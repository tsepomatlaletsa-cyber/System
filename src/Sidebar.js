import React from "react";
import { Link } from "react-router-dom";

function Sidebar({ role }) {
  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark vh-100" style={{ width: "250px" }}>
      <h4 className="text-white">Reporting System</h4>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link to="/dashboard" className="nav-link text-white">
            Dashboard
          </Link>
        </li>

        {role === "Lecturer" && (
          <>
            <li>
              <a href="#reports" className="nav-link text-white">My Reports</a>
            </li>
            <li>
              <a href="#ratings" className="nav-link text-white">Student Ratings</a>
            </li>
          </>
        )}

        {role === "Student" && (
          <li>
            <a href="#rate" className="nav-link text-white">Rate Lecturers</a>
          </li>
        )}

        {role === "PRL" && (
          <li>
            <a href="#feedback" className="nav-link text-white">PRL Feedback</a>
          </li>
        )}

        {role === "PL" && (
          <li>
            <a href="#assignments" className="nav-link text-white">Assign Courses</a>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Sidebar;
