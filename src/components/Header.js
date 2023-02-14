import React, { useState } from "react";
import NewTestForm from "./NewTestForm";
import ThemeSelector from "./ThemeSelector/ThemeSelector";
import { Dropdown, DropdownContent, DropdownToggle } from "./ui/Dropdown";
import { Modal, ModalContent, ModalHeader, ModalTrigger } from "./ui/Modal";
const Header = () => {
  // add a glass effect to the header when is scrolled
  const [isScrolled, setIsScrolled] = useState(false);
  React.useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
  }, []);

  const testCases = [
    {
      id: 1,
      label: "Failed",
      value: "failed",
    },
    {
      id: 2,
      label: "Passed",
      value: "passed",
    },
  ];

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
  ];

  return (
    <header className={`header ${isScrolled ? "glass" : ""}`}>
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
