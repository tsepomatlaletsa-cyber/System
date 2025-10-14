// PLDashboard.js
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
  FaUserTie,
  FaEdit,
  FaTrash,
  FaPlus,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";




const ShimmerLoader = () => (
  <div className="w-100">
    <div className="row g-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="col-md-4">
          <div className="card p-4 rounded-4 border-0">
            <div className="placeholder-glow">
              <div className="placeholder col-8 mb-3" />
              <div className="placeholder col-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

function SimpleModal({ title, show, onClose, children, footer }) {
  
  useEffect(() => {
    if (show) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  if (!show) return null;
  return (
    <>
      <div
        className="modal fade show"
        style={{ display: "block", background: "transparent" }}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
            </div>
            <div className="modal-body">{children}</div>
            {footer && <div className="modal-footer">{footer}</div>}
          </div>
        </div>
      </div>
      <div
        className="modal-backdrop fade show"
        onClick={onClose}
        style={{ cursor: "pointer" }}
        aria-hidden="true"
      />
    </>
  );
}


function PLDashboard() {
  const navigate = useNavigate();


  const [activeTab, setActiveTab] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [loadingTab, setLoadingTab] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

 
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [reports, setReports] = useState([]);
  const [classes, setClasses] = useState([]);
  const [ratings, setRatings] = useState([]);


  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  const headers = { Authorization: `Bearer ${token}` };

  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showEditCourse, setShowEditCourse] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // {type: 'course'|'assignment', id}

  
  const [addCourseForm, setAddCourseForm] = useState({ course_name: "", course_code: "" });
  const [editCourseForm, setEditCourseForm] = useState({ course_name: "", course_code: "" });
  const [assignForm, setAssignForm] = useState({ course_id: "", lecturer_id: "" });

  
  useEffect(() => {
    if (!token) return;
    const fetchAll = async () => {
      try {
        const [coursesRes, lecturersRes, assignmentsRes, reportsRes, classesRes, ratingsRes] =
          await Promise.all([
            axios.get("https://system-backend-2-ty55.onrender.com/courses", { headers }),
            axios.get("https://system-backend-2-ty55.onrender.com/lecturers", { headers }),
            axios.get("https://system-backend-2-ty55.onrender.com/assignments", { headers }),
            axios.get("https://system-backend-2-ty55.onrender.com/reports", { headers }),
            axios.get("https://system-backend-2-ty55.onrender.com/classes", { headers }),
            axios.get("https://system-backend-2-ty55.onrender.com/ratings", { headers }),
          ]);

        setCourses(coursesRes.data || []);
        setLecturers(lecturersRes.data || []);
        setAssignments(assignmentsRes.data || []);
        setReports(reportsRes.data || []);
        setClasses(classesRes.data || []);
        setRatings(ratingsRes.data || []);
      } catch (err) {
        console.error("Data fetch error:", err);
        
      }
    };

    fetchAll();
  }, [token]);

  

  
  const filterData = (data = [], keys = []) => {
    if (!searchQuery) return data;
    const q = searchQuery.toLowerCase();
    return data.filter((item) =>
      keys.some((key) => (item[key] ?? "").toString().toLowerCase().includes(q))
    );
  };

  
  const tabVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.28 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.22 } },
  };

 
  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setLoadingTab(true);
    setTimeout(() => {
      setActiveTab(tab);
      setLoadingTab(false);
      setSearchQuery("");
    }, 250);
  };

  
  const handleLogout = () => {
    localStorage.clear();
     window.location.href = "/";
  };

 

  const openAddCourse = () => {
    setAddCourseForm({ course_name: "", course_code: "" });
    setShowAddCourse(true);
  };

  const submitAddCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://system-backend-2-ty55.onrender.com/courses", addCourseForm, { headers });
      setCourses((prev) => [...prev, res.data]);
      setShowAddCourse(false);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add course");
    }
  };

  const openEditCourse = (course) => {
    setCourseToEdit(course);
    setEditCourseForm({ course_name: course.course_name || "", course_code: course.course_code || "" });
    setShowEditCourse(true);
  };

  const submitEditCourse = async (e) => {
    e.preventDefault();
    if (!courseToEdit) return;
    try {
      const res = await axios.put(`https://system-backend-2-ty55.onrender.com/courses/${courseToEdit.course_id}`, editCourseForm, { headers });
      setCourses((prev) => prev.map((c) => (c.course_id === courseToEdit.course_id ? res.data : c)));
      setShowEditCourse(false);
      setCourseToEdit(null);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update course");
    }
  };

  const confirmDelete = (type, id) => {
    setDeleteTarget({ type, id });
    setShowConfirmDelete(true);
  };

  const performDelete = async () => {
    if (!deleteTarget) return;
    const { type, id } = deleteTarget;
    try {
      if (type === "course") {
        await axios.delete(`https://system-backend-2-ty55.onrender.com/courses/${id}`, { headers });
        setCourses((prev) => prev.filter((c) => c.course_id !== id));
      } else if (type === "assignment") {
        await axios.delete(`https://system-backend-2-ty55.onrender.com/assignments/${id}`, { headers });
        setAssignments((prev) => prev.filter((a) => a.assignment_id !== id));
      }
      setShowConfirmDelete(false);
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      alert("❌Access Denied, Only allowed to delete your assignments! ");
    }
  };

 

  const openAssignModal = () => {
    setAssignForm({ course_id: "", lecturer_id: "" });
    setShowAssignModal(true);
  };

  const submitAssign = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://system-backend-2-ty55.onrender.com/assign-course", assignForm, { headers });
      setAssignments((prev) => [...prev, res.data]);
      setShowAssignModal(false);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to assign course");
    }
  };

  

  return (
    <Dashboard title="Program Leader Dashboard">
      <div className="d-flex" style={{ minHeight: "100vh", background: "#f4f7fb" }}>
        {/* Sidebar */}
        <aside
          className="bg-white shadow-sm p-3 d-flex flex-column"
          style={{
            width: collapsed ? 84 : 260,
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
            {!collapsed && <h5 className="fw-bold text-primary mb-0">📚 Program Leader</h5>}
            <button
              onClick={() => setCollapsed((s) => !s)}
              className="btn btn-light rounded-circle shadow-sm"
              aria-label="Toggle sidebar"
            >
              <FaBars />
            </button>
          </div>

          {!collapsed && <p className="text-muted small text-center mb-3">{name}</p>}
          <hr />

          <nav className="nav flex-column gap-2">
            {[
              { key: "dashboard", icon: <FaChartLine />, label: "Dashboard" },
              { key: "courses", icon: <FaChalkboardTeacher />, label: "Courses" },
              { key: "assignments", icon: <FaClipboardList />, label: "Assign Courses" },
              { key: "reports", icon: <FaClipboardList />, label: "Reports" },
              { key: "classes", icon: <FaChalkboardTeacher />, label: "Classes" },
              { key: "ratings", icon: <FaStar />, label: "Ratings" },
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

        {/* Main Content */}
        <div className="flex-grow-1 d-flex flex-column">
          {/* Top Navbar */}
          <header
            className="bg-white shadow-sm px-4 py-3 d-flex align-items-center justify-content-between"
            style={{
              position: "sticky",
              top: 0,
              zIndex: 100,
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
            }}
          >
            <h5 className="fw-bold text-primary mb-0">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h5>
            <div className="d-flex align-items-center gap-3">
              <button className="btn btn-light rounded-circle shadow-sm" aria-label="Notifications">
                <FaBell className="text-primary" />
              </button>
              <div className="d-flex align-items-center">
                <ProfilePicture  size={32} className="text-secondary me-2" />
                {!collapsed && (
                  <div className="text-end">
                    <div className="mb-0 fw-semibold text-dark"></div>
                    <small className="text-muted"></small>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-grow-1 p-4 overflow-auto">
            {loadingTab ? (
              <ShimmerLoader />
            ) : (
              <AnimatePresence mode="wait">
                <motion.div key={activeTab} variants={tabVariants} initial="hidden" animate="visible" exit="exit">
                  {/* Dashboard cards */}
                  {activeTab === "dashboard" && (
                    <div className="row g-4 mb-4">
                      {[
                        {
                          label: "Total Courses",
                          value: courses.length,
                          tab: "courses",
                          icon: <FaChalkboardTeacher size={28} className="text-primary" />,
                        },
                        {
                          label: "Total Reports",
                          value: reports.length,
                          tab: "reports",
                          icon: <FaClipboardList size={28} className="text-success" />,
                        },
                        {
                          label: "Total Ratings",
                          value: ratings.length,
                          tab: "ratings",
                          icon: <FaStar size={28} className="text-warning" />,
                        },
                        {
                          label: "Total Assignments",
                          value: assignments.length,
                          tab: "assignments",
                          icon: <FaClipboardList size={28} className="text-info" />,
                        },
                        {
                          label: "Total Classes",
                          value: classes.length,
                          tab: "classes",
                          icon: <FaChalkboardTeacher size={28} className="text-danger" />,
                        },
                        {
                          label: "Total Lecturers",
                          value: lecturers.length,
                          tab: "lecturers",
                          icon: <FaUserTie size={28} className="text-secondary" />,
                        },
                      ].map((card, i) => (
                        <div key={i} className="col-12 col-md-6 col-lg-4">
                          <div
                            className="card p-3 shadow-sm rounded-4 border-0"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleTabChange(card.tab)}
                          >
                            <div className="d-flex align-items-center">
                              <div className="me-3" style={{ fontSize: 28 }}>
                                {card.icon}
                              </div>
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

                  {/* ----------------- Courses Tab ----------------- */}
                  {activeTab === "courses" && (
                    <div>
                      <div className="mb-3 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                        <h4 className="mb-0">Courses</h4>
                        <div className="d-flex gap-2 w-100 w-md-auto">
                          <input
                            type="text"
                            placeholder="Search Courses..."
                            className="form-control"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ minWidth: 220 }}
                          />
                          <button className="btn btn-primary" onClick={openAddCourse}>
                            <FaPlus className="me-2" /> Add
                          </button>
                        </div>
                      </div>

                      <div className="table-responsive">
                        <table className="table table-striped align-middle">
                          <thead className="table-light">
                            <tr>
                              <th>#</th>
                              <th>Name</th>
                              <th>Code</th>
                              <th>Faculty</th>
                              <th className="text-end">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filterData(courses, ["course_name", "course_code", "faculty_name"]).map((c, i) => (
                              <tr key={c.course_id || i}>
                                <td style={{ width: 60 }}>{i + 1}</td>
                                <td>{c.course_name}</td>
                                <td>{c.course_code}</td>
                                <td>{c.faculty_name || "N/A"}</td>
                                <td className="text-end">
                                  <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => openEditCourse(c)}>
                                    <FaEdit />
                                  </button>
                                  <button className="btn btn-sm btn-outline-danger" onClick={() => confirmDelete("course", c.course_id)}>
                                    <FaTrash />
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {filterData(courses, ["course_name", "course_code", "faculty_name"]).length === 0 && (
                              <tr>
                                <td colSpan={5} className="text-center text-muted">No courses found</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* ----------------- Assignments Tab ----------------- */}
                  {activeTab === "assignments" && (
                    <div>
                      <div className="mb-3 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                        <h4 className="mb-0">Assign Lecturers</h4>
                        <div className="d-flex gap-2 w-100 w-md-auto">
                          <input
                            type="text"
                            placeholder="Search Assignments..."
                            className="form-control"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ minWidth: 220 }}
                          />
                          <button className="btn btn-success" onClick={openAssignModal}><FaPlus className="me-2" />Assign</button>
                        </div>
                      </div>

                      <div className="table-responsive">
                        <table className="table table-striped align-middle">
                          <thead className="table-light">
                            <tr>
                              <th>#</th>
                              <th>Course</th>
                              <th>Lecturer</th>
                              <th>Assigned At</th>
                              <th>Assigned By</th>
                              <th className="text-end">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filterData(assignments, ["course_name", "lecturer_name"]).map((a, i) => (
                              <tr key={a.assignment_id || i}>
                                <td style={{ width: 60 }}>{i + 1}</td>
                                <td>{a.course_name}</td>
                                <td>{a.lecturer_name}</td>
                                <td>{a.assigned_at || "N/A"}</td>
                                <td>{a.assigned_by || "N/A"}</td>
                                <td className="text-end">
                                  <button className="btn btn-sm btn-outline-danger" onClick={() => confirmDelete("assignment", a.assignment_id)}>
                                    <FaTrash />
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {filterData(assignments, ["course_name", "lecturer_name"]).length === 0 && (
                              <tr>
                                <td colSpan={6} className="text-center text-muted">No assignments found</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* ----------------- Reports Tab ----------------- */}
                  {activeTab === "reports" && (
                    <div>
                      <div className="mb-3 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                        <h4 className="mb-0">Reports</h4>
                        <input
                          type="text"
                          placeholder="Search Reports..."
                          className="form-control"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          style={{ minWidth: 220 }}
                        />
                      </div>

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
                            {filterData(reports, ["course_name", "class_name", "lecturer_name", "topic"]).map((r, i) => (
                              <React.Fragment key={r.report_id || i}>
                                <tr>
                                  <td style={{ width: 60 }}>{i + 1}</td>
                                  <td>{r.course_name}</td>
                                  <td>{r.class_name}</td>
                                  <td>{r.lecturer_name}</td>
                                  <td>{r.topic}</td>
                                  <td>{r.date_of_lecture || "N/A"}</td>
                                  <td>{r.week_of_reporting || "N/A"}</td>
                                  <td>{r.prl_feedback || "Pending"}</td>
                                  <td>
                                    <button
                                      className="btn btn-sm btn-outline-dark"
                                      type="button"
                                      onClick={() => setExpandedRow(expandedRow === r.report_id ? null : r.report_id)}
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
                            {filterData(reports, ["course_name", "class_name", "lecturer_name", "topic"]).length === 0 && (
                              <tr>
                                <td colSpan={9} className="text-center text-muted">No reports found</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* ----------------- Classes Tab ----------------- */}
                  {activeTab === "classes" && (
                    <div>
                      <div className="mb-3 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                        <h4 className="mb-0">Classes</h4>
                        <input
                          type="text"
                          placeholder="Search Classes..."
                          className="form-control"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          style={{ minWidth: 220 }}
                        />
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
                                <td style={{ width: 60 }}>{i + 1}</td>
                                <td>{c.class_name}</td>
                                <td>{c.year_of_study || "N/A"}</td>
                                <td>{c.faculty_name}</td>
                                <td>{c.description || "-"}</td>
                              </tr>
                            ))}
                            {filterData(classes, ["class_name", "faculty_name"]).length === 0 && (
                              <tr>
                                <td colSpan={5} className="text-center text-muted">No classes found</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* ----------------- Ratings Tab ----------------- */}
                  {activeTab === "ratings" && (
                    <div>
                      <div className="mb-3 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                        <h4 className="mb-0">Ratings</h4>
                        <input
                          type="text"
                          placeholder="Search Ratings..."
                          className="form-control"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          style={{ minWidth: 220 }}
                        />
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
                            {filterData(ratings, ["lecturer_name", "student_name"]).length === 0 && (
                              <tr>
                                <td colSpan={5} className="text-center text-muted">No ratings found</td>
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
          </div>
        </div>

        {/* -------------------------
            Modals (Add / Edit / Assign / Confirm Delete)
           ------------------------- */}

        {/* Add Course */}
        <SimpleModal
          title="Add Course"
          show={showAddCourse}
          onClose={() => setShowAddCourse(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setShowAddCourse(false)}>Cancel</button>
              <button form="addCourseForm" type="submit" className="btn btn-primary">Save</button>
            </>
          }
        >
          <form id="addCourseForm" onSubmit={submitAddCourse}>
            <div className="mb-3">
              <label className="form-label">Course Name</label>
              <input className="form-control" value={addCourseForm.course_name} onChange={(e) => setAddCourseForm({ ...addCourseForm, course_name: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Course Code</label>
              <input className="form-control" value={addCourseForm.course_code} onChange={(e) => setAddCourseForm({ ...addCourseForm, course_code: e.target.value })} required />
            </div>
          </form>
        </SimpleModal>

        {/* Edit Course */}
        <SimpleModal
          title="Edit Course"
          show={showEditCourse}
          onClose={() => { setShowEditCourse(false); setCourseToEdit(null); }}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => { setShowEditCourse(false); setCourseToEdit(null); }}>Cancel</button>
              <button form="editCourseForm" type="submit" className="btn btn-primary">Update</button>
            </>
          }
        >
          <form id="editCourseForm" onSubmit={submitEditCourse}>
            <div className="mb-3">
              <label className="form-label">Course Name</label>
              <input className="form-control" value={editCourseForm.course_name} onChange={(e) => setEditCourseForm({ ...editCourseForm, course_name: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Course Code</label>
              <input className="form-control" value={editCourseForm.course_code} onChange={(e) => setEditCourseForm({ ...editCourseForm, course_code: e.target.value })} required />
            </div>
          </form>
        </SimpleModal>

        {/* Assign Lecturer */}
        <SimpleModal
          title="Assign Lecturer to Course"
          show={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setShowAssignModal(false)}>Cancel</button>
              <button form="assignForm" type="submit" className="btn btn-success">Assign</button>
            </>
          }
        >
          <form id="assignForm" onSubmit={submitAssign}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Course</label>
                <select className="form-select" value={assignForm.course_id} onChange={(e) => setAssignForm({ ...assignForm, course_id: e.target.value })} required>
                  <option value="">Select course</option>
                  {courses.map((c) => <option key={c.course_id} value={c.course_id}>{c.course_name}</option>)}
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Lecturer</label>
                <select className="form-select" value={assignForm.lecturer_id} onChange={(e) => setAssignForm({ ...assignForm, lecturer_id: e.target.value })} required>
                  <option value="">Select lecturer</option>
                  {lecturers.map((l) => <option key={l.user_id} value={l.user_id}>{l.name}</option>)}
                </select>
              </div>
            </div>
          </form>
        </SimpleModal>

        {/* Confirm Delete */}
        <SimpleModal
          title="Confirm Delete"
          show={showConfirmDelete}
          onClose={() => setShowConfirmDelete(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setShowConfirmDelete(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={performDelete}>Delete</button>
            </>
          }
        >
          <p>Are you sure you want to delete this {deleteTarget?.type || "item"}? This action cannot be undone.</p>
        </SimpleModal>
      </div>
    </Dashboard>
  );
}

export default PLDashboard;
