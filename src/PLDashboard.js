import React, { useEffect, useState } from "react";
import axios from "axios";

function PLDashboard() {
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({ course_id: "", lecturer_id: "" });
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("https://system-backend-2-ty55.onrender.com/courses", { headers: { Authorization: `Bearer ${token}` } }).then(res => setCourses(res.data));
    axios.get("https://system-backend-2-ty55.onrender.com/lecturers", { headers: { Authorization: `Bearer ${token}` } }).then(res => setLecturers(res.data));
    fetchAssignments();
  }, []);

  const fetchAssignments = () => {
    axios.get("https://system-backend-2-ty55.onrender.com/assignments", { headers: { Authorization: `Bearer ${token}` } }).then(res => setAssignments(res.data));
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("https://system-backend-2-ty55.onrender.com/assign-course", form, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => { fetchAssignments(); setForm({ course_id: "", lecturer_id: "" }); });
  };

  return (
    <div className="container mt-5">
      <h2>PL Dashboard</h2>
      <form onSubmit={handleSubmit} className="p-3 border rounded mb-4">
        <h4>Assign Course</h4>
        <select name="course_id" className="form-control mb-2" value={form.course_id} onChange={handleChange} required>
          <option value="">-- Select Course --</option>
          {courses.map(c => <option key={c.course_id} value={c.course_id}>{c.course_name}</option>)}
        </select>
        <select name="lecturer_id" className="form-control mb-2" value={form.lecturer_id} onChange={handleChange} required>
          <option value="">-- Select Lecturer --</option>
          {lecturers.map(l => <option key={l.user_id} value={l.user_id}>{l.name}</option>)}
        </select>
        <button className="btn btn-success">Assign</button>
      </form>

      <h4>Assignments</h4>
      <table className="table table-bordered">
        <thead><tr><th>Course</th><th>Lecturer</th><th>Assigned At</th></tr></thead>
        <tbody>
          {assignments.map(a => (
            <tr key={a.assignment_id}>
              <td>{a.courses?.course_name}</td>
              <td>{a.users?.name}</td>
              <td>{a.assigned_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PLDashboard;
