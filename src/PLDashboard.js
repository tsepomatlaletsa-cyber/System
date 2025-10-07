import React, { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";

function PLDashboard() {
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  const headers = { Authorization: `Bearer ${token}` };

  const [activeTab, setActiveTab] = useState("courses");
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ course_name: "", course_code: "" });
  const [lecturers, setLecturers] = useState([]);
  const [assignCourse, setAssignCourse] = useState({ course_id: "", lecturer_id: "" });
  const [assignments, setAssignments] = useState([]);
  const [reports, setReports] = useState([]);
  const [classes, setClasses] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);

  // --- Fetch all data ---
  useEffect(() => {
    if (!token) return;

    const fetchAll = async () => {
      try {
        const [coursesRes, lecturersRes, assignmentsRes, reportsRes, classesRes, ratingsRes] =
          await Promise.all([
            axios.get("http://localhost:5000/courses", { headers }),
            axios.get("http://localhost:5000/lecturers", { headers }),
            axios.get("http://localhost:5000/assignments", { headers }),
            axios.get("http://localhost:5000/reports", { headers }),
            axios.get("http://localhost:5000/classes", { headers }),
            axios.get("http://localhost:5000/ratings", { headers }),
          ]);

        setCourses(coursesRes.data);
        setLecturers(lecturersRes.data);
        setAssignments(assignmentsRes.data);
        setReports(reportsRes.data);
        setClasses(classesRes.data);
        setRatings(ratingsRes.data);
      } catch (err) {
        console.error("Data fetch error:", err);
      }
    };

    fetchAll();
  }, [token]);

  // --- Handlers ---
  const handleNewCourseChange = (e) =>
    setNewCourse({ ...newCourse, [e.target.name]: e.target.value });

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/courses", newCourse, { headers });
      alert("✅ Course added successfully!");
      setCourses([...courses, res.data]);
      setNewCourse({ course_name: "", course_code: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignCourseChange = (e) =>
    setAssignCourse({ ...assignCourse, [e.target.name]: e.target.value });

  const handleAssignCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/assign-course", assignCourse, { headers });
      alert("✅ Course assigned successfully!");
      setAssignments([...assignments, res.data]);
      setAssignCourse({ course_id: "", lecturer_id: "" });
    } catch (err) {
      console.error(err);
    }
  };

  // --- UI ---
  return (
    <Dashboard title="Program Leader Dashboard">
      <div className="container-fluid">
        <div className="alert alert-dark mb-4">
          👋 Welcome back, <strong>{name}</strong> ({email})
        </div>

        {/* Navigation Tabs */}
        <ul className="nav nav-tabs mb-4">
          {["courses", "assignments", "reports", "classes", "ratings"].map((tab) => (
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

        {/* Courses Tab */}
        {activeTab === "courses" && (
          <div>
            <h4 className="mb-3">Courses</h4>
            <form className="mb-3 row" onSubmit={handleAddCourse}>
              <div className="col-md-4">
                <input
                  type="text"
                  name="course_name"
                  placeholder="Course Name"
                  value={newCourse.course_name}
                  onChange={handleNewCourseChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  name="course_code"
                  placeholder="Course Code"
                  value={newCourse.course_code}
                  onChange={handleNewCourseChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="col-md-4">
                <button className="btn btn-dark w-100">Add Course</button>
              </div>
            </form>

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
                      <td>{c.faculty_name || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Assignments Tab */}
        {activeTab === "assignments" && (
          <div>
            <h4 className="mb-3">Assign Lecturers</h4>
            <form className="mb-3 row" onSubmit={handleAssignCourse}>
              <div className="col-md-5">
                <select
                  name="course_id"
                  value={assignCourse.course_id}
                  onChange={handleAssignCourseChange}
                  className="form-select"
                  required
                >
                  <option value="">-- Select Course --</option>
                  {courses.map((c) => (
                    <option key={c.course_id} value={c.course_id}>
                      {c.course_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-5">
                <select
                  name="lecturer_id"
                  value={assignCourse.lecturer_id}
                  onChange={handleAssignCourseChange}
                  className="form-select"
                  required
                >
                  <option value="">-- Select Lecturer --</option>
                  {lecturers.map((l) => (
                    <option key={l.user_id} value={l.user_id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <button className="btn btn-success w-100">Assign</button>
              </div>
            </form>

            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Course</th>
                    <th>Lecturer</th>
                    <th>Assigned At</th>
                    <th>Assigned By</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((a, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{a.course_name}</td>
                      <td>{a.lecturer_name}</td>
                      <td>{a.assigned_at}</td>
                      <td>{a.assigned_by}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Course</th>
                  <th>Class</th>
                  <th>Lecturer</th>
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
                      <td>{r.lecturer_name}</td>
                      <td>{r.topic}</td>
                      <td>{r.date_of_lecture}</td>
                      <td>{r.week_of_reporting || "N/A"}</td>
                      <td>{r.prl_feedback || "Pending"}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-dark"
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
                        <td colSpan={9}>
                          <div className="p-3 border rounded bg-light">
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

export default PLDashboard;
