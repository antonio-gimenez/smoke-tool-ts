import { useNavigate } from "react-router-dom";
import { ReactComponent as Astronaut404 } from "../assets/icons/astronaut-404.svg";
function NotFound() {
    const navigate = useNavigate();
    return (
        <div className="hero">
            <div className="hero-content">
                <Astronaut404 className="hero-image" />
                <div>
                    <h1 className="hero-title">Oops! Page not found</h1>
                    <p>The page you are looking for could not be found. Please check the URL and try again.</p>
                    <button className="button button-primary button-large" onClick={() => navigate("/")}>
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NotFound