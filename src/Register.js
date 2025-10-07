import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");
  const [facultyId, setFacultyId] = useState("");
  const [classId, setClassId] = useState("");
  const [faculties, setFaculties] = useState([]);
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Fetch faculties on load
  useEffect(() => {
    axios
      .get("https://system-backend-2-ty55.onrender.com/faculties")
      .then((res) => setFaculties(res.data))
      .catch((err) => console.error("Failed to load faculties", err));
  }, []);

  // Fetch all classes on load
  useEffect(() => {
    axios
      .get("https://system-backend-2-ty55.onrender.com/classes")
      .then((res) => setClasses(res.data))
      .catch((err) => console.error("Failed to load classes", err));
  }, []);

  // Reset class selection if role is not Student
  useEffect(() => {
    if (role !== "Student") setClassId("");
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (role === "Student" && !classId) {
      setError("Please select a class for Student role");
      return;
    }

    try {
      await axios.post("https://system-backend-2-ty55.onrender.com/auth/register", {
        name,
        email,
        password,
        role,
        faculty_id: facultyId,
        class_id: role === "Student" ? classId : null,
      });

      // Navigate to login after successful registration
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 p-3"
      style={{
        backgroundImage: "url('Limkokwing_Lesotho_Logo.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white rounded-4 shadow-lg p-4 p-md-5 w-100" style={{ maxWidth: "500px" }}>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Name</label>
            <input
              type="text"
              className="form-control rounded-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control rounded-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control rounded-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Role</label>
            <select
              className="form-select rounded-3"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="Student">Student</option>
              <option value="Lecturer">Lecturer</option>
              <option value="PRL">PRL</option>
              <option value="PL">PL</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Faculty</label>
            <select
              className="form-select rounded-3"
              value={facultyId}
              onChange={(e) => setFacultyId(e.target.value)}
              required
            >
              <option value="">-- Select Faculty --</option>
              {faculties.map((f) => (
                <option key={f.faculty_id} value={f.faculty_id}>
                  {f.faculty_name}
                </option>
              ))}
            </select>
          </div>

          {role === "Student" && (
            <div className="mb-3">
              <label className="form-label fw-semibold">Class</label>
              <select
                className="form-select rounded-3"
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                required
              >
                <option value="">-- Select Class --</option>
                {classes.map((c) => (
                  <option key={c.class_id} value={c.class_id}>
                    {c.class_name} ({c.year_of_study || "N/A"})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button className="btn btn-dark w-100 rounded-3 fw-bold" type="submit">
            Register
          </button>
        </form>

        <p className="text-center mt-4 text-muted">
          Already have an account?{" "}
          <Link to="/" className="text-dark fw-semibold text-decoration-none">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
