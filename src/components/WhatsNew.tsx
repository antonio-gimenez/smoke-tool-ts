import React, { useEffect, useState } from "react";
import useLocalStorage from "../hooks/use-local-storage";
import { Modal, ModalContent, ModalHeader } from "./ui/Modal";

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
    }>
      <ModalHeader>
        <h4>What's new in version {currentVersion}</h4>
      </ModalHeader>
      <ModalContent>
        <p>Here is a list of changes since the last version:</p>
        <label
          htmlFor="whats-new-checkbox"
        >
          <input
            id="whats-new-checkbox"
            className="checkbox"
            type="checkbox"
            aria-checked={isChecked}
            checked={isChecked}
            onChange={onCheckboxChange}
          />

          <span className={`py-4 text-sm `}>I have readed the changes, don't show me this again for this version</span>
        </label>
      </ModalContent>
    </Modal>
  );
}

export default WhatsNew;
