import { NavLink } from "react-router-dom";
import { upperCaseFirstLetter } from "../utils/utils";
import ThemeSelector from "./ThemeSelector/ThemeSelector";
const Header = () => {
  const themes = ["light", "dark", "dracula", "coffee", "solarized"].map((theme) => ({
    id: theme,
    label: upperCaseFirstLetter(theme),
    value: theme,
  }));

  return (
    <header className="navbar ">
      <nav className="nav-start">
        <NavLink className={"navbar-branding text-primary"} to={"/"} end>
          {process.env.REACT_APP_APP_NAME}
        </NavLink>
      </nav>
      <nav className="nav-center">
        <NavLink to={"/tests"}>Tests</NavLink>
        <NavLink to={"/tests-cases/"}>Test Cases</NavLink>
      </nav>
      <nav className="nav-end">
        <ThemeSelector themes={themes} />
      </nav>
    </header>
  );
};

export default Header;
