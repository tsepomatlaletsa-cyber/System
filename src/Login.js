import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function Login({ onLogin }) {
  const [emailOrName, setEmailOrName] = useState(""); 
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://system-backend-2-ty55.onrender.com/login", { emailOrName, password });

      // store user data in localStorage
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
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: "url('/Limkokwing_Lesotho_Logo.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white rounded-4 shadow-lg p-5" style={{ maxWidth: "400px", width: "100%" }}>
        {/* Welcome message */}
        <div className="text-center mb-4">
          <h3 className="fw-bold text-dark">Welcome to</h3>
          <h2 className="fw-bold text-dark">Limkokwing University Lesotho</h2>
          <p className="text-muted">Please login to continue</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email or Username</label>
            <input
              type="text"
              className="form-control rounded-3"
              value={emailOrName}
              onChange={(e) => setEmailOrName(e.target.value)}
              placeholder="Enter your email or username"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control rounded-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button className="btn btn-dark w-100 rounded-3 fw-bold" type="submit">
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-muted">
          Don’t have an account? <a href="/register" className="text-dark fw-semibold">Register here</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
