import NewTestForm from "./NewTestForm";
import ThemeSelector from "./ThemeSelector/ThemeSelector";
import { Modal, ModalContent, ModalHeader, ModalTrigger } from "./ui/Modal";
import useScrollState from "../hooks/use-scroll-state";
const Header = () => {
  const [isBodyScrolled] = useScrollState({
    initialState: false,
    axis: "y",
    offset: 20,
  });

  const themes = [
    {
      id: 1,
      label: "Light",
      value: "light",
    },
    {
      id: 2,
      label: "Dark",
      value: "dark",
    },
    {
      id: 3,
      label: "Dracula",
      value: "dracula",
    },
    {
      id: 4,
      label: "Midnight",
      value: "midnight",
    },
    {
      id: 5,
      label: "Coffee",
      value: "coffee",
    },
    {
      id: 6,
      label: "Nord",
      value: "nord",
    },
  ];

  return (
    <header className={`header ${isBodyScrolled ? "glass" : ""}`}>
      <div className="navbar container">
        <nav aria-label="Main navigation">
          <span className="navbar-branding">{process.env.REACT_APP_APP_NAME}</span>
        </nav>
        <nav aria-label="Links">
          <a className="link" href="/tests/">
            Tests
          </a>
          <a className="link" href="/testcases/">
            Test Cases
          </a>
          <ModalTrigger id="create-test">Create</ModalTrigger>
          <Modal closeOnOverlayClick={false} closeOnEscape={false} id="create-test">
            <ModalHeader>
              <p>New Test</p>
            </ModalHeader>
            <ModalContent>
              <NewTestForm />
            </ModalContent>
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
