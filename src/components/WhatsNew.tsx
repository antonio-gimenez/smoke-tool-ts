import React, { useEffect, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { Modal, ModalContent, ModalFooter, ModalHeader } from "./ui/Modal";

function WhatsNew() {
  const [currentVersion] = useState(require("../../package.json").version);
  const [lastVersion, setLastVersion] = useLocalStorage({ key: "whats-new-version-readed" });
  const [isChecked, setIsChecked] = useState(lastVersion === currentVersion);
  useEffect(() => {
    if (isChecked) {
      setLastVersion(currentVersion);
    }
  }, [currentVersion, setLastVersion, isChecked]);

  const onCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };



  return (
    <Modal id="whats-new" open={
      !isChecked
      // true
    }>
      <ModalHeader>
        <h4>What's new in version {currentVersion}</h4>
      </ModalHeader>
      <ModalContent>
        <p>Here is a list of changes since the last version:</p>
        <ul>
          <li>Added a new feature</li>
          <li>Fixed a bug</li>
          <li>Improved performance</li>
        </ul>

        {/* <label
          htmlFor="whats-new-checkbox"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}
        >
          <label className="toggle-switch">
            <input id="whats-new-checkbox"
              className="checkbox"
              type="checkbox"
              role="switch"
              aria-label="I have read the changes, don't show me this again for this version"
              aria-checked={isChecked}
              checked={isChecked}
              onChange={onCheckboxChange} />
            <span className="slider "></span>
          </label>


          <span className={`py-4 text-sm `}>I have readed the changes, don't show me this again for this version</span>

        </label> */}
      </ModalContent>
      <ModalFooter>
        <button className="button button-primary" onClick={() => setIsChecked(true)}> Got it, don't show me this again for this version
        </button>
      </ModalFooter>
    </Modal>
  );
}

export default WhatsNew;
