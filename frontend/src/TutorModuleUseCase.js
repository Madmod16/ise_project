import axios from "axios";
import { useEffect, useState } from "react";
import "./CoursesList.css"; // reuse styling if you want

function TutorModuleUseCase() {
    const [tutors, setTutors] = useState([]);
    const [selectedTutor, setSelectedTutor] = useState(null);

    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const [moduleName, setModuleName] = useState("");
    const [moduleSubject, setModuleSubject] = useState("");

    const [reportRows, setReportRows] = useState([]);

    // 1) load tutors
    useEffect(() => {
        axios.get("http://localhost:3001/tutors")
            .then((resp) => setTutors(resp.data))
            .catch((err) => console.error("GET /tutors failed:", err));
    }, []);

    // 2) load courses when tutor selected
    const handleTutorSelect = (tutor) => {
        setSelectedTutor(tutor);
        setSelectedCourse(null);
        setReportRows([]);

        axios.get(`http://localhost:3001/tutors/${tutor.Id}/courses`)
            .then((resp) => setCourses(resp.data))
            .catch((err) => console.error("GET /tutors/:id/courses failed:", err));
    };

    // 3) add module (use case)
    const handleAddModule = async () => {
        if (!selectedTutor || !selectedCourse || !moduleName || !moduleSubject) {
            alert("Select tutor + course and enter module name + subject.");
            return;
        }

        try {
            await axios.post("http://localhost:3001/modules", {
                tutorId: selectedTutor.Id,
                courseId: selectedCourse.CourseId,
                name: moduleName,
                subject: moduleSubject
            });

            // 4) fetch report after change (must change after use case)
            const reportResp = await axios.post("http://localhost:3001/modules/report", {
                tutorId: selectedTutor.Id,
                courseId: selectedCourse.CourseId
            });

            setReportRows(reportResp.data);

            // optional: clear input
            setModuleName("");
            setModuleSubject("");
        } catch (err) {
            console.error("Add module failed:", err);
            alert(err?.response?.data?.error || "Add module failed");
        }
    };

    return (
        <div className="member-selection-container">
            <h2 className="section-title">Select a Tutor</h2>

            <div className="program-grid">
                {tutors.map((t) => (
                    <div
                        key={t.Id}
                        className={`program-card ${selectedTutor?.Id === t.Id ? "selected" : ""}`}
                        onClick={() => handleTutorSelect(t)}
                    >
                        <div className="program-header">
                            <h3>{t.Surname} {t.Name}</h3>
                            <span className="duration-badge">{t.Accreditation}</span>
                        </div>
                        <div style={{ padding: "10px 0" }}>
                            <div>Specialization: {t.Specialization || "-"}</div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedTutor && (
                <>
                    <h2 className="section-title">Tutor’s Courses</h2>

                    <div className="program-grid">
                        {courses.map((c) => (
                            <div
                                key={c.CourseId}
                                className={`program-card ${selectedCourse?.CourseId === c.CourseId ? "selected" : ""}`}
                                onClick={() => setSelectedCourse(c)}
                            >
                                <div className="program-header">
                                    <h3>{c.CourseName}</h3>
                                    <span className="duration-badge">{c.ProgramName}</span>
                                </div>
                                <div style={{ padding: "10px 0" }}>
                                    <div>Field: {c.Field || "-"}</div>
                                    <div>Price: {c.Price}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {selectedTutor && selectedCourse && (
                <div className="selection-info-course">
                    <div className="selection-content">
                        <p>
                            <strong>Selected:</strong> {selectedTutor.Surname} {selectedTutor.Name} → {selectedCourse.CourseName}
                        </p>

                        <div style={{ display: "grid", gap: 10, maxWidth: 500 }}>
                            <input
                                value={moduleName}
                                onChange={(e) => setModuleName(e.target.value)}
                                placeholder="Module Name"
                            />
                            <input
                                value={moduleSubject}
                                onChange={(e) => setModuleSubject(e.target.value)}
                                placeholder="Module Subject"
                            />
                            <button className="continue-btn" onClick={handleAddModule}>
                                Add Module to Course
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {reportRows.length > 0 && (
                <div className="selection-analytics-report">
                    <div className="selection-content">
                        <h3>Analytics Report (Modules for selected Tutor + Course)</h3>

                        <table style={{ width: "100%", marginTop: 10 }}>
                            <thead>
                            <tr>
                                <th align="left">Tutor</th>
                                <th align="left">Course</th>
                                <th align="left">ModuleId</th>
                                <th align="left">ModuleName</th>
                                <th align="left">ModuleSubject</th>
                            </tr>
                            </thead>
                            <tbody>
                            {reportRows.map((r, idx) => (
                                <tr key={idx}>
                                    <td>{r.TutorSurname} {r.TutorName}</td>
                                    <td>{r.CourseName}</td>
                                    <td>{r.ModuleId ?? "-"}</td>
                                    <td>{r.ModuleName ?? "-"}</td>
                                    <td>{r.ModuleSubject ?? "-"}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                    </div>
                </div>
            )}
        </div>
    );
}

export default TutorModuleUseCase;
