import React, { useState } from "react";
import NewTestForm from "./NewTestForm";
import ThemeSwitcher from "./ThemeSwitcher";
import { Modal, ModalContent, ModalHeader, ModalTrigger } from "./ui/Modal";
import { Dropdown, DropdownMenu, DropdownToggle } from "./ui/Dropdown";
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

          <Dropdown label="Test Cases" onClick={() => {}}>
            <DropdownToggle>Test Cases</DropdownToggle>
            <DropdownMenu>{testCases}</DropdownMenu>
          </Dropdown>
          <a className="link" href="/testcases/">
            Test Cases
          </a>
          <ModalTrigger id="create-test">Create</ModalTrigger>
          <Modal closeOnOverlayClick={false} id="create-test">
            <ModalHeader>
              <p>New Test</p>
            </ModalHeader>
            <ModalContent>
              <NewTestForm />
            </ModalContent>
          </Modal>
        </nav>
        <nav aria-label="Theme switcher">
          <ThemeSwitcher />
        </nav>
      </div>
    </header>
  );
};

export default Header;
