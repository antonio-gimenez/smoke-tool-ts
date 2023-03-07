import { useNavigate } from "react-router-dom";
import { ReactComponent as Vampire404 } from "../assets/icons/vampire-404.svg";
import { ReactComponent as Astronaut404 } from "../assets/icons/astronaut-404.svg";
function NotFound() {
    const navigate = useNavigate();
    return (
        <div className="container-404">
            {/* <Vampire404 className="logo404" /> */}
            <Astronaut404 className="logo404" />
            <div>
                <h1>Oops! Page not found</h1>
                <p>The page you are looking for could not be found. Please check the URL and try again.</p>
                <button className="button button-primary button-large" onClick={() => navigate("/")}>
                    Back to Home
                </button>
            </div>
        </div>
    )
}

export default NotFound