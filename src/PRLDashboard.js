import React, { useState, useEffect } from "react";
import axios from "axios";

function PRLDashboard() {
  const [reports, setReports] = useState([]);
  const [feedback, setFeedback] = useState({});

  const fetchReports = () => {
    const token = localStorage.getItem("token");
    axios.get("http://localhost:5000/reports", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setReports(res.data))
    .catch(err => console.error(err));
  };

  const handleFeedbackChange = (id, value) => {
    setFeedback({ ...feedback, [id]: value });
  };

  const submitFeedback = (id) => {
    const token = localStorage.getItem("token");
    axios.put(`http://localhost:5000/reports/${id}/feedback`, 
      { feedback: feedback[id] }, 
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(() => {
      alert("Feedback submitted!");
      fetchReports();
    })
    .catch(() => alert("Failed to submit feedback"));
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Principal Lecturer Dashboard</h2>
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Class</th>
            <th>Topic</th>
            <th>Recommendations</th>
            <th>PRL Feedback</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(r => (
            <tr key={r.report_id}>
              <td>{r.report_id}</td>
              <td>{r.class_name}</td>
              <td>{r.topic}</td>
              <td>{r.recommendations}</td>
              <td>
                <textarea
                  value={feedback[r.report_id] || r.prl_feedback || ""}
                  onChange={(e) => handleFeedbackChange(r.report_id, e.target.value)}
                  className="form-control"
                />
                <button
                  onClick={() => submitFeedback(r.report_id)}
                  className="btn btn-sm btn-primary mt-1"
                >
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PRLDashboard;
