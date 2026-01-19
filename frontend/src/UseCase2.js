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

    const [noSQLMode, setNoSQLMode] = useState(null);

    // Mode Check
    useEffect(() => {
        axios.get(`${API}/mongodb/check`).then((resp) => {
            setNoSQLMode(resp.data);
        });
    }, []);

    const activeTutor = useMemo(
        () => tutors.find((t) => (t.Id || t._id) === activeTutorId) || null,
        [tutors, activeTutorId]
    );

    const reloadTutors = async () => {
        const endpoint = noSQLMode ? `${API}/mongodb/tutors` : `${API}/tutors`;
        const resp = await axios.get(endpoint);
        setTutors(resp.data);
    };

    useEffect(() => {
        if (noSQLMode !== null) {
            reloadTutors().catch((err) => console.error("Tutor fetch failed:", err));
        }
    }, [noSQLMode]);

    const toggleTutor = async (tutor) => {
        const tId = tutor.Id || tutor._id;
        const isSame = tId === activeTutorId;

        if (isSame) {
            setActiveTutorId(null);
            setCourses([]);
            setReportRows([]);
            return;
        }

        setActiveTutorId(tId);
        setSelectedCourse(null);
        setShowAddModule(false);

        try {
            // MongoDB endpoint
            const endpoint = noSQLMode
                ? `${API}/mongodb/tutors/${tId}/courses`
                : `${API}/tutors/${tId}/courses`;
            const resp = await axios.get(endpoint);
            setCourses(resp.data);
        } catch (err) {
            console.error("Course fetch failed:", err);
            setCourses([]);
        }
    };

    const fetchReport = async (tutorId, courseId) => {
        // Embedding
        const endpoint = noSQLMode
            ? `${API}/mongodb/modules/report`
            : `${API}/modules/report`;

        const reportResp = await axios.post(endpoint, { tutorId, courseId });
        setReportRows(reportResp.data);
    };

    const handleAddModule = async () => {
        if (!activeTutor || !selectedCourse || !moduleName || !moduleSubject) return;

        const tId = activeTutor.Id || activeTutor._id;
        const cId = selectedCourse.CourseId || selectedCourse._id;

        try {
            const endpoint = noSQLMode ? `${API}/mongodb/modules` : `${API}/modules`;
            await axios.post(endpoint, {
                tutorId: tId,
                courseId: cId,
                name: moduleName,
                subject: moduleSubject,
            });

            await fetchReport(tId, cId);
            setModuleName("");
            setModuleSubject("");
            setShowAddModule(false);
        } catch (err) {
            alert("Add module failed");
        }
    };

    const onSelectCourse = async (c) => {
        setSelectedCourse(c);
        const cId = c.CourseId || c._id;
        try {
            await fetchReport(activeTutorId, cId);
        } catch (err) {
            setReportRows([]);
        }
    };

    return (
        <div className="tm-container">
            {/* Mode Indicator */}
            <div className="mode-pill">
                {noSQLMode === null ? (
                    <span className="mode-chip loading">Mode: …</span>
                ) : noSQLMode ? (
                    <span className="mode-chip nosql">Mode: NoSQL</span>
                ) : (
                    <span className="mode-chip sql">Mode: SQL</span>
                )}
            </div>

                <div className="tm-tutor-list">
                    {tutors.map((t) => {
                        const tId = t.Id || t._id;
                        const active = tId === activeTutorId;

                        return (
                            <div key={tId} className={`tm-tutor-card ${active ? "tm-tutor-card--active" : ""}`}>
                                <div className="tm-tutor-head" onClick={() => toggleTutor(t)}>
                                    <div className="tm-avatar">
                                        <div className="tm-avatar-initials">{initialsFrom(t.Name, t.Surname)}</div>
                                    </div>
                                    <div className="tm-tutor-main">
                                        <h3 className="tm-tutor-name">{t.Surname} {t.Name}</h3>
                                        <div className="tm-tutor-meta">Specialization: {t.Specialization}</div>
                                    </div>
                                </div>

                                {active && (
                                    <div className="tm-expand">
                                        <div className="tm-course-grid">
                                            {courses.map((c) => {
                                                const currCId = c.CourseId || c._id;
                                                const sel = (selectedCourse?.CourseId || selectedCourse?._id) === currCId;
                                                return (
                                                    <div key={currCId}
                                                         className={`tm-course-card ${sel ? "tm-course-card--selected" : ""}`}
                                                         onClick={() => onSelectCourse(c)}>
                                                        <div className="tm-course-head">
                                                            <div
                                                                className="tm-course-title">{c.CourseName || c.name}</div>
                                                            <button className="tm-btn tm-btn-primary" onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedCourse(c);
                                                                setShowAddModule(true);
                                                            }}>
                                                                Add Module
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {/* ... rest of the table rendering logic ... */}
                                        {reportRows.length > 0 && (
                                            <div className="tm-report">
                                                <table className="tm-table">
                                                    <thead>
                                                    <tr>
                                                        <th>Tutor</th>
                                                        <th>Course</th>
                                                        <th>Module Name</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {reportRows.map((r, idx) => (
                                                        <tr key={idx}>
                                                            <td>{r.TutorSurname || r.surname} {r.TutorName || r.name}</td>
                                                            <td>{r.CourseName || r.course_name}</td>
                                                            <td>{r.ModuleName || r.module_name}</td>
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