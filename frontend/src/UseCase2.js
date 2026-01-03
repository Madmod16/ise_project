import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import "./CourseUseCase2.css";

const API = "http://localhost:3001";

function initialsFrom(name, surname) {
    const a = (surname || "").trim()[0] || "";
    const b = (name || "").trim()[0] || "";
    return (a + b).toUpperCase();
}

function TutorModuleUseCase() {
    const [tutors, setTutors] = useState([]);
    const [activeTutorId, setActiveTutorId] = useState(null);

    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const [showAddModule, setShowAddModule] = useState(false);
    const [moduleName, setModuleName] = useState("");
    const [moduleSubject, setModuleSubject] = useState("");

    const [reportRows, setReportRows] = useState([]);

    const [seeding, setSeeding] = useState(false);
    const [seedMsg, setSeedMsg] = useState("");

    const activeTutor = useMemo(
        () => tutors.find((t) => t.Id === activeTutorId) || null,
        [tutors, activeTutorId]
    );

    const reloadTutors = async () => {
        const resp = await axios.get(`${API}/tutors`);
        setTutors(resp.data);
    };

    useEffect(() => {
        reloadTutors().catch((err) => console.error("GET /tutors failed:", err));
    }, []);

    const runSeed = async () => {
        const ok = window.confirm(
            "Replace existing data with randomized import?\nThis will delete current data."
        );
        if (!ok) return;

        setSeeding(true);
        setSeedMsg("");

        try {
            await axios.post(`${API}/seed`, {}); // Backend: POST /seed => reset+random seed

            setActiveTutorId(null);
            setCourses([]);
            setSelectedCourse(null);
            setShowAddModule(false);
            setReportRows([]);
            setModuleName("");
            setModuleSubject("");

            await reloadTutors();
            setSeedMsg("Data import finished.");
        } catch (err) {
            setSeedMsg(err?.response?.data?.error || "Seed failed");
            console.error("POST /seed failed:", err);
        } finally {
            setSeeding(false);
        }
    };

    const toggleTutor = async (tutor) => {
        const isSame = tutor.Id === activeTutorId;

        if (isSame) {
            setActiveTutorId(null);
            setCourses([]);
            setSelectedCourse(null);
            setShowAddModule(false);
            setReportRows([]);
            return;
        }

        setActiveTutorId(tutor.Id);
        setSelectedCourse(null);
        setShowAddModule(false);
        setReportRows([]);
        setModuleName("");
        setModuleSubject("");

        try {
            const resp = await axios.get(`${API}/tutors/${tutor.Id}/courses`);
            setCourses(resp.data);
        } catch (err) {
            console.error("GET /tutors/:id/courses failed:", err);
            setCourses([]);
        }
    };

    const fetchReport = async (tutorId, courseId) => {
        const reportResp = await axios.post(`${API}/modules/report`, {
            tutorId,
            courseId,
        });
        setReportRows(reportResp.data);
    };

    const handleAddModule = async () => {
        if (!activeTutor || !selectedCourse || !moduleName || !moduleSubject) {
            alert("Select tutor + course and enter module name + subject.");
            return;
        }

        try {
            await axios.post(`${API}/modules`, {
                tutorId: activeTutor.Id,
                courseId: selectedCourse.CourseId,
                name: moduleName,
                subject: moduleSubject,
            });

            await fetchReport(activeTutor.Id, selectedCourse.CourseId);

            setModuleName("");
            setModuleSubject("");
            setShowAddModule(false);
        } catch (err) {
            console.error("Add module failed:", err);
            alert(err?.response?.data?.error || "Add module failed");
        }
    };

    const onSelectCourse = async (c) => {
        setSelectedCourse(c);
        setShowAddModule(false);

        try {
            await fetchReport(activeTutorId, c.CourseId);
        } catch (err) {
            console.error("Report failed:", err);
            setReportRows([]);
        }
    };

    return (
        <div className="tm-container">
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                    marginBottom: "1.5rem"
                }}
            >
                <h2 className="tm-title" style={{margin: 0}}>Tutors</h2>


            </div>
            <div className="tm-tutor-list">
                {tutors.map((t) => {
                    const active = t.Id === activeTutorId;

                    return (
                        <div key={t.Id} className={`tm-tutor-card ${active ? "tm-tutor-card--active" : ""}`}>
                            <div className="tm-tutor-head" onClick={() => toggleTutor(t)}>
                                <div className="tm-avatar" aria-hidden="true">
                                    <div className="tm-avatar-initials">{initialsFrom(t.Name, t.Surname)}</div>
                                </div>

                                <div className="tm-tutor-main">
                                    <h3 className="tm-tutor-name">
                                        {t.Surname} {t.Name}
                                    </h3>
                                    <div className="tm-tutor-meta">Specialization: {t.Specialization || "-"}</div>
                                </div>

                                <div className="tm-badge"> Accreditation: {t.Accreditation || "-"} </div>
                            </div>

                            {active && (
                                <div className="tm-expand">
                                    <div className="tm-courses-bar">
                                        <h4 className="tm-subtitle">Tutor’s Courses</h4>
                                    </div>

                                    <div className="tm-course-grid">
                                        {courses.map((c) => {
                                            const sel = selectedCourse?.CourseId === c.CourseId;
                                            return (
                                                <div
                                                    key={c.CourseId}
                                                    className={`tm-course-card ${sel ? "tm-course-card--selected" : ""}`}
                                                    onClick={() => onSelectCourse(c)}
                                                >
                                                    <div className="tm-course-head">
                                                        <div className="tm-course-title">{c.CourseName}</div>

                                                        <button
                                                            className="tm-btn tm-btn-primary tm-course-add"
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedCourse(c);
                                                                setShowAddModule(true);
                                                            }}
                                                            title="Add module"
                                                        >
                                                            Add Module
                                                        </button>
                                                    </div>

                                                    <div className="tm-course-meta">
                                                        <span className="tm-pill">{c.Field || "-"}</span>
                                                        <span className="tm-pill">€ {c.Price}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {selectedCourse && showAddModule && (
                                        <div className="tm-addbox">
                                            <div className="tm-addbox-title">Add module
                                                to: {selectedCourse.CourseName}</div>

                                            <div className="tm-form">
                                                <div className="tm-field">
                                                    <div className="tm-label">Module Name</div>
                                                    <input
                                                        className="tm-input"
                                                        value={moduleName}
                                                        onChange={(e) => setModuleName(e.target.value)}
                                                        placeholder="e.g. Cleaning Data with SQL"
                                                    />
                                                </div>

                                                <div className="tm-field">
                                                    <div className="tm-label">Module Subject</div>
                                                    <input
                                                        className="tm-input"
                                                        value={moduleSubject}
                                                        onChange={(e) => setModuleSubject(e.target.value)}
                                                        placeholder="e.g. Methods to structure information"
                                                    />
                                                </div>

                                                <button className="tm-btn tm-btn-primary" onClick={handleAddModule}
                                                        type="button">
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {reportRows.length > 0 && (
                                        <div className="tm-report">
                                            <div style={{fontWeight: 900, marginBottom: "0.65rem", color: "#111827"}}>
                                                Analytics Report (Modules)
                                            </div>

                                            <table className="tm-table">
                                                <thead>
                                                <tr>
                                                    <th>Tutor</th>
                                                    <th>Course</th>
                                                    <th>ModuleId</th>
                                                    <th>ModuleName</th>
                                                    <th>ModuleSubject</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {reportRows.map((r, idx) => (
                                                    <tr key={idx}>
                                                        <td>
                                                            {r.TutorSurname} {r.TutorName}
                                                        </td>
                                                        <td>{r.CourseName}</td>
                                                        <td>{r.ModuleId ?? "-"}</td>
                                                        <td>{r.ModuleName ?? "-"}</td>
                                                        <td>{r.ModuleSubject ?? "-"}</td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default TutorModuleUseCase;
