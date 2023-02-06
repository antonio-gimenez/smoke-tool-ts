import React, { useState } from "react";
import { ReactComponent as CloseIcon } from "../../assets/icons/close.svg";

import useKeyPress from "../../hooks/use-key-press";
import Input from "./Input";
import { generateUUID } from "../../utils/utils";

const Tags = ({ id = generateUUID(), placeholder = "Input tags", onChange = () => {}, isDisabled = false }) => {
  const [selectedValues, setSelectedValues] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const handleAddTag = () => {
    if (inputValue) {
      setSelectedValues([...selectedValues, inputValue]);
      setInputValue("");
    }
    onChange(selectedValues);
  };
  useKeyPress({
    key: "Enter",
    handler: handleAddTag,
  });

  const handleDeleteTag = (tag) => {
    setSelectedValues(selectedValues.filter((value) => value !== tag));
  };

  return (
    <div>
      <input
        className="input"
        id={id}
        placeholder={placeholder}
        aria-disabled={isDisabled}
        disabled={isDisabled}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <div className="tags">
        {selectedValues?.map((value, index) => (
          <div className="tag-item" key={index}>
            <span>{value}</span>
            <button onClick={() => handleDeleteTag(value)}>
              <CloseIcon className="close-tag" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tags;
