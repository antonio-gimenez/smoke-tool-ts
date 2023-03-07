import { NavLink } from "react-router-dom";
import { upperCaseFirstLetter } from "../utils/utils";
import ThemeSelector from "./ThemeSelector/ThemeSelector";
const Header = () => {
  const themes = ["light", "dark", "dracula", "coffee", "solarized", "nord"].map((theme) => ({
    id: theme,
    label: upperCaseFirstLetter(theme),
    value: theme,
  }));

  return (
    <header className="navbar">
      {/* <nav> */}
      <ul className="menu menu-horizontal">
        <li className="nav-item">
          <NavLink className={"navbar-branding"} to={"/"} end>
            {process.env.REACT_APP_APP_NAME}
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to={"/tests"}>Tests</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to={"/tests-cases/"}>Test Cases</NavLink>
        </li>
        <li className="nav-item">
          <ThemeSelector themes={themes} />
        </li>
      </ul>
      {/* </nav> */}
    </header>
  );
};

export default Header;
