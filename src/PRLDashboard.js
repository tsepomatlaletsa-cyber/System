// PRLDashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import {
  FaChalkboardTeacher,
  FaClipboardList,
  FaStar,
  FaChartLine,
  FaSignOutAlt,
  FaBell,
  FaUserCircle,
  FaBars,
  FaUserTie,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ShimmerLoader = () => (
  <div className="w-100">
    <div className="row g-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="col-md-4">
          <div className="card p-4 rounded-4 border-0">
            <div className="placeholder-glow">
              <div className="placeholder col-8 mb-3"></div>
              <div className="placeholder col-6"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

function PRLDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  const faculty_id = localStorage.getItem("faculty_id");
  const headers = { Authorization: `Bearer ${token}` };

  const [activeTab, setActiveTab] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [loadingTab, setLoadingTab] = useState(false);

  const [courses, setCourses] = useState([]);
  const [reports, setReports] = useState([]);
  const [classes, setClasses] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!token) return;
    const fetchAll = async () => {
      try {
        const [coursesRes, reportsRes, classesRes, ratingsRes, lecturersRes, assignmentsRes] =
          await Promise.all([
            axios.get(`https://system-backend-2-ty55.onrender.com/courses${faculty_id ? `?faculty_id=${faculty_id}` : ""}`, { headers }),
            axios.get(`https://system-backend-2-ty55.onrender.com/reports${faculty_id ? `?faculty_id=${faculty_id}` : ""}`, { headers }),
            axios.get(`https://system-backend-2-ty55.onrender.com/classes`, { headers }),
            axios.get(`https://system-backend-2-ty55.onrender.com/ratings${faculty_id ? `?faculty_id=${faculty_id}` : ""}`, { headers }),
            axios.get(`https://system-backend-2-ty55.onrender.com/lecturers`, { headers }),
            axios.get(`https://system-backend-2-ty55.onrender.com/assignments`, { headers }),
          ]);

        setCourses(coursesRes.data || []);
        setReports(reportsRes.data || []);
        setClasses(classesRes.data || []);
        setRatings(ratingsRes.data || []);
        setLecturers(lecturersRes.data || []);
        setAssignments(assignmentsRes.data || []);
      } catch (err) {
        console.error("Data fetch error:", err);
      }
    };
    fetchAll();
  }, [token, faculty_id]);


  const handleFeedbackChange = (reportId, value) => {
    setReports((prev) =>
      prev.map((r) => (r.report_id === reportId ? { ...r, prl_feedback: value } : r))
    );
  };

  const handleFeedbackSave = async (reportId, feedback) => {
    try {
      await axios.put(
        `https://system-backend-2-ty55.onrender.com/reports/${reportId}/feedback`,
        { feedback },
        { headers }
      );
      
    } catch (err) {
      console.error(err);
      alert("⚠️ Error updating feedback");
    }
  };

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setLoadingTab(true);
    setTimeout(() => {
      setActiveTab(tab);
      setLoadingTab(false);
      setSearchQuery("");
    }, 300);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const filterData = (data = [], keys = []) => {
    if (!searchQuery) return data;
    const q = searchQuery.toLowerCase();
    return data.filter((item) =>
      keys.some((key) => (item[key] ?? "").toString().toLowerCase().includes(q))
    );
  };

  const monitoringData = {
    labels: reports.map((r) => r.class_name || `Class ${r.class_id || "-"}`),
    datasets: [
      {
        label: "Student Attendance %",
        data: reports.map((r) =>
          r.total_students ? Math.round((r.students_present / r.total_students) * 100 * 100) / 100 : 0
        ),
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.25 } },
  };

  return (
    <Dashboard title="Program Review Leader Dashboard">
      <div className="d-flex" style={{ minHeight: "100vh", background: "linear-gradient(to right, #f4f7fb, #edf1ff)" }}>
        {/* Sidebar */}
        <aside
          className="bg-white shadow-sm p-3 d-flex flex-column"
          style={{
            width: collapsed ? 80 : 260,
            transition: "width 0.25s ease",
            position: "sticky",
            top: 0,
            height: "100vh",
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
            zIndex: 20,
            overflow: "hidden",
          }}
        >
          <div className="d-flex align-items-center justify-content-between mb-3">
            {!collapsed && <h5 className="fw-bold text-primary mb-0">📚 PRL Dashboard</h5>}
            <button onClick={() => setCollapsed((s) => !s)} className="btn btn-light rounded-circle shadow-sm">
              <FaBars />
            </button>
          </div>

          {!collapsed && <p className="text-muted small text-center mb-3">{name}</p>}
          <hr />

          <nav className="nav flex-column gap-2">
            {[
              { key: "dashboard", icon: <FaChartLine color="#585e67ff" />, label: "Dashboard" },
              { key: "courses", icon: <FaChalkboardTeacher color="#585e67ff" />, label: "Courses" },
              { key: "reports", icon: <FaClipboardList color="#585e67ff" />, label: "Reports" },
              { key: "monitoring", icon: <FaChartLine color="#585e67ff" />, label: "Monitoring" },
              { key: "classes", icon: <FaChalkboardTeacher color="#585e67ff" />, label: "Classes" },
              { key: "ratings", icon: <FaStar color="#585e67ff" />, label: "Ratings" },
            ].map((tab) => (
              <button
                key={tab.key}
                className={`btn d-flex align-items-center fw-semibold rounded-3 ${
                  activeTab === tab.key ? "btn-primary text-white" : "btn-light text-dark"
                }`}
                onClick={() => handleTabChange(tab.key)}
                style={{ whiteSpace: "nowrap" }}
              >
                <span className="me-2 fs-5">{tab.icon}</span>
                {!collapsed && tab.label}
              </button>
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
          <header className="bg-white shadow-sm px-4 py-3 d-flex align-items-center justify-content-between" style={{ position: "sticky", top: 0, zIndex: 50, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
            <h5 className="fw-bold text-primary mb-0">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h5>
            <div className="d-flex align-items-center gap-3">
              <button className="btn btn-light rounded-circle shadow-sm"><FaBell className="text-primary" /></button>
              <FaUserCircle size={32} className="text-secondary" />
              {!collapsed && <div className="text-end"><div className="fw-semibold">{name}</div><small className="text-muted">{email}</small></div>}
            </div>
          </header>

          <section className="flex-grow-1 p-4 overflow-auto">
            {loadingTab ? <ShimmerLoader /> : (
              <AnimatePresence mode="wait">
                <motion.div key={activeTab} variants={tabVariants} initial="hidden" animate="visible" exit="exit">

                  {/* Dashboard Cards */}
                  {activeTab === "dashboard" && (
                    <div className="row g-4 mb-4">
                      {[
                        { label: "Total Courses", value: courses.length, tab: "courses", icon: <FaChalkboardTeacher size={28} color="#0d6efd" /> },
                        { label: "Total Reports", value: reports.length, tab: "reports", icon: <FaClipboardList size={28} color="#0d6efd" /> },
                        { label: "Total Ratings", value: ratings.length, tab: "ratings", icon: <FaStar size={28} color="#0d6efd" /> },
                        { label: "Total Assignments", value: assignments.length, tab: "assignments", icon: <FaClipboardList size={28} color="#0d6efd" /> },
                        { label: "Total Classes", value: classes.length, tab: "classes", icon: <FaChalkboardTeacher size={28} color="#0d6efd" /> },
                        { label: "Total Lecturers", value: lecturers.length, tab: "lecturers", icon: <FaUserTie size={28} color="#0d6efd" /> },
                      ].map((card, i) => (
                        <div key={i} className="col-12 col-md-6 col-lg-4">
                          <div className="card p-3 shadow-sm rounded-4 border-0" style={{ cursor: "pointer" }} onClick={() => handleTabChange(card.tab)}>
                            <div className="d-flex align-items-center">
                              <div className="me-3">{card.icon}</div>
                              <div>
                                <h6 className="mb-0 text-muted">{card.label}</h6>
                                <h4 className="mb-0">{card.value}</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Courses Tab */}
                  {activeTab === "courses" && (
                    <div>
                      <div className="mb-3 d-flex justify-content-between align-items-center gap-3 flex-column flex-md-row">
                        <h4 className="mb-2 mb-md-0">Courses</h4>
                        <input type="text" placeholder="Search Courses..." className="form-control w-100 w-md-25" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                      </div>
                      <div className="table-responsive">
                        <table className="table table-striped align-middle">
                          <thead className="table-light">
                            <tr>
                              <th>#</th>
                              <th>Name</th>
                              <th>Code</th>
                              <th>Faculty</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filterData(courses, ["course_name", "course_code", "faculty_name"]).map((c, i) => (
                              <tr key={c.course_id || i}>
                                <td>{i + 1}</td>
                                <td>{c.course_name}</td>
                                <td>{c.course_code}</td>
                                <td>{c.faculty_name || "N/A"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Reports Tab */}
                  {activeTab === "reports" && (
                    <div>
                      <div className="mb-3 d-flex justify-content-between align-items-center gap-3 flex-column flex-md-row">
                        <h4 className="mb-2 mb-md-0">Lecturer Reports & PRL Feedback</h4>
                        <input type="text" placeholder="Search Reports..." className="form-control w-100 w-md-25" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                      </div>

                      <div className="table-responsive mb-4">
                        <table className="table table-bordered align-middle">
                          <thead className="table-light">
                            <tr>
                              <th>#</th>
                              <th>Class</th>
                              <th>Topic</th>
                              <th>Lecturer</th>
                              <th>Date</th>
                              <th>Feedback</th>
                              <th>Details</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filterData(reports, ["course_name", "class_name", "lecturer_name", "topic"]).map((r, i) => (
                              <React.Fragment key={r.report_id || i}>
                                <tr>
                                  <td>{i + 1}</td>
                                  <td>{r.class_name}</td>
                                  <td>{r.topic}</td>
                                  <td>{r.lecturer_name}</td>
                                  <td>{r.date_of_lecture || "N/A"}</td>
                                  <td>
                                    <input
                                      type="text"
                                      value={r.prl_feedback || ""}
                                      onChange={(e) => handleFeedbackChange(r.report_id, e.target.value)}
                                      onBlur={() => handleFeedbackSave(r.report_id, r.prl_feedback)}
                                      className="form-control form-control-sm"
                                    />
                                  </td>
                                  <td>
                                    <button className="btn btn-sm btn-outline-dark" type="button" onClick={() => setExpandedRow(expandedRow === r.report_id ? null : r.report_id)}>
                                      {expandedRow === r.report_id ? "Hide" : "Show"}
                                    </button>
                                  </td>
                                </tr>
                                {expandedRow === r.report_id && (
                                  <tr>
                                    <td colSpan={7}>
                                      <div className="p-3 border rounded bg-light">
                                        <p><strong>Students Present:</strong> {r.students_present || "N/A"}</p>
                                        <p><strong>Total Students:</strong> {r.total_students || "N/A"}</p>
                                        <p><strong>Learning Outcomes:</strong> {r.learning_outcomes || "N/A"}</p>
                                        <p><strong>Recommendations:</strong> {r.recommendations || "N/A"}</p>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Monitoring Tab */}
                  {activeTab === "monitoring" && (
                    <div>
                      <h4 className="mb-3">Monitoring Overview</h4>
                      <div style={{ maxWidth: 900 }}>
                        <Bar data={monitoringData} options={{ responsive: true, maintainAspectRatio: false }} />
                      </div>
                    </div>
                  )}

                  {/* Classes Tab */}
                  {activeTab === "classes" && (
                    <div>
                      <div className="mb-3 d-flex justify-content-between align-items-center gap-3 flex-column flex-md-row">
                        <h4 className="mb-2 mb-md-0">Classes</h4>
                        <input type="text" placeholder="Search Classes..." className="form-control w-100 w-md-25" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                      </div>
                      <div className="table-responsive">
                        <table className="table table-striped align-middle">
                          <thead className="table-light">
                            <tr>
                              <th>#</th>
                              <th>Name</th>
                              <th>Year</th>
                              <th>Faculty</th>
                              <th>Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filterData(classes, ["class_name", "faculty_name"]).map((c, i) => (
                              <tr key={c.class_id || i}>
                                <td>{i + 1}</td>
                                <td>{c.class_name}</td>
                                <td>{c.year_of_study || "N/A"}</td>
                                <td>{c.faculty_name}</td>
                                <td>{c.description || "-"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Ratings Tab */}
                  {activeTab === "ratings" && (
                    <div>
                      <div className="mb-3 d-flex justify-content-between align-items-center gap-3 flex-column flex-md-row">
                        <h4 className="mb-2 mb-md-0">Ratings</h4>
                        <input type="text" placeholder="Search Ratings..." className="form-control w-100 w-md-25" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                      </div>
                      <div className="table-responsive">
                        <table className="table table-striped align-middle">
                          <thead className="table-light">
                            <tr>
                              <th>Lecturer</th>
                              <th>Student</th>
                              <th>Rating</th>
                              <th>Comment</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filterData(ratings, ["lecturer_name", "student_name"]).map((r, i) => (
                              <tr key={r.rating_id || i}>
                                <td>{r.lecturer_name}</td>
                                <td>{r.student_name}</td>
                                <td>{r.rating}</td>
                                <td>{r.comment || "No comment"}</td>
                                <td>{r.created_at || r.date || "N/A"}</td>
                              </tr>
                            ))}
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
    </Dashboard>
  );
}

export default PRLDashboard;
