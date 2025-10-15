import React, { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import ProfilePicture from "./ProfilePicture";
import {
  FaChalkboardTeacher,
  FaClipboardList,
  FaStar,
  FaChartLine,
  FaSignOutAlt,
  FaBell,
  FaBars,
  FaTrashAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ShimmerLoader = () => (
  <div className="w-100">
    <div className="row g-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="col-md-4">
          <div className="card shimmer-card p-4 rounded-4 border-0">
            <div className="placeholder-glow">
              <div className="placeholder col-8 mb-3"></div>
              <div className="placeholder col-6"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
    <style>
      {`
        .shimmer-card {
          background: linear-gradient(135deg, #f6f8fc, #e8ecf9);
          animation: shimmer 1.8s infinite alternate;
        }
        @keyframes shimmer {
          from { opacity: 0.7; }
          to { opacity: 1; }
        }
      `}
    </style>
  </div>
);

function StudentDashboard() {
  const [lecturers, setLecturers] = useState([]);
  const [reports, setReports] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({ lecturer_id: "", rating: 5, comment: "" });
  const [stats, setStats] = useState({
    totalReports: 0,
    totalLecturers: 0,
    totalRatings: 0,
  });
  const [activeTab, setActiveTab] = useState("stats");
  const [collapsed, setCollapsed] = useState(false);
  const [loadingTab, setLoadingTab] = useState(false);

  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchAllData = () => {
    if (!token) return;

    axios
      .get("https://system-backend-2-ty55.onrender.com/lecturers", { headers })
      .then((res) => {
        setLecturers(res.data);
        setStats((prev) => ({ ...prev, totalLecturers: res.data.length }));
      })
      .catch(console.error);

    axios
      .get("https://system-backend-2-ty55.onrender.com/reports", { headers })
      .then((res) => {
        setReports(res.data);
        setStats((prev) => ({ ...prev, totalReports: res.data.length }));
      })
      .catch(console.error);

    axios
      .get("https://system-backend-2-ty55.onrender.com/ratings", { headers })
      .then((res) => {
        setRatings(res.data);
        setStats((prev) => ({ ...prev, totalRatings: res.data.length }));
      })
      .catch(console.error);

    axios
      .get("https://system-backend-2-ty55.onrender.com/assignments", { headers })
      .then((res) => setAssignments(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchAllData();
  }, [token]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, lecturer_id: parseInt(form.lecturer_id) };

    axios
      .post("https://system-backend-2-ty55.onrender.com/rate", payload, { headers })
      .then(() => {
        alert("✅ Rating submitted successfully!");
        setForm({ lecturer_id: "", rating: 5, comment: "" });
        fetchAllData();
      })
      .catch((err) => {
        alert("⚠️ " + (err.response?.data?.error || err.message));
      });
  };

  const handleDeleteRating = (id) => {
    if (!window.confirm("Are you sure you want to delete this rating?")) return;
    axios
      .delete(`https://system-backend-2-ty55.onrender.com/rate/${id}`, { headers })
      .then(() => {
        alert("🗑 Rating deleted successfully!");
        fetchAllData();
      })
      .catch(console.error);
  };

  const getLecturerName = (report) => {
    const lecturer =
      lecturers.find(
        (l) => l.user_id === report.lecturer_id || l.lecturer_id === report.lecturer_id
      ) || {};
    return lecturer.name || lecturer.full_name || "Unknown";
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.25 } },
  };

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setLoadingTab(true);
    setTimeout(() => {
      setActiveTab(tab);
      setLoadingTab(false);
    }, 350);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <Dashboard title="Student Dashboard">
      <div className="d-flex" style={{ minHeight: "100vh", background: "linear-gradient(to right, #eef2ff, #f9faff)" }}>
        {/* Sidebar */}
        <aside
          className={`bg-white shadow-sm p-3 d-flex flex-column sidebar ${collapsed ? "collapsed" : ""}`}
          style={{
            width: collapsed ? 85 : 260,
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
            transition: "all 0.35s ease",
          }}
        >
          <div className="d-flex align-items-center justify-content-between mb-3">
            {!collapsed && <h5 className="fw-bold text-primary mb-0">🎓 Student</h5>}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="btn btn-light rounded-circle shadow-sm toggle-btn"
            >
              <FaBars />
            </button>
          </div>

          {!collapsed && <p className="text-muted small text-center mb-3">{name}</p>}
          <hr />
          <nav className="nav flex-column gap-2">
            {[
              { key: "stats", icon: <FaChartLine />, label: "Dashboard" },
              { key: "reports", icon: <FaClipboardList />, label: "Reports" },
              { key: "rate", icon: <FaStar />, label: "Rate Lecturer" },
              { key: "ratings", icon: <FaChalkboardTeacher />, label: "My Ratings" },
            ].map((tab) => (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                key={tab.key}
                className={`btn nav-item d-flex align-items-center fw-semibold rounded-3 ${
                  activeTab === tab.key ? "btn-gradient text-white" : "btn-light text-dark"
                }`}
                onClick={() => handleTabChange(tab.key)}
              >
                <span className="me-2 fs-5">{tab.icon}</span>
                {!collapsed && tab.label}
              </motion.button>
            ))}
          </nav>

          <div className="mt-auto pt-4">
            <button
              onClick={handleLogout}
              className="btn btn-outline-danger w-100 rounded-3 d-flex align-items-center justify-content-center"
            >
              <FaSignOutAlt className="me-2" />
              {!collapsed && "Logout"}
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-grow-1 d-flex flex-column">
          {/* Top Navbar */}
          <header
            className="glass-navbar px-4 py-3 d-flex align-items-center justify-content-between sticky-top"
          >
            <h5 className="fw-bold text-primary mb-0">
              {activeTab === "stats" && "Dashboard Overview"}
              {activeTab === "reports" && "Reports Monitoring"}
              {activeTab === "rate" && "Rate Lecturer"}
              {activeTab === "ratings" && "My Ratings"}
            </h5>

            <div className="d-flex align-items-center gap-3">
              <button className="btn btn-light rounded-circle shadow-sm">
                <FaBell className="text-primary" />
              </button>
              <div className="d-flex align-items-center">
                <ProfilePicture size={36} className="text-secondary me-2" />
              </div>
            </div>
          </header>

          {/* Content */}
          <section className="flex-grow-1 p-4 overflow-auto">
            {loadingTab ? (
              <ShimmerLoader />
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {/* Dashboard Cards */}
                  {activeTab === "stats" && (
                    <div className="row g-4">
                      {[
                        { title: "Total Reports", value: stats.totalReports, color: "primary", icon: <FaClipboardList size={28} /> },
                        { title: "Total Lecturers", value: stats.totalLecturers, color: "success", icon: <FaChalkboardTeacher size={28} /> },
                        { title: "Total Ratings", value: stats.totalRatings, color: "warning", icon: <FaStar size={28} /> },
                      ].map((card, i) => (
                        <motion.div
                          key={i}
                          className="col-md-4"
                          whileHover={{ scale: 1.03 }}
                        >
                          <div
                            className="card shadow-sm border-0 rounded-4 p-4"
                            style={{ cursor: "pointer", transition: "0.3s" }}
                            onClick={() => {
                              if (card.title === "Total Reports") handleTabChange("reports");
                              if (card.title === "Total Lecturers") handleTabChange("rate");
                              if (card.title === "Total Ratings") handleTabChange("ratings");
                            }}
                          >
                            <div className="d-flex align-items-center justify-content-between">
                              <div>
                                <h6 className="fw-semibold text-muted mb-1">{card.title}</h6>
                                <h2 className={`fw-bold text-${card.color} mb-0`}>{card.value}</h2>
                              </div>
                              <div className={`bg-${card.color} bg-opacity-10 text-${card.color} p-3 rounded-circle`}>
                                {card.icon}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Reports Table */}
                  {activeTab === "reports" && (
                    <div className="card shadow-sm p-4 mt-3 border-0 rounded-4">
                      <h4 className="fw-bold mb-3 text-dark">Reports Monitoring</h4>
                      <div className="table-responsive table-fade">
                        <table className="table align-middle table-hover">
                          <thead className="table-dark rounded-top">
                            <tr>
                              <th>#</th>
                              <th>Class</th>
                              <th>Topic</th>
                              <th>Lecturer</th>
                              <th>Feedback</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reports.map((r, i) => (
                              <tr key={r.report_id}>
                                <td>{i + 1}</td>
                                <td>{r.class_name}</td>
                                <td>{r.topic}</td>
                                <td>{getLecturerName(r)}</td>
                                <td>
                                  {r.prl_feedback ? (
                                    <span className="badge bg-success bg-opacity-75">{r.prl_feedback}</span>
                                  ) : (
                                    <span className="badge bg-secondary bg-opacity-50">Pending</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Rating Form */}
                  {activeTab === "rate" && (
                    <div className="card shadow-sm p-4 mt-3 border-0 rounded-4">
                      <h4 className="fw-bold mb-3 text-dark">Rate a Lecturer</h4>
                      <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                          <label className="form-label fw-semibold">Select Lecturer</label>
                          <select
                            name="lecturer_id"
                            value={form.lecturer_id}
                            onChange={handleChange}
                            className="form-select rounded-3"
                            required
                          >
                            <option value="">-- Choose Lecturer --</option>
                            {lecturers.map((l) => (
                              <option key={l.user_id || l.lecturer_id} value={l.user_id || l.lecturer_id}>
                                {l.name || l.full_name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="mb-3">
                          <label className="form-label fw-semibold">Rating</label>
                          <select
                            name="rating"
                            value={form.rating}
                            onChange={handleChange}
                            className="form-select rounded-3"
                          >
                            {[1, 2, 3, 4, 5].map((n) => (
                              <option key={n} value={n}>
                                {n} Star{n > 1 && "s"}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="mb-3">
                          <label className="form-label fw-semibold">Comment</label>
                          <textarea
                            name="comment"
                            value={form.comment}
                            onChange={handleChange}
                            className="form-control rounded-3"
                            placeholder="Write your feedback..."
                          />
                        </div>
                        <button type="submit" className="btn btn-primary w-100 rounded-3 shadow-sm">
                          Submit Rating
                        </button>
                      </form>
                    </div>
                  )}

                  {/* My Ratings */}
                  {activeTab === "ratings" && (
                    <div className="card shadow-sm p-4 mt-3 border-0 rounded-4">
                      <h4 className="fw-bold mb-3 text-dark">My Submitted Ratings</h4>
                      <div className="table-responsive">
                        <table className="table align-middle table-hover">
                          <thead className="table-dark">
                            <tr>
                              <th>#</th>
                              <th>Lecturer</th>
                              <th>Rating</th>
                              <th>Comment</th>
                              <th>Date</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ratings.length > 0 ? (
                              ratings.map((r, i) => (
                                <tr key={r.rating_id}>
                                  <td>{i + 1}</td>
                                  <td>{r.lecturer_name || getLecturerName(r)}</td>
                                  <td>{r.rating} ⭐</td>
                                  <td>{r.comment}</td>
                                  <td>{r.created_at}</td>
                                  <td>
                                    <button
                                      className="btn btn-sm btn-outline-danger rounded-circle"
                                      onClick={() => handleDeleteRating(r.rating_id)}
                                    >
                                      <FaTrashAlt />
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="6" className="text-center text-muted">
                                  No ratings found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </section>
        </main>
      </div>

      {/* Extra CSS */}
      <style>
        {`
          .btn-gradient {
            background: linear-gradient(90deg, #007bff, #00b4d8);
            border: none;
          }
          .btn-gradient:hover {
            filter: brightness(1.1);
          }
          .glass-navbar {
            background: rgba(255, 255, 255, 0.75);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 0 0 20px 20px;
          }
          .sidebar .nav-item {
            transition: all 0.3s ease;
          }
          .sidebar .nav-item:hover {
            background: #f1f5ff;
          }
          .table-fade {
            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          }
        `}
      </style>
    </Dashboard>
  );
}

export default StudentDashboard;
