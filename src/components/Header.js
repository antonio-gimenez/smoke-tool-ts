import { NavLink } from "react-router-dom";
import useScrollState from "../hooks/useScrollState";
import { upperCaseFirstLetter } from "../utils/utils";
import NewTestForm from "./NewTestForm";
import ThemeSelector from "./ThemeSelector/ThemeSelector";
import { Modal, ModalTrigger } from "./ui/Modal";
const Header = () => {
  const [isBodyScrolled] = useScrollState({
    initialState: false,
    axis: "y",
    offset: 20,
  });

  const themes = ["light", "dark", "dracula", "coffee", "solarized", "nord"].map((theme) => ({
    id: theme,
    label: upperCaseFirstLetter(theme),
    value: theme,
  }));

  return (
    <header className={`header ${isBodyScrolled ? "glass" : ""}`}>
      <div className="header-bar container">
        <ul className="menu menu-horizontal ">
          <li>
            <NavLink className={"navbar-branding"} to={"/"} end>
              {process.env.REACT_APP_APP_NAME}
            </NavLink>
          </li>
          <li>
            <NavLink to={"/tests"}>Tests</NavLink>
          </li>
          <li>
            <NavLink to={"/tests-cases/"}>Test Cases</NavLink>
          </li>
          <li>
            <ModalTrigger id="create-test">Create</ModalTrigger>
            <Modal header={"New Test"} closeOnEscape={false} id="create-test">
              <NewTestForm modalId="create-test" />
            </Modal>
          </li>
        </ul>
        <nav aria-label="Theme switcher">
          <ThemeSelector themes={themes} />
        </nav>
      </div>
    </header>
  );
};

export default Header;
