import { FaHome, FaBookmark } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/BottomNavigation.css";

function BottomNavigation() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="bottom-nav">
            <button
                className={location.pathname === "/" ? "active" : ""}
                onClick={() => navigate("/")}
            >
                <FaHome />
            </button>

            <button
                className={location.pathname === "/saved" ? "active" : ""}
                onClick={() => navigate("/saved")}
            >
                <FaBookmark />
            </button>
        </div>
    );
}

export default BottomNavigation;