import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");
  const [facultyId, setFacultyId] = useState("");
  const [classId, setClassId] = useState("");
  const [faculties, setFaculties] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/faculties")
      .then((res) => setFaculties(res.data))
      .catch((err) => console.error("Failed to load faculties", err));

    axios
      .get("http://localhost:5000/classes")
      .then((res) => setClasses(res.data))
      .catch((err) => console.error("Failed to load classes", err));
  }, []);

  useEffect(() => {
    if (role !== "Student") setClassId("");
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (role === "Student" && !classId) {
      alert("Please select a class for Student role");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/auth/register", {
        name,
        email,
        password,
        role,
        faculty_id: facultyId,
        class_id: role === "Student" ? classId : null,
      });

      alert("Registration successful! Redirecting to login...");
      navigate("/"); // redirect to login
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center min-vh-100 position-relative"
      style={{
        backgroundImage: "url('/Limkokwing_Lesotho_Logo.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(3px)", zIndex: 0 }}
      ></div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="card shadow-lg p-4 p-md-5 border-0"
        style={{
          maxWidth: "450px",
          width: "92%",
          borderRadius: "20px",
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(14px)",
          zIndex: 2,
          color: "#fff",
        }}
      >
        <motion.h3 initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="fw-bold mb-1">
          Create Your Account
        </motion.h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Name</label>
            <input
              type="text"
              className="form-control rounded-3 border-0 shadow-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control rounded-3 border-0 shadow-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control rounded-3 border-0 shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a secure password"
              required
            />
          </div>

          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Role</label>
            <select className="form-select rounded-3 border-0 shadow-sm" value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="Student">Student</option>
              <option value="Lecturer">Lecturer</option>
              <option value="PRL">PRL</option>
              <option value="PL">PL</option>
            </select>
          </div>

          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Faculty</label>
            <select className="form-select rounded-3 border-0 shadow-sm" value={facultyId} onChange={(e) => setFacultyId(e.target.value)} required>
              <option value="">-- Select Faculty --</option>
              {faculties.map((f) => (
                <option key={f.faculty_id} value={f.faculty_id}>
                  {f.faculty_name}
                </option>
              ))}
            </select>
          </div>

          {role === "Student" && (
            <div className="mb-3 text-start">
              <label className="form-label fw-semibold">Class</label>
              <select className="form-select rounded-3 border-0 shadow-sm" value={classId} onChange={(e) => setClassId(e.target.value)} required>
                <option value="">-- Select Class --</option>
                {classes.map((c) => (
                  <option key={c.class_id} value={c.class_id}>
                    {c.class_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            type="submit"
            className="btn btn-light w-100 rounded-3 fw-bold"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
            ) : null}
            {loading ? "Registering..." : "Register"}
          </motion.button>
        </form>

        <p className="mt-4 text-light text-center">
          Already have an account?{" "}
          <Link to="/" className="text-white fw-semibold text-decoration-underline">
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Register;
