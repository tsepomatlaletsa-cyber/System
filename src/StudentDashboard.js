import React, { useEffect, useState } from "react";
import axios from "axios";

function StudentDashboard() {
  const [lecturers, setLecturers] = useState([]);
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState({ lecturer_id: "", rating: 5, comment: "" });

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("https://system-backend-2-ty55.onrender.com/ratings", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setLecturers(res.data));

    axios.get("https://system-backend-2-ty55.onrender.com/reports", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setReports(res.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("https://system-backend-2-ty55.onrender.com/rate", form, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        alert("Rating submitted!");
        setForm({ lecturer_id: "", rating: 5, comment: "" });
        return axios.get("https://system-backend-2-ty55.onrender.com/ratings", { headers: { Authorization: `Bearer ${token}` } });
      })
      .then(res => setLecturers(res.data));
  };

  return (
    <div className="container mt-5">
      <h2>Student Dashboard</h2>

      {/* Reports Monitoring */}
      <h4>Reports Monitoring</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Class</th>
            <th>Topic</th>
            <th>Lecturer</th>
            <th>PRL Feedback</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(r => (
            <tr key={r.report_id}>
              <td>{r.report_id}</td>
              <td>{r.class_name}</td>
              <td>{r.topic}</td>
              <td>{r.lecturer_id}</td>
              <td>{r.prl_feedback || "No feedback yet"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Rating Form */}
      <form onSubmit={handleSubmit} className="p-3 border rounded mb-4 mt-4">
        <h4>Rate a Lecturer</h4>
        <div className="mb-3">
          <label className="form-label">Lecturer</label>
          <select name="lecturer_id" value={form.lecturer_id} onChange={handleChange} className="form-control" required>
            <option value="">-- Select Lecturer --</option>
            {lecturers.map(l => (
              <option key={l.lecturer_id} value={l.lecturer_id}>{l.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Rating</label>
          <select name="rating" value={form.rating} onChange={handleChange} className="form-control">
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Star{n>1 && "s"}</option>)}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Comment</label>
          <textarea name="comment" value={form.comment} onChange={handleChange} className="form-control" />
        </div>

        <button type="submit" className="btn btn-success">Submit Rating</button>
      </form>

      {/* Lecturer Ratings Table */}
      <h4>Lecturer Ratings</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Lecturer</th>
            <th>Average Rating</th>
            <th>Total Ratings</th>
          </tr>
        </thead>
        <tbody>
          {lecturers.map(l => (
            <tr key={l.lecturer_id}>
              <td>{l.name}</td>
              <td>{l.avg_rating ? Number(l.avg_rating).toFixed(1) : "No ratings yet"}</td>
              <td>{l.total_ratings}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentDashboard;
