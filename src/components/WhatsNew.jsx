import React, { useEffect, useState } from "react";
import useLocalStorage from "../hooks/use-local-storage";
import { Modal, ModalContent, ModalHeader } from "./ui/Modal";

function WhatsNew() {
  const [currentVersion] = useState(require("../../package.json").version);
  const [lastVersion, setLastVersion] = useLocalStorage("whats-new-version-readed");
  const [isChecked, setIsChecked] = useState(lastVersion === currentVersion);

  useEffect(() => {
    if (isChecked) {
      setLastVersion(currentVersion);
    }
  }, [currentVersion, setLastVersion, isChecked]);

  const onCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  return (
    <Modal id="whats-new" open={!isChecked}>
      <ModalHeader>
        <h4>What's new in version {currentVersion}</h4>
      </ModalHeader>
      <ModalContent>
        <div className="text-sm">
          <p>Here is a list of changes since the last version:</p>
          <h3 className="my-2 text-base font-semibold">Generate Report</h3>
          <ul className="list-item mx-4 list-disc">
            <li>
              <p>Reworked UI </p>
            </li>
            <li>
              <p>Now selected items are memorized when date changes. </p>
            </li>
            <li>
              <p>Able to navigate with left/right arrow keys. </p>
            </li>
          </ul>
        </div>

        <hr className="m-3" />

        <label
          htmlFor="whats-new-checkbox"
          className="bg-gray-50 flex items-center px-2 space-x-1 rounded-lg cursor-pointer select-none"
        >
          <input
            id="whats-new-checkbox"
            className="focus:ring-0 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded outline-none"
            type="checkbox"
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
