import React, { useEffect, useState } from "react";
import axios from "axios";
import LecturerForm from "./LecturerForm";

function LecturerDashboard() {
  const [data, setData] = useState({ reports: [], ratings: [] });
  const token = localStorage.getItem("token");

  const fetchData = () => {
    axios.get("http://localhost:5000/lecturer-dashboard", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setData(res.data));
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="container mt-5">
      <h2>Lecturer Dashboard</h2>
      <LecturerForm onReportAdded={fetchData} />

      <h4 className="mt-4">My Reports</h4>
      <table className="table table-bordered">
        <thead><tr><th>ID</th><th>Class</th><th>Topic</th><th>Recommendations</th><th>PRL Feedback</th></tr></thead>
        <tbody>
          {data.reports.map(r => (
            <tr key={r.report_id}><td>{r.report_id}</td><td>{r.class_name}</td><td>{r.topic}</td><td>{r.recommendations}</td><td>{r.prl_feedback || "No feedback"}</td></tr>
          ))}
        </tbody>
      </table>

      <h4 className="mt-5">Student Ratings</h4>
      <table className="table table-striped">
        <thead><tr><th>Rating</th><th>Comment</th></tr></thead>
        <tbody>
          {data.ratings.map(r => (
            <tr key={r.rating_id}><td>{"⭐".repeat(r.rating)}</td><td>{r.comment}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default LecturerDashboard;
