import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Login({ onLogin }) {
  const [emailOrName, setEmailOrName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDemoRoles, setShowDemoRoles] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e, demo = false, role = null) => {
    e.preventDefault();
    setLoading(true);

    try {
      let credentials;

      if (demo) {
        switch (role) {
          case "student":
            credentials = { emailOrName: "student@limkokwing.edu.ls", password: "demo123" };
            break;
          case "lecturer":
            credentials = { emailOrName: "lecturer@limkokwing.edu.ls", password: "demo123" };
            break;
          case "PL":
            credentials = { emailOrName: "admin@limkokwing.edu.ls", password: "demo123" };
            break;
          case "PRL":
            credentials = { emailOrName: "prl@limkokwing.edu.ls", password: "demo123" };
            break;
          default:
            credentials = { emailOrName: "demo@limkokwing.edu.ls", password: "demo123" };
        }
      } else {
        credentials = { emailOrName, password };
      }

      const res = await axios.post("https://system-backend-2-ty55.onrender.com/login", credentials);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("user_id", res.data.user_id);

      onLogin(res.data.role);
      navigate("/dashboard");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.error || "Invalid credentials");
    } finally {
      setLoading(false);
      setShowDemoRoles(false);
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
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.55)",
          backdropFilter: "blur(3px)",
          zIndex: 0,
        }}
      ></div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="card shadow-lg p-4 p-md-5 text-center text-white border-0"
        style={{
          maxWidth: "430px",
          width: "92%",
          borderRadius: "20px",
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(14px)",
          zIndex: 2,
        }}
      >
        <motion.h3
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="fw-bold mb-1"
        >
          Welcome to
        </motion.h3>
        <motion.h2
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="fw-bolder mb-3 text-light"
        >
          Limkokwing University Portal
        </motion.h2>
        <p className="text-light mb-4">Sign in to continue to your dashboard</p>

        {/* Login Form */}
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="mb-3 text-start">
            <label className="form-label fw-semibold text-light">
              Email or Username
            </label>
            <input
              type="text"
              className="form-control rounded-3 border-0 shadow-sm"
              value={emailOrName}
              onChange={(e) => setEmailOrName(e.target.value)}
              placeholder="Enter your email or username"
              required
            />
          </div>

          <div className="mb-4 text-start">
            <label className="form-label fw-semibold text-light">Password</label>
            <input
              type="password"
              className="form-control rounded-3 border-0 shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            className="btn btn-light w-100 rounded-3 fw-bold mb-3"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            type="button"
            className="btn btn-outline-light w-100 rounded-3 fw-bold"
            onClick={() => setShowDemoRoles(!showDemoRoles)}
            disabled={loading}
          >
            🎯 Try Live Demo
          </motion.button>
        </form>

        {/* Demo Roles Section */}
        <AnimatePresence>
          {showDemoRoles && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4"
            >
              <p className="text-light mb-2">Select a demo role to explore:</p>
              <div className="d-flex flex-wrap gap-2 justify-content-center">
                {["student", "lecturer", "PL", "PRL"].map((role) => (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    key={role}
                    className="btn btn-sm btn-light fw-semibold text-dark"
                    style={{ minWidth: "95px" }}
                    onClick={(e) => handleSubmit(e, true, role)}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-4 text-light">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-white fw-semibold text-decoration-underline"
          >
            Register here
          </a>
        </p>
      </motion.div>

    </div>
  );
}

export default Login;
