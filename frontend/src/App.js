import "./App.css";
import axios from "axios";

import SelectTheUser from "./Pages/SelectTheUser";
import CoursesList from "./Pages/CoursesList";
import TutorModuleUseCase from "./UseCase2";
import AnalyticsReportStudent1 from "./Pages/AnalyticReportStudent1";

import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";

const API = "http://localhost:3001";

function HomeRedirect() {
    const navigate = useNavigate();

    const [seeding, setSeeding] = useState(false);
    const [seedMsg, setSeedMsg] = useState("");

    const handleMigrateDB = async () => {
    try {
        await axios.get("http://localhost:3001/mongodb/migrateAll");
        alert("Database migrated successfully!");
        } catch (error) {
        console.error("Migration failed:", error);
        alert("Migration failed. Check console for details.");
        }
    };

    const runSeed = async () => {
        const ok = window.confirm(
            "Replace existing data with randomized import?\nThis will delete current data."
        );
        if (!ok) return;

        setSeeding(true);
        setSeedMsg("");

        try {
            await axios.post(`${API}/seed`, {});
            setSeedMsg("Data import finished.");
        } catch (err) {
            setSeedMsg(err?.response?.data?.error || "Seed failed");
            console.error("POST /seed failed:", err);
        } finally {
            setSeeding(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "1.25rem",
                background: "#f9fafb",
                padding: "2rem",
            }}
        >
            <h1 style={{ margin: 0, fontSize: "2rem" }}>Home</h1>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <button
                    type="button"
                    onClick={runSeed}
                    disabled={seeding}
                    style={{
                        padding: "0.9rem 1.4rem",
                        borderRadius: "10px",
                        border: "1px solid #d1d5db",
                        background: "#111827",
                        color: "white",
                        cursor: seeding ? "not-allowed" : "pointer",
                        minWidth: "260px",
                        opacity: seeding ? 0.1 : 1,
                    }}
                >
                    {seeding ? "Importing..." : "Import Random Data"}
                </button>

                {seedMsg && <div style={{ fontSize: "0.95rem" }}>{seedMsg}</div>}
            </div>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1rem" }}>
                <button
                    type="button"
                    onClick={() => navigate("/TutorModuleUseCase")}
                    style={{
                        padding: "0.9rem 1.4rem",
                        borderRadius: "10px",
                        border: "1px solid #d1d5db",
                        background: "#2563eb",
                        color: "white",
                        cursor: "pointer",
                        minWidth: "260px",
                    }}
                >
                    Tutor Module Use Case
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/SelectTheUser")}
                    style={{
                        padding: "0.9rem 1.4rem",
                        borderRadius: "10px",
                        border: "1px solid #d1d5db",
                        background: "#e5e7eb",
                        color: "#111827",
                        cursor: "pointer",
                        minWidth: "260px",
                    }}
                >
                    Select The User
                </button>

                <button
                    type="button"
                    onClick={handleMigrateDB}
                    style={{
                        padding: "0.9rem 1.4rem",
                        borderRadius: "10px",
                        border: "1px solid #d1d5db",
                        background: "#0ed57f",
                        color: "#111827",
                        cursor: "pointer",
                        minWidth: "260px",
                    }}
                >
                    MigrateDB
                </button>
            </div>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomeRedirect />} />
                <Route path="/SelectTheUser" element={<SelectTheUser />} />
                <Route path="/CoursesList" element={<CoursesList />} />
                <Route path="/TutorModuleUseCase" element={<TutorModuleUseCase />} />
                <Route path="/AnalyticsReportStudent1" element={<AnalyticsReportStudent1 />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
