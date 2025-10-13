import React, { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChalkboardTeacher,
  FaClipboardList,
  FaStar,
  FaChartLine,
  FaSignOutAlt,
  FaBell,
  FaUserCircle,
  FaBars,
  FaSearch,
} from "react-icons/fa";


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

function LecturerDashboard() {
  const [reports, setReports] = useState([]);
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [stats, setStats] = useState({ totalReports: 0, totalCourses: 0, totalRatings: 0 });
  const [activeTab, setActiveTab] = useState("stats");
  const [collapsed, setCollapsed] = useState(false);
  const [loadingTab, setLoadingTab] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const user_id = parseInt(localStorage.getItem("user_id"));
  const headers = { Authorization: `Bearer ${token}` };

  // Fetch data
  useEffect(() => {
    if (!token || !user_id) return;

    const fetchData = async () => {
      try {
        const reportsRes = await axios.get("https://system-backend-2-ty55.onrender.com/reports", { headers });
        const myReports = reportsRes.data.filter((r) => r.lecturer_name === name);
        setReports(myReports);
        setStats((prev) => ({ ...prev, totalReports: myReports.length }));

        const assignmentsRes = await axios.get("https://system-backend-2-ty55.onrender.com/assignments", { headers });
        const uniqueCourses = Array.from(
          new Map(assignmentsRes.data.map((a) => [a.course_id, a])).values()
        );
        setCourses(uniqueCourses);
        setStats((prev) => ({ ...prev, totalCourses: uniqueCourses.length }));

        const classesRes = await axios.get("https://system-backend-2-ty55.onrender.com/classes", { headers });
        setClasses(classesRes.data);

        const ratingsRes = await axios.get("https://system-backend-2-ty55.onrender.com/ratings", { headers });
        const myRatings = ratingsRes.data.filter((r) => r.lecturer_name === name);
        setRatings(myRatings);
        setStats((prev) => ({ ...prev, totalRatings: myRatings.length }));
      } catch (err) {
        console.error("Data fetch error:", err);
      }
    };

    fetchData();
  }, [token, user_id, name]);

  // Form state for Submit Report
  const [form, setForm] = useState({
    class_id: "",
    course_id: "",
    week_of_reporting: "",
    date_of_lecture: "",
    students_present: "",
    total_students: "",
    venue: "",
    lecture_time: "",
    topic: "",
    learning_outcomes: "",
    recommendations: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmitReport = (e) => {
    e.preventDefault();
    const payload = { ...form, lecturer_name: name, lecturer_id: user_id };

    axios
      .post("https://system-backend-2-ty55.onrender.com/reports", payload, { headers })
      .then((res) => {
        alert("✅ Report submitted successfully!");
        setReports((prev) => [res.data.report, ...prev]);
        setForm({
          class_id: "",
          course_id: "",
          week_of_reporting: "",
          date_of_lecture: "",
          students_present: "",
          total_students: "",
          venue: "",
          lecture_time: "",
          topic: "",
          learning_outcomes: "",
          recommendations: "",
        });
      })
      .catch((err) => {
        console.error(err.response?.data || err.message);
        alert("⚠️ Error submitting report: " + (err.response?.data?.error || err.message));
      });
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
    }, 300);
  };

  
  const filteredReports = reports.filter(
    (r) =>
      r.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.class_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };


const handleDeleteReport = async (report_id) => {
  if (!window.confirm("Are you sure you want to delete this report?")) return;
  try {
    await axios.delete(`https://system-backend-2-ty55.onrender.com/reports/${report_id}`, { headers });
    setReports((prev) => prev.filter((r) => r.report_id !== report_id));
    alert("✅ Report deleted successfully!");
  } catch (err) {
    console.error(err.response?.data || err.message);
    alert("⚠️ Error deleting report: " + (err.response?.data?.error || err.message));
  }
};


  return (
    <Dashboard title="Lecturer Dashboard">
      <div className="d-flex" style={{ minHeight: "100vh", background: "linear-gradient(to right, #f4f7fb, #edf1ff)" }}>
        {/* Sidebar */}
        <aside
          className="bg-white shadow-sm p-3 d-flex flex-column position-sticky top-0"
          style={{
            width: collapsed ? 80 : 260,
            transition: "width 0.25s ease",
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
            overflow: "hidden",
            height: "100vh",
          }}
        >
          <div className="d-flex align-items-center justify-content-between mb-3">
            {!collapsed && <h5 className="fw-bold text-primary mb-0">👨‍🏫 Lecturer</h5>}
            <button onClick={() => setCollapsed(!collapsed)} className="btn btn-light rounded-circle shadow-sm">
              <FaBars />
            </button>
          </div>
          {!collapsed && <p className="text-muted small text-center mb-3">{name}</p>}
          <hr />

          <nav className="nav flex-column gap-2">
            {[
              { key: "stats", icon: <FaChartLine color="#1d232dff" />, label: "Dashboard" },
              { key: "assigned", icon: <FaClipboardList color="#1d232dff" />, label: "Assigned Courses" },
              { key: "report", icon: <FaChalkboardTeacher color="#1d232dff" />, label: "Submit Report" },
              { key: "monitoring", icon: <FaClipboardList color="#1d232dff" />, label: "Monitoring" },
              { key: "ratings", icon: <FaStar color="#1d232dff" />, label: "Ratings" },
            ].map((tab) => (
              <button
                key={tab.key}
                className={`btn d-flex align-items-center fw-semibold rounded-3 ${activeTab === tab.key ? "btn-primary text-white" : "btn-light text-dark"}`}
                onClick={() => handleTabChange(tab.key)}
              >
                <span className="me-2 fs-5">{tab.icon}</span>
                {!collapsed && tab.label}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-4">
            <button onClick={handleLogout} className="btn btn-outline-danger w-100 rounded-3">
              <FaSignOutAlt className="me-2" />
              {!collapsed && "Logout"}
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-grow-1 d-flex flex-column">
          <header
            className="bg-white shadow-sm px-4 py-3 d-flex align-items-center justify-content-between position-sticky top-0"
            style={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20, zIndex: 1000 }}
          >
            <h5 className="fw-bold text-primary mb-0">
              {activeTab === "stats" && "Dashboard Overview"}
              {activeTab === "assigned" && "Assigned Courses"}
              {activeTab === "report" && "Submit Report"}
              {activeTab === "monitoring" && "Reports Monitoring"}
              {activeTab === "ratings" && "Student Ratings"}
            </h5>
            <div className="d-flex align-items-center gap-3">
              <button className="btn btn-light rounded-circle shadow-sm">
                <FaBell className="text-primary" />
              </button>
              <div className="d-flex align-items-center">
                <FaUserCircle size={32} className="text-secondary me-2" />
                {!collapsed && (
                  <div>
                    <p className="mb-0 fw-semibold text-dark">{name}</p>
                    <small className="text-muted">Lecturer</small>
                  </div>
                )}
              </div>
            </div>
          </header>

          <section className="flex-grow-1 p-4 overflow-auto">
            {loadingTab ? (
              <ShimmerLoader />
            ) : (
              <AnimatePresence mode="wait">
                <motion.div key={activeTab} variants={tabVariants} initial="hidden" animate="visible" exit="exit">
                  {/* Dashboard Cards */}
                  {activeTab === "stats" && (
                    <div className="row g-4 mb-4">
                      {[
                        { title: "Total Reports", value: stats.totalReports, icon: <FaClipboardList size={28} />, color: "primary", tab: "report" },
                        { title: "Total Courses", value: stats.totalCourses, icon: <FaChalkboardTeacher size={28} />, color: "success", tab: "assigned" },
                        { title: "Total Ratings", value: stats.totalRatings, icon: <FaStar size={28} />, color: "warning", tab: "ratings" },
                      ].map((card, i) => (
                        <div key={i} className="col-12 col-sm-6 col-md-4">
                          <div className="card p-4 shadow-sm rounded-4 border-0" style={{ cursor: "pointer" }} onClick={() => handleTabChange(card.tab)}>
                            <div className="d-flex align-items-center justify-content-between">
                              <div>
                                <h6 className="mb-1 text-muted">{card.title}</h6>
                                <h4 className={`mb-0 text-${card.color}`}>{card.value}</h4>
                              </div>
                              <div className={`p-3 rounded-circle bg-${card.color} bg-opacity-10 text-${card.color}`}>{card.icon}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Assigned Courses */}
                  {activeTab === "assigned" && (
                    <div className="card shadow-sm p-4 mt-3 border-0 rounded-4">
                      <h4 className="fw-bold mb-3 text-dark">Assigned Courses</h4>
                      <div className="table-responsive">
                        <table className="table table-striped align-middle">
                          <thead className="table-dark">
                            <tr>
                              <th>#</th>
                              <th>Course Code</th>
                              <th>Course Name</th>
                              <th>Class</th>
                              <th>Year</th>
                            </tr>
                          </thead>
                          <tbody>
                            {courses.map((c, i) => (
                              <tr key={c.course_id}>
                                <td>{i + 1}</td>
                                <td>{c.course_code}</td>
                                <td>{c.course_name}</td>
                                <td>{c.class_name || "N/A"}</td>
                                <td>{c.year_of_study || "N/A"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Submit Report */}
                  {activeTab === "report" && (
                    <div className="card shadow-sm p-4 mt-3 border-0 rounded-4">
                      <h4 className="fw-bold mb-4 text-dark">Submit Lecture Report</h4>
                      <form onSubmit={handleSubmitReport}>
                        <div className="row g-3">
                          {/* Class & Course */}
                          <div className="col-md-6">
                            <label className="form-label fw-semibold">Class</label>
                            <select className="form-select" name="class_id" value={form.class_id} onChange={handleChange} required>
                              <option value="">Select Class</option>
                              {classes.map((cls) => (
                                <option key={cls.class_id} value={cls.class_id}>{cls.class_name}</option>
                              ))}
                            </select>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-semibold">Course</label>
                            <select className="form-select" name="course_id" value={form.course_id} onChange={handleChange} required>
                              <option value="">Select Course</option>
                              {courses.map((c) => (
                                <option key={c.course_id} value={c.course_id}>{c.course_name} ({c.course_code})</option>
                              ))}
                            </select>
                          </div>

                          {/* Week & Date */}
                          <div className="col-md-6">
                            <label className="form-label fw-semibold">Week of Reporting</label>
                            <input type="text" name="week_of_reporting" value={form.week_of_reporting} onChange={handleChange} className="form-control" placeholder="e.g., Week 5" required />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-semibold">Date of Lecture</label>
                            <input type="date" name="date_of_lecture" value={form.date_of_lecture} onChange={handleChange} className="form-control" required />
                          </div>

                          {/* Students & Venue */}
                          <div className="col-md-6">
                            <label className="form-label fw-semibold">Students Present</label>
                            <input type="number" name="students_present" value={form.students_present} onChange={handleChange} className="form-control" min="0" required />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-semibold">Total Students</label>
                            <input type="number" name="total_students" value={form.total_students} onChange={handleChange} className="form-control" min="0" required />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-semibold">Venue</label>
                            <input type="text" name="venue" value={form.venue} onChange={handleChange} className="form-control" placeholder="Lecture Hall / Room" required />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-semibold">Lecture Time</label>
                            <input type="time" name="lecture_time" value={form.lecture_time} onChange={handleChange} className="form-control" required />
                          </div>

                          {/* Topic & Outcomes */}
                          <div className="col-12">
                            <label className="form-label fw-semibold">Topic Covered</label>
                            <input type="text" name="topic" value={form.topic} onChange={handleChange} className="form-control" required />
                          </div>
                          <div className="col-12">
                            <label className="form-label fw-semibold">Learning Outcomes</label>
                            <textarea name="learning_outcomes" value={form.learning_outcomes} onChange={handleChange} className="form-control" rows="3" required></textarea>
                          </div>
                          <div className="col-12">
                            <label className="form-label fw-semibold">Recommendations / Remarks</label>
                            <textarea name="recommendations" value={form.recommendations} onChange={handleChange} className="form-control" rows="3"></textarea>
                          </div>

                          <div className="col-12 text-end">
                            <button type="submit" className="btn btn-primary rounded-4 px-4">Submit Report</button>
                          </div>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Monitoring */}
                  {activeTab === "monitoring" && (
                    <div className="card shadow-sm p-4 mt-3 border-0 rounded-4">
                      <h4 className="fw-bold mb-3 text-dark">Reports Monitoring</h4>
                      <div className="input-group mb-3">
                        <span className="input-group-text bg-white"><FaSearch /></span>
                        <input type="text" className="form-control" placeholder="Search reports..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                      </div>
                      <div className="table-responsive">
                        <table className="table table-striped align-middle">
                          <thead className="table-dark">
                            <tr>
                              <th>#</th>
                              <th>Course</th>
                              <th>Class</th>
                              <th>Topic</th>
                              <th>Date</th>
                              <th>Week</th>
                              <th>PRL Feedback</th>
                            </tr>
                          </thead>
                          
                          <tbody>
  {filteredReports.map((r, i) => (
    <tr key={r.report_id}>
      <td>{i + 1}</td>
      <td>{r.course_name}</td>
      <td>{r.class_name}</td>
      <td>{r.topic}</td>
      <td>{r.date_of_lecture}</td>
      <td>{r.week_of_reporting}</td>
      <td>{r.prl_feedback || "Pending"}</td>
      <td>
      <button className="btn btn-sm btn-danger" onClick={() => handleDeleteReport(r.report_id)}>
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>

                        </table>
                      </div>
                    </div>
                  )}

                  {/* Ratings */}
                  {activeTab === "ratings" && (
                    <div className="card shadow-sm p-4 mt-3 border-0 rounded-4">
                      <h4 className="fw-bold mb-3 text-dark">Student Ratings</h4>
                      <div className="table-responsive">
                        <table className="table table-striped align-middle">
                          <thead className="table-dark">
                            <tr>
                              <th>#</th>
                              <th>Student Name</th>
                              <th>Rating</th>
                              <th>Comment</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ratings.map((r, i) => (
                              <tr key={r.rating_id}>
                                <td>{i + 1}</td>
                                <td>{r.student_name}</td>
                                <td>{r.rating}</td>
                                <td>{r.comment || "-"}</td>
                                <td>{r.created_at}</td>
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

export default LecturerDashboard;
