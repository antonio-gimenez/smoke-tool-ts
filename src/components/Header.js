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
      <div className="navbar container">
        <nav aria-label="Main navigation">
          <span className="navbar-branding">
            <span>{process.env.REACT_APP_APP_NAME}</span>
          </span>
        </nav>
        <nav className="nav-links" aria-label="Links">
          <a className="link" href="/tests/">
            Tests
          </a>
          <a className="link" href="/testcases/">
            Test Cases
          </a>
          <ModalTrigger id="create-test">Create</ModalTrigger>
          <Modal header={"New Test"} closeOnEscape={false} id="create-test">
            <NewTestForm modalId="create-test" />
          </Modal>
        </nav>
        <nav aria-label="Theme switcher">
          <ThemeSelector themes={themes} />
        </nav>
      </div>
    </header>
  );
};

export default Header;
