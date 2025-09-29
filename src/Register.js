import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", role: "Student", faculty_id: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/register", formData);
      alert("Registered successfully!");
      navigate("/");
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="p-3 border rounded">
        <input name="name" placeholder="Name" className="form-control mb-3" value={formData.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" className="form-control mb-3" value={formData.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" className="form-control mb-3" value={formData.password} onChange={handleChange} required />
        <select name="role" className="form-control mb-3" value={formData.role} onChange={handleChange}>
          <option value="Student">Student</option>
          <option value="Lecturer">Lecturer</option>
          <option value="PRL">PRL</option>
          <option value="PL">PL</option>
        </select>
        <input name="faculty_id" placeholder="Faculty ID" className="form-control mb-3" value={formData.faculty_id} onChange={handleChange} required />
        <button className="btn btn-success">Register</button>
      </form>
    </div>
  );
}

export default Register;
