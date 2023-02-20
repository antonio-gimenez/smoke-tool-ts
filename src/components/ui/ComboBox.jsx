import React, { useEffect, useRef, useState } from "react";
import { ReactComponent as ChevronDownIcon } from "../../assets/icons/chevron-down.svg";
import { ReactComponent as CloseIcon } from "../../assets/icons/close.svg";

import useKey from "../../hooks/useKey";
import useOnClickOutside from "../../hooks/useOnClickOutside";

const ComboBox = ({
  id = null,
  placeholder = "Select an option",
  options = [],
  multiple = false,
  onChange = () => {},
  disabled = false,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedValue, setSelectedValue] = useState(multiple ? [] : null);
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef();
  const selectRef = useRef();

  const mappedOptions = options.map((option) => {
    if (!option.hasOwnProperty("_id") || !option.hasOwnProperty("value") || !option.hasOwnProperty("label")) {
      return { _id: option._id, value: option.value ?? option.name, label: option.label ?? option.name };
    }
    return option;
  });

  useOnClickOutside({
    ref: selectRef,
    handler: () => setShowMenu(false),
  });

  useKey({
    key: "Escape",
    handler: () => setShowMenu(false),
  });

  useKey({
    key: " ",
    handler: () => {
      if (inputRef.current === document.activeElement) {
        setShowMenu(!showMenu);
      }
    },
  });

  useEffect(() => {
    setSearchValue("");
  }, [showMenu]);

  const handleInputClick = (e) => {
    setShowMenu(!showMenu);
  };

  const getDisplay = () => {
    if (!selectedValue || selectedValue.length === 0) {
      return <span />;
    }
    if (multiple) {
      return (
        <>
          {selectedValue.map((option) => (
            <span key={option.value} className="combobox-tag-item">
              {option.label}
              <span onClick={(e) => onTagRemove(e, option)} className="combobox-tag-close">
                <CloseIcon className="icon-16" />
              </span>
            </span>
          ))}
        </>
      );
    }

    return selectedValue?.map((option) => option.label).join(", ");
  };

  const removeOption = (option) => {
    return selectedValue.filter((o) => o.value !== option.value);
  };

  const onTagRemove = (e, option) => {
    e.stopPropagation();
    const newValue = removeOption(option);
    setSelectedValue(newValue);
    onChange(newValue);
  };

  const onItemClick = (option) => {
    let newValue;
    if (multiple) {
      if (selectedValue.findIndex((o) => o.value === option.value) >= 0) {
        newValue = removeOption(option);
      } else {
        newValue = [...selectedValue, option];
      }
    } else {
      newValue = [option]; // Wrap the selected option in an array
    }
    setSelectedValue(newValue);
    if (searchValue !== "") {
      setSearchValue("");
    }
    setShowMenu(false);
    console.log({ newValue });
    const fakeEvent = {
      target: {
        value: multiple ? newValue.map((o) => o.value) : option.value,
        id: id,
      },
    };
    onChange(fakeEvent);
  };
  const isSelected = (option) => {
    if (multiple) {
      return selectedValue.filter((o) => o.value === option.value).length > 0;
    }

    if (!selectedValue) {
      return false;
    }

    return selectedValue.value === option.value;
  };

  const onSearch = (e) => {
    if (!showMenu) {
      setShowMenu(true);
    }
    setSearchValue(e.target.value);
  };

  const getOptions = () => {
    if (!searchValue) {
      // return mappedOptions;
      // return a message if no options are found
      return mappedOptions.length === 0 ? [{ label: "No options found", value: null }] : mappedOptions;
    }

    return mappedOptions.filter((option) => option.label.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0);
  };

  const clearSelection = () => {
    setSelectedValue(multiple ? [] : "");
    onChange(multiple ? [] : "");
  };

  const optionsToDisplay = getOptions();

  return (
    <div className="combobox-container" ref={selectRef}>
      <div className="combobox-input-container">
        <div className="combobox-display">{getDisplay()}</div>
        <input
          role="combobox"
          tabIndex={0}
          ref={inputRef}
          onClick={handleInputClick}
          onChange={onSearch}
          className="combobox-input-ghost"
          placeholder={selectedValue && selectedValue.length > 0 ? "" : placeholder}
          aria-expanded={showMenu}
          value={searchValue}
          disabled={disabled}
          aria-disabled={disabled}
        />
        <div className="combobox-indicators">
          {selectedValue && selectedValue.length > 0 && (
            <span className="combobox-clear" onClick={clearSelection}>
              <CloseIcon className="icon-16" />
            </span>
          )}
          <ChevronDownIcon className={`icon-20 chevron ${showMenu ? "chevron-open" : "chevron-closed"}`} />
        </div>
      </div>
      {showMenu && (
        <div className="combobox-options">
          {optionsToDisplay.map((option) => (
            <div
              key={option.value}
              className={`combobox-option-item ${isSelected(option) ? "selected" : ""}`}
              onClick={() => onItemClick(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComboBox;
