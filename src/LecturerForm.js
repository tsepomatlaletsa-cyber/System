import React, { useState } from "react";
import axios from "axios";

function LecturerForm({ onReportAdded }) {
  const [form, setForm] = useState({ class_name: "", topic: "", recommendations: "" });
  const token = localStorage.getItem("token");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("https://system-backend-2-ty55.onrender.com/reports", form, { headers: { Authorization: `Bearer ${token}` } });
    setForm({ class_name: "", topic: "", recommendations: "" });
    onReportAdded();
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded mt-3">
      <input name="class_name" placeholder="Class" className="form-control mb-2" value={form.class_name} onChange={handleChange} required />
      <input name="topic" placeholder="Topic" className="form-control mb-2" value={form.topic} onChange={handleChange} required />
      <textarea name="recommendations" placeholder="Recommendations" className="form-control mb-2" value={form.recommendations} onChange={handleChange} />
      <button className="btn btn-primary">Submit Report</button>
    </form>
  );
}

export default LecturerForm;
