import React, { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";

function StudentDashboard() {
  const [lecturers, setLecturers] = useState([]);
  const [reports, setReports] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({ lecturer_id: "", rating: 5, comment: "" });
  const [stats, setStats] = useState({
    totalReports: 0,
    totalLecturers: 0,
    totalRatings: 0,
  });
  const [activeTab, setActiveTab] = useState("stats");

  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const user_id = parseInt(localStorage.getItem("user_id"));

  const headers = { Authorization: `Bearer ${token}` };

  // --- Fetch data ---
  useEffect(() => {
    if (!token) return;

    // Fetch lecturers
    axios
      .get("https://system-backend-2-ty55.onrender.com/lecturers", { headers })
      .then((res) => {
        setLecturers(res.data);
        setStats((prev) => ({ ...prev, totalLecturers: res.data.length }));
      })
      .catch((err) => console.error("Lecturers fetch error:", err));

    // Fetch reports
    axios
      .get("https://system-backend-2-ty55.onrender.com/reports", { headers })
      .then((res) => {
        setReports(res.data);
        setStats((prev) => ({ ...prev, totalReports: res.data.length }));
      })
      .catch((err) => console.error("Reports fetch error:", err));

    // Fetch ratings
    axios
      .get("https://system-backend-2-ty55.onrender.com/ratings", { headers })
      .then((res) => {
        setRatings(res.data);
        setStats((prev) => ({ ...prev, totalRatings: res.data.length }));
      })
      .catch((err) => console.error("Ratings fetch error:", err));

    // Fetch assigned courses for this student
    axios
      .get("https://system-backend-2-ty55.onrender.com/assignments", { headers })
      .then((res) => {
        setAssignments(res.data);
      })
      .catch((err) => console.error("Assignments fetch error:", err));
  }, [token]);

  // --- Form handlers ---
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, lecturer_id: parseInt(form.lecturer_id) };

    axios
      .post("https://system-backend-2-ty55.onrender.com/rate", payload, { headers })
      .then(() => {
        alert("✅ Rating submitted successfully!");
        setForm({ lecturer_id: "", rating: 5, comment: "" });
      })
      .catch((err) => {
        console.error(err.response?.data || err.message);
        alert("⚠️ Error: " + (err.response?.data?.error || err.message));
      });
  };

  // --- Find lecturer name utility ---
  const getLecturerName = (report) => {
    // 1. Prefer `lecturer_name` if it exists in the report
    if (report.lecturer_name) return report.lecturer_name;

    // 2. Otherwise match with lecturers array by ID (handle user_id or lecturer_id)
    const lecturer =
      lecturers.find(
        (l) =>
          l.user_id === report.lecturer_id ||
          l.lecturer_id === report.lecturer_id
      ) || {};

    return lecturer.name || lecturer.full_name || "Unknown";
  };

  // --- UI ---
  return (
    <Dashboard title="Student Dashboard">
      <div className="container-fluid">
        <div className="alert alert-info mb-4">
          👋 Welcome, <strong>{name}</strong>!
        </div>

        {/* Navigation Tabs */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "stats" ? "active" : ""}`}
              onClick={() => setActiveTab("stats")}
            >
              Stats
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "reports" ? "active" : ""}`}
              onClick={() => setActiveTab("reports")}
            >
              Reports Monitoring
            </button>
            
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "rate" ? "active" : ""}`}
              onClick={() => setActiveTab("rate")}
            >
              Rate Lecturer
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "ratings" ? "active" : ""}`}
              onClick={() => setActiveTab("ratings")}
            >
              My Ratings
            </button>
          </li>
        </ul>

{/* Stats Tab */}
{activeTab === "stats" && (
  <div className="row mb-4">
    <div className="col-md-4 mb-3">
      <div className="card bg-primary text-white shadow-sm">
        <div className="card-body">
          <h5>Total Reports</h5>
          <h3>{stats.totalReports}</h3>
        </div>
      </div>
    </div>
    <div className="col-md-4 mb-3">
      <div className="card bg-success text-white shadow-sm">
        <div className="card-body">
          <h5>Total Lecturers</h5>
          <h3>{stats.totalLecturers}</h3>
        </div>
      </div>
    </div>
    <div className="col-md-4 mb-3">
      <div className="card bg-warning text-white shadow-sm">
        <div className="card-body">
          <h5>Total Ratings</h5>
          <h3>{stats.totalRatings}</h3>
        </div>
      </div>
    </div>
  </div>
)}

{/* Reports Tab */}
{activeTab === "reports" && (
  <div className="table-responsive">
    <table className="table table-bordered align-middle">
      <thead className="table-light">
        <tr>
          <th>#</th>
          <th>Class</th>
          <th>Topic</th>
          <th>Lecturer</th>
          <th>Feedback</th>
        </tr>
      </thead>
      <tbody>
        {reports.map((r, i) => (
          <tr key={r.report_id}>
            <td>{i + 1}</td>
            <td>{r.class_name}</td>
            <td>{r.topic}</td>
            <td>{getLecturerName(r)}</td>
            <td>{r.prl_feedback || "Pending"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}


{/* Rate Lecturer Tab */}
{activeTab === "rate" && (
  <div className="card shadow-sm p-4 mb-5">
    <h4>Rate a Lecturer</h4>
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Select Lecturer</label>
        <select
          name="lecturer_id"
          value={form.lecturer_id}
          onChange={handleChange}
          className="form-select"
          required
        >
          <option value="">-- Choose Lecturer --</option>
          {lecturers.map((l) => (
            <option key={l.user_id || l.lecturer_id} value={l.user_id || l.lecturer_id}>
              {l.name || l.full_name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Rating</label>
        <select
          name="rating"
          value={form.rating}
          onChange={handleChange}
          className="form-select"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n} Star{n > 1 && "s"}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Comment</label>
        <textarea
          name="comment"
          value={form.comment}
          onChange={handleChange}
          className="form-control"
          placeholder="Write your feedback..."
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Submit Rating
      </button>
    </form>
  </div>
)}

{/* Ratings Tab */}
{activeTab === "ratings" && (
  <div className="table-responsive">
    <h4 className="mb-3">All Lecturer Ratings</h4>
    <table className="table table-bordered align-middle">
      <thead className="table-light">
        <tr>
          <th>#</th>
          <th>Lecturer</th>
          <th>Student</th>
          <th>Rating</th>
          <th>Comment</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {ratings.length > 0 ? (
          ratings.map((r, i) => (
            <tr key={r.rating_id}>
              <td>{i + 1}</td>
              <td>{r.lecturer_name || getLecturerName(r)}</td>
              <td>{r.student_name || name}</td>
              <td>{r.rating}</td>
              <td>{r.comment}</td>
              <td>{r.created_at}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="text-center text-muted">
              No ratings found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
)}
      </div>
    </Dashboard>
  );
}

export default StudentDashboard;
