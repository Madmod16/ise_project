import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { TutorConvertor } from "../Logic/tutorsConvertor";
import "../PagesCSS/CourseUseCase2.css";

const API = "http://localhost:3001";

function initialsFrom(name, surname) {
    const a = (surname || "").trim()[0] || "";
    const b = (name || "").trim()[0] || "";
    return (a + b).toUpperCase();
}

async function tryFetchCoursesByIds(courseIds) {
    if (!Array.isArray(courseIds) || courseIds.length === 0) return [];

    const candidates = [
        { method: "post", url: `${API}/mongodb/courses/byIds`, data: { courseIds } },
        { method: "post", url: `${API}/mongodb/courses/byids`, data: { courseIds } },
        { method: "post", url: `${API}/mongodb/courses/ids`, data: { courseIds } },
        { method: "post", url: `${API}/mongodb/courses/getByIds`, data: { courseIds } },
        { method: "post", url: `${API}/mongodb/courses/find`, data: { ids: courseIds } },
        { method: "post", url: `${API}/mongodb/courses/findMany`, data: { ids: courseIds } },
        { method: "get", url: `${API}/mongodb/courses?ids=${encodeURIComponent(courseIds.join(","))}` },
    ];

    for (const c of candidates) {
        try {
            const resp =
                c.method === "get"
                    ? await axios.get(c.url)
                    : await axios.post(c.url, c.data);
            if (Array.isArray(resp.data)) return resp.data;
            if (Array.isArray(resp.data?.courses)) return resp.data.courses;
        } catch (e) { /* Error */ }
    }

    return null;
}

function normalizeCourseShape(c) {
    const rawId = c?.CourseID ?? c?.CourseId ?? c?._id ?? c?.Id ?? c?.id;
    const courseId = rawId != null ? String(rawId) : undefined;

    return {
        CourseID: courseId,
        Name: c?.Name ?? c?.CourseName ?? c?.course_name ?? c?.name ?? (courseId ? `Course ${courseId}` : "(no name)"),
        Field: c?.Field ?? c?.field ?? "-",
        Price: c?.Price ?? c?.price ?? 0,
    };
}

function UseCase2() {
    const [tutors, setTutors] = useState([]);
    const [activeTutorId, setActiveTutorId] = useState(null);

    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const [showAddModule, setShowAddModule] = useState(false);
    const [moduleName, setModuleName] = useState("");
    const [moduleSubject, setModuleSubject] = useState("");

    const [reportRows, setReportRows] = useState([]);
    const [noSQLMode, setNoSQLMode] = useState(null);

    const [seeding, setSeeding] = useState(false);
    const [seedMsg, setSeedMsg] = useState("");

    useEffect(() => {
        axios
            .get(`${API}/mongodb/check`)
            .then((resp) => setNoSQLMode(!!resp.data))
            .catch(() => setNoSQLMode(false));
    }, []);

    const activeTutor = useMemo(
        () => tutors.find((t) => String(t.Id || t._id) === String(activeTutorId)) || null,
        [tutors, activeTutorId]
    );

    const normalizeTutors = (arr) => {
        if (!Array.isArray(arr)) return [];
        try {
            return TutorConvertor(arr);
        } catch (e) {
            console.error("TutorConvertor failed:", e);
            return arr;
        }
    };

    const reloadTutors = async () => {
        const endpoint = noSQLMode ? `${API}/mongodb/mongoTutors` : `${API}/tutors`;
        const resp = await axios.get(endpoint);
        setTutors(normalizeTutors(resp.data));
    };

    useEffect(() => {
        if (noSQLMode !== null) {
            reloadTutors().catch((err) => console.error("Tutor fetch failed:", err));
        }
    }, [noSQLMode]);

    const runSeed = async () => {
        const ok = window.confirm(
            "Replace existing data with randomized import?\nThis will delete current data."
        );
        if (!ok) return;

        setSeeding(true);
        setSeedMsg("");

        try {
            await axios.post(`${API}/seed`, {});

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
        const tutorId = String(tutor.Id || tutor._id);
        const isSame = String(tutorId) === String(activeTutorId);

        if (isSame) {
            setActiveTutorId(null);
            setCourses([]);
            setSelectedCourse(null);
            setShowAddModule(false);
            setReportRows([]);
            return;
        }

        setActiveTutorId(tutorId);
        setSelectedCourse(null);
        setShowAddModule(false);
        setReportRows([]);
        setModuleName("");
        setModuleSubject("");

        try {
            if (noSQLMode) {
                const selectedTutorData = tutors.find((t) => String(t.Id || t._id) === String(tutorId));
                const list = Array.isArray(selectedTutorData?.coursesTaught) ? selectedTutorData.coursesTaught : [];

                const ids = list
                    .map((x) => x?.CourseID ?? x?.CourseId ?? x?._id ?? x?.Id)
                    .filter((x) => x != null)
                    .map((x) => String(x));

                const details = await tryFetchCoursesByIds(ids);

                if (details === null) {
                    setCourses(list.map((x) => normalizeCourseShape(x)));
                } else {
                    const normalized = (details || []).map((c) => normalizeCourseShape(c));

                    const have = new Set(normalized.map((c) => c.CourseID));
                    for (const id of ids) {
                        if (!have.has(id)) normalized.push(normalizeCourseShape({ CourseID: id }));
                    }

                    setCourses(normalized);
                }
            } else {
                const resp = await axios.get(`${API}/tutors/${tutorId}/courses`);
                const normalizedCourses = (resp.data || []).map((c) => normalizeCourseShape(c));
                setCourses(normalizedCourses);
            }
        } catch (err) {
            console.error("Course fetch failed:", err);
            setCourses([]);
        }
    };

    const fetchReport = async (tutorId, courseId) => {
        const endpoint = noSQLMode ? `${API}/mongodb/modules/report` : `${API}/modules/report`;
        const reportResp = await axios.post(endpoint, { tutorId, courseId });
        setReportRows(reportResp.data || []);
    };

    const handleAddModule = async () => {
        if (!activeTutor || !selectedCourse || !moduleName || !moduleSubject) {
            alert("Select tutor + course and enter module name + subject.");
            return;
        }

        const endpoint = noSQLMode ? `${API}/mongodb/modules` : `${API}/modules`;

        const tutorId = String(activeTutor.Id || activeTutor._id || activeTutorId);
        const courseId = String(
            selectedCourse.CourseID || selectedCourse.CourseId || selectedCourse._id || selectedCourse.Id
        );

        try {
            await axios.post(endpoint, {
                tutorId,
                courseId,
                name: moduleName,
                subject: moduleSubject,
            });

            await fetchReport(tutorId, courseId);

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

        const cId = String(c.CourseID || c.CourseId || c._id || c.Id);

        try {
            await fetchReport(String(activeTutorId), cId);
        } catch (err) {
            console.error("Report failed:", err);
            setReportRows([]);
        }
    };

    return (
        <div className="tm-container">
            <div className="mode-pill">
                {noSQLMode === null ? (
                    <span className="mode-chip loading">Mode: …</span>
                ) : noSQLMode ? (
                    <span className="mode-chip nosql">Mode: NoSQL</span>
                ) : (
                    <span className="mode-chip sql">Mode: SQL</span>
                )}
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                    marginBottom: "1.5rem",
                }}
            >
                <h2 className="tm-title" style={{ margin: 0 }}>
                    Tutors
                </h2>
            </div>

            <div className="tm-tutor-list">
                {tutors.map((t) => {
                    const tId = String(t.Id || t._id);
                    const active = String(tId) === String(activeTutorId);

                    return (
                        <div key={tId} className={`tm-tutor-card ${active ? "tm-tutor-card--active" : ""}`}>
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

                                <div className="tm-badge">Accreditation: {t.Accreditation || "-"}</div>
                            </div>

                            {active && (
                                <div className="tm-expand">
                                    <div className="tm-courses-bar">
                                        <h4 className="tm-subtitle">Tutor’s Courses</h4>
                                    </div>

                                    <div className="tm-course-grid">
                                        {courses.map((c, idx) => {
                                            const courseId = String(c.CourseID || c.CourseId || c._id || c.Id || `course-${idx}`);

                                            const sel =
                                                String(
                                                    selectedCourse?.CourseID ||
                                                    selectedCourse?.CourseId ||
                                                    selectedCourse?._id ||
                                                    selectedCourse?.Id
                                                ) === courseId;

                                            return (
                                                <div
                                                    key={courseId}
                                                    className={`tm-course-card ${sel ? "tm-course-card--selected" : ""}`}
                                                    onClick={() => onSelectCourse(c)}
                                                >
                                                    <div className="tm-course-head">
                                                        <div className="tm-course-title">
                                                            {c.Name || c.CourseName || c.name || `Course ${courseId}`}
                                                        </div>

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
                                                            Add Module″
                                                        </button>
                                                    </div>

                                                    <div className="tm-course-meta">
                                                        <span className="tm-pill">{c.Field || "-"}</span>
                                                        <span className="tm-pill">€ {c.Price ?? "-"}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {selectedCourse && showAddModule && (
                                        <div className="tm-addbox">
                                            <div className="tm-addbox-title">
                                                Add module to: {selectedCourse.Name || selectedCourse.CourseName || selectedCourse.name}
                                            </div>

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

                                                <button className="tm-btn tm-btn-primary" onClick={handleAddModule} type="button">
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {reportRows.length > 0 && (
                                        <div className="tm-report">
                                            <div style={{ fontWeight: 900, marginBottom: "0.65rem", color: "#111827" }}>
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
                                                            {r.TutorSurname || r.surname} {r.TutorName || r.name}
                                                        </td>
                                                        <td>{r.CourseName || r.course_name || "-"}</td>
                                                        <td>{r.ModuleId ?? r.module_id ?? "-"}</td>
                                                        <td>{r.ModuleName ?? r.module_name ?? "-"}</td>
                                                        <td>{r.ModuleSubject ?? r.module_subject ?? "-"}</td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {selectedCourse && reportRows.length === 0 && (
                                        <div style={{ marginTop: "10px", opacity: 0.7 }}>No modules for this course.</div>
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

export default UseCase2;
