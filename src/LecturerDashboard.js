import React, { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";

function LecturerDashboard() {
  const [reports, setReports] = useState([]);
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [ratings, setRatings] = useState([]);
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
  const [stats, setStats] = useState({ totalReports: 0, totalCourses: 0 });
  const [activeTab, setActiveTab] = useState("stats");
  const [expandedRow, setExpandedRow] = useState(null);

  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const headers = { Authorization: `Bearer ${token}` };
  const user_id = parseInt(localStorage.getItem("user_id"));

  // --- Fetch all data ---
  useEffect(() => {
    if (!token || !user_id) return;

    const fetchData = async () => {
      try {
        // 1️⃣ Reports
        const reportsRes = await axios.get("https://system-backend-2-ty55.onrender.com/reports", { headers });
        const myReports = reportsRes.data.filter((r) => r.lecturer_name === name);
        setReports(myReports);
        setStats((prev) => ({ ...prev, totalReports: myReports.length }));

        // 2️⃣ Assigned Courses
        const assignmentsRes = await axios.get("https://system-backend-2-ty55.onrender.com/assignments", { headers });
        const assigned = assignmentsRes.data;
        const uniqueCourses = Array.from(
          new Map(
            assigned.map((a) => [
              a.course_id,
              {
                course_id: a.course_id,
                course_name: a.course_name,
                course_code: a.course_code,
                class_name: a.class_name,
                year_of_study: a.year_of_study,
              },
            ])
          ).values()
        );
        setCourses(uniqueCourses);
        setStats((prev) => ({ ...prev, totalCourses: uniqueCourses.length }));

        // 3️⃣ Classes
        const classesRes = await axios.get("https://system-backend-2-ty55.onrender.com/classes", { headers });
        setClasses(classesRes.data);

        // 4️⃣ Ratings
        const ratingsRes = await axios.get("https://system-backend-2-ty55.onrender.com/ratings", { headers });
        const myRatings = ratingsRes.data.filter((r) => r.lecturer_name === name);
        setRatings(myRatings);
      } catch (err) {
        console.error("Data fetch error:", err);
      }
    };

    fetchData();
  }, [token, user_id, name]);

  // --- Form handlers ---
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmitReport = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      lecturer_name: name,
      lecturer_id: user_id,
    };

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

  // --- UI ---
  return (
    <Dashboard title="Lecturer Dashboard">
      <div className="container-fluid">
        <div className="alert alert-info mb-4 text-center">
          👋 Welcome back, <strong>{name}</strong>!
        </div>

        {/* Navigation Tabs */}
        <ul className="nav nav-tabs mb-4 flex-wrap justify-content-center">
          {["stats", "assigned", "report", "monitoring", "ratings"].map((tab) => (
            <li className="nav-item" key={tab}>
              <button
                className={`nav-link ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "stats"
                  ? "Stats"
                  : tab === "assigned"
                  ? "Assigned Courses"
                  : tab === "report"
                  ? "Submit Report"
                  : tab === "monitoring"
                  ? "Monitoring"
                  : "Ratings"}
              </button>
            </li>
          ))}
        </ul>

        {/* Stats Tab */}
        {activeTab === "stats" && (
          <div className="row mb-4">
            <div className="col-md-4 mb-3">
              <div className="card bg-primary text-white shadow-sm">
                <div className="card-body text-center">
                  <h5>Total Reports Submitted</h5>
                  <h3>{stats.totalReports}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card bg-success text-white shadow-sm">
                <div className="card-body text-center">
                  <h5>Total Courses Assigned</h5>
                  <h3>{stats.totalCourses}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card bg-warning text-white shadow-sm text-center">
                <div className="card-body">
                  <h5>Total Ratings</h5>
                  <h3>{ratings.length}</h3>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assigned Courses Tab */}
        {activeTab === "assigned" && (
          <div className="card shadow-sm p-4 mb-5">
            <h4>📘 Courses Assigned to You</h4>
            <p className="text-muted mb-3">
              Below is a list of all courses and classes assigned to <strong>{name}</strong>.
            </p>
            {courses.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-striped align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Course Code</th>
                      <th>Course Name</th>
                      <th>Class</th>
                      <th>Year of Study</th>
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
            ) : (
              <div className="alert alert-warning">No courses assigned yet.</div>
            )}
          </div>
        )}

        {/* Submit Report Tab */}
        {activeTab === "report" && (
          <div className="card shadow-sm p-4 mb-5">
            <h4>📝 Submit Lecture Report</h4>
            <form onSubmit={handleSubmitReport}>
              <div className="mb-3">
                <label className="form-label">Lecturer Name</label>
                <input type="text" className="form-control" value={name} disabled />
              </div>

              <div className="mb-3">
                <label className="form-label">Select Course</label>
                <select
                  name="course_id"
                  value={form.course_id}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">-- Choose Course --</option>
                  {courses.map((c) => (
                    <option key={c.course_id} value={c.course_id}>
                      {c.course_name} ({c.course_code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Select Class</label>
                <select
                  name="class_id"
                  value={form.class_id}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">-- Choose Class --</option>
                  {classes.map((cls) => (
                    <option key={cls.class_id} value={cls.class_id}>
                      {cls.class_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Week of Reporting</label>
                  <input
                    type="text"
                    name="week_of_reporting"
                    value={form.week_of_reporting}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="e.g. Week 3"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Date of Lecture</label>
                  <input
                    type="date"
                    name="date_of_lecture"
                    value={form.date_of_lecture}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Students Present</label>
                  <input
                    type="number"
                    name="students_present"
                    value={form.students_present}
                    onChange={handleChange}
                    className="form-control"
                    min={0}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Total Students</label>
                  <input
                    type="number"
                    name="total_students"
                    value={form.total_students}
                    onChange={handleChange}
                    className="form-control"
                    min={0}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Venue</label>
                <input
                  type="text"
                  name="venue"
                  value={form.venue}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Lecture Time</label>
                <input
                  type="text"
                  name="lecture_time"
                  value={form.lecture_time}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="e.g. 10:00 AM - 12:00 PM"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Topic</label>
                <textarea
                  name="topic"
                  value={form.topic}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Lecture topic"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Learning Outcomes</label>
                <textarea
                  name="learning_outcomes"
                  value={form.learning_outcomes}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="What students learned..."
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Recommendations</label>
                <textarea
                  name="recommendations"
                  value={form.recommendations}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Suggestions for improvement..."
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Submit Report
              </button>
            </form>
          </div>
        )}

        {/* Monitoring Tab */}
        {activeTab === "monitoring" && (
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Course</th>
                  <th>Class</th>
                  <th>Topic</th>
                  <th>Date</th>
                  <th>Week</th>
                  <th>PRL Feedback</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r, i) => (
                  <React.Fragment key={i}>
                    <tr>
                      <td>{i + 1}</td>
                      <td>{r.course_name}</td>
                      <td>{r.class_name}</td>
                      <td>{r.topic}</td>
                      <td>{r.date_of_lecture}</td>
                      <td>{r.week_of_reporting || "N/A"}</td>
                      <td>{r.prl_feedback || "Pending"}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          type="button"
                          onClick={() =>
                            setExpandedRow(expandedRow === r.report_id ? null : r.report_id)
                          }
                        >
                          {expandedRow === r.report_id ? "Hide" : "Show"}
                        </button>
                      </td>
                    </tr>

                    {expandedRow === r.report_id && (
                      <tr>
                        <td colSpan={8}>
                          <div className="p-2 border rounded bg-light">
                            <p><strong>Students Present:</strong> {r.students_present || "N/A"}</p>
                            <p><strong>Total Students:</strong> {r.total_students || "N/A"}</p>
                            <p><strong>Venue:</strong> {r.venue || "N/A"}</p>
                            <p><strong>Lecture Time:</strong> {r.lecture_time || "N/A"}</p>
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
        )}

        {/* Ratings Tab */}
        {activeTab === "ratings" && (
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead className="table-light">
                <tr>
                  <th>Student</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {ratings.length > 0 ? (
                  ratings.map((r) => (
                    <tr key={r.rating_id}>
                      <td>{r.student_name}</td>
                      <td>{r.rating}</td>
                      <td>{r.comment || "-"}</td>
                      <td>{r.created_at}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">
                      No ratings received yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Dashboard>
  );
}

export default LecturerDashboard;
