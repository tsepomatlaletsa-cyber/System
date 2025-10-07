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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function PRLDashboard() {
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  const faculty_id = localStorage.getItem("faculty_id");
  const headers = { Authorization: `Bearer ${token}` };

  const [activeTab, setActiveTab] = useState("dashboard");
  const [courses, setCourses] = useState([]);
  const [reports, setReports] = useState([]);
  const [classes, setClasses] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [feedbackForm, setFeedbackForm] = useState({ report_id: "", feedback: "" });
  const [expandedRow, setExpandedRow] = useState(null);

  // --- Fetch all data ---
  useEffect(() => {
    if (!token) return;

    const fetchAll = async () => {
      try {
        const [coursesRes, reportsRes, classesRes, ratingsRes] = await Promise.all([
          axios.get(`https://system-backend-2-ty55.onrender.com/courses?faculty_id=${faculty_id}`, { headers }),
          axios.get(`https://system-backend-2-ty55.onrender.com/reports?faculty_id=${faculty_id}`, { headers }),
          axios.get(`https://system-backend-2-ty55.onrender.com/classes`, { headers }),
          axios.get(`https://system-backend-2-ty55.onrender.com/ratings?faculty_id=${faculty_id}`, { headers }),
        ]);

        setCourses(coursesRes.data);
        setReports(reportsRes.data);
        setClasses(classesRes.data);
        setRatings(ratingsRes.data);
      } catch (err) {
        console.error("Data fetch error:", err);
      }
    };

    fetchAll();
  }, [token, faculty_id]);

  // --- Feedback Handlers ---
  const handleFeedbackChange = (e) =>
    setFeedbackForm({ ...feedbackForm, [e.target.name]: e.target.value });

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `https://system-backend-2-ty55.onrender.com/reports/${feedbackForm.report_id}/feedback`,
        { feedback: feedbackForm.feedback },
        { headers }
      );
      alert("✅ Feedback submitted!");
      setFeedbackForm({ report_id: "", feedback: "" });

      const updatedReports = await axios.get(
        `https://system-backend-2-ty55.onrender.com/reports?faculty_id=${faculty_id}`,
        { headers }
      );
      setReports(updatedReports.data);
    } catch (err) {
      console.error(err);
      alert("⚠️ Error submitting feedback");
    }
  };

  // --- Monitoring Chart ---
  const monitoringData = {
    labels: reports.map((r) => r.class_name),
    datasets: [
      {
        label: "Student Attendance %",
        data: reports.map((r) =>
          r.total_students ? (r.students_present / r.total_students) * 100 : 0
        ),
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  return (
    <Dashboard title="Program Review Leader Dashboard">
      <div className="container-fluid">
        <div className="alert alert-info mb-4">
          👋 Welcome back, <strong>{name}</strong> ({email})
        </div>

        {/* Navigation Tabs */}
        <ul className="nav nav-tabs mb-4">
          {["dashboard", "courses", "reports", "monitoring", "classes", "ratings"].map((tab) => (
            <li className="nav-item" key={tab}>
              <button
                className={`nav-link ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            </li>
          ))}
        </ul>

        {/* Dashboard Overview */}
        {activeTab === "dashboard" && (
          <div className="row mb-4">
            <div className="col-md-4 mb-3">
              <div className="card bg-primary text-white shadow-sm p-3 text-center">
                <h5>Total Courses</h5>
                <h3>{courses.length}</h3>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card bg-success text-white shadow-sm p-3 text-center">
                <h5>Total Reports</h5>
                <h3>{reports.length}</h3>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card bg-warning text-white shadow-sm p-3 text-center">
                <h5>Total Ratings</h5>
                <h3>{ratings.length}</h3>
              </div>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === "courses" && (
          <div>
            <h4 className="mb-3">Courses</h4>
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
                  {courses.map((c, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{c.course_name}</td>
                      <td>{c.course_code}</td>
                      <td>{c.faculty_name}</td>
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
            <h4 className="mb-3">Lecturer Reports & PRL Feedback</h4>
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
                  {reports.map((r, i) => (
                    <React.Fragment key={i}>
                      <tr>
                        <td>{i + 1}</td>
                        <td>{r.class_name}</td>
                        <td>{r.topic}</td>
                        <td>{r.lecturer_name}</td>
                        <td>{r.date_of_lecture || "N/A"}</td>
                        <td>{r.prl_feedback || "Pending"}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-info"
                            onClick={() =>
                              setExpandedRow(expandedRow === r.report_id ? null : r.report_id)
                            }
                          >
                            {expandedRow === r.report_id ? "Hide" : "View"}
                          </button>
                        </td>
                      </tr>
                      {expandedRow === r.report_id && (
                        <tr>
                          <td colSpan="7">
                            <div className="p-3 bg-light rounded">
                              <p><strong>Learning Outcomes:</strong> {r.learning_outcomes || "N/A"}</p>
                              <p><strong>Recommendations:</strong> {r.recommendations || "N/A"}</p>
                              <p><strong>Students Present:</strong> {r.students_present || "N/A"}</p>
                              <p><strong>Total Students:</strong> {r.total_students || "N/A"}</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Feedback Form */}
            <div className="card p-3 shadow-sm">
              <h5>Submit PRL Feedback</h5>
              <form onSubmit={handleFeedbackSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <select
                      name="report_id"
                      value={feedbackForm.report_id}
                      onChange={handleFeedbackChange}
                      className="form-select"
                      required
                    >
                      <option value="">-- Choose Report --</option>
                      {reports.map((r) => (
                        <option key={r.report_id} value={r.report_id}>
                          {r.report_id} - {r.topic} ({r.class_name})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <textarea
                      name="feedback"
                      value={feedbackForm.feedback}
                      onChange={handleFeedbackChange}
                      className="form-control"
                      placeholder="Write feedback..."
                      required
                    />
                  </div>
                </div>
                <button className="btn btn-primary">Submit</button>
              </form>
            </div>
          </div>
        )}

        {/* Monitoring Tab */}
        {activeTab === "monitoring" && (
          <div>
            <h4 className="mb-3">Monitoring Overview</h4>
            <Bar data={monitoringData} options={{ responsive: true }} />
          </div>
        )}

        {/* Classes Tab */}
        {activeTab === "classes" && (
          <div>
            <h4 className="mb-3">Classes</h4>
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
                  {classes.map((c, i) => (
                    <tr key={i}>
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
            <h4 className="mb-3">Lecturer Ratings</h4>
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
                  {ratings.map((r, i) => (
                    <tr key={i}>
                      <td>{r.lecturer_name}</td>
                      <td>{r.student_name}</td>
                      <td>{r.rating}</td>
                      <td>{r.comment || "No comment"}</td>
                      <td>{r.created_at || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Dashboard>
  );
}

export default PRLDashboard;
