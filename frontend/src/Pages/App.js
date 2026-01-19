import "../PagesCSS/App.css";
import axios from "axios";

import SelectTheUser from "./SelectTheUser";
import CoursesList from "./CoursesList";
import UseCase2 from "./UseCase2";
import AnalyticsReportStudent1 from "./AnalyticReportStudent1";

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
                background: "#e3f2fd",
                position: "relative",
                padding: "2rem",
                fontFamily: "sans-serif"
            }}
        >
            <div style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: "0.75rem"
            }}>
                <button
                    type="button"
                    onClick={runSeed}
                    disabled={seeding}
                    style={{
                        padding: "0.7rem 1.2rem",
                        borderRadius: "10px",
                        border: "none",
                        background: "#111827",
                        color: "white",
                        cursor: "pointer",
                        minWidth: "200px",
                        fontSize: "0.9rem"
                    }}
                >
                    {seeding ? "Importing..." : "Import Random Data"}
                </button>

                <button
                    type="button"
                    onClick={handleMigrateDB}
                    style={{
                        padding: "0.7rem 1.2rem",
                        borderRadius: "10px",
                        border: "none",
                        background: "#111827",
                        color: "white",
                        cursor: "pointer",
                        minWidth: "200px",
                        fontSize: "0.9rem"
                    }}
                >
                    Migrate to NoSQL
                </button>
                {seedMsg && <div style={{ fontSize: "0.85rem", color: "#111827" }}>{seedMsg}</div>}
            </div>

            {/* Main Title */}
            <h1 style={{ margin: "0 0 1.5rem 0", fontSize: "3rem" }}>Home</h1>

            {/* Selection Buttons */}
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem"
            }}>
                <button
                    type="button"
                    onClick={() => navigate("/SelectTheUser")}
                    style={{
                        padding: "1rem 2rem",
                        borderRadius: "10px",
                        border: "none",
                        background: "#3b66f5",
                        color: "white",
                        cursor: "pointer",
                        minWidth: "280px",
                        fontSize: "1.1rem"
                    }}
                >
                    Select User
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/UseCase2")}
                    style={{
                        padding: "1rem 2rem",
                        borderRadius: "10px",
                        border: "none",
                        background: "#3b66f5",
                        color: "white",
                        cursor: "pointer",
                        minWidth: "280px",
                        fontSize: "1.1rem"
                    }}
                >
                    Select Tutor
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
                <Route path="/UseCase2" element={<UseCase2 />} />
                <Route path="/AnalyticsReportStudent1" element={<AnalyticsReportStudent1 />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;