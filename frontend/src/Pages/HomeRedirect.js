import { useNavigate } from "react-router-dom";
import "./HomeRedirect.css";

function HomeRedirect() {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <h1 className="home-title">Choose Use Case</h1>

            <div className="home-buttons">
                <button
                    className="home-btn primary"
                    onClick={() => navigate("/TutorModuleUseCase")}
                >
                    Tutor Module Use Case
                </button>

                <button
                    className="home-btn secondary"
                    onClick={() => navigate("/")}
                >
                    Select The User
                </button>
            </div>
        </div>
    );
}

export default HomeRedirect;
