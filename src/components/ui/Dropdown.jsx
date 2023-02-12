import React, { createContext, useContext, useRef, useState } from "react";
import { ReactComponent as ChevronIcon } from "../../assets/icons/chevron-down.svg";
import { ReactComponent as CheckIcon } from "../../assets/icons/check.svg";
import useOnClickOutside from "../../hooks/use-on-click-outside";
import useKeyPress from "../../hooks/use-key-press";
import { generateUUID } from "../../utils/utils";
import useHover from "../../hooks/use-hover";

const DropdownContext = createContext();

const Dropdown = ({ label, children, onClick = () => {}, ...props }) => {
  const [open, setOpen] = useState(false);
  const onHandleHover = (isHovered) => {
    console.log("isHovered", isHovered);
    setOpen(isHovered);
  };
  const [dropdownRef, isHovered] = useHover({ initialRef: null, handler: onHandleHover });
  useOnClickOutside({ ref: dropdownRef, handler: () => setOpen(false) });
  useKeyPress({ key: "Escape", handler: () => setOpen(false) });

  const handleClick = (item) => {
    onClick(item);
    setOpen(false);
  };

  return (
    <DropdownContext.Provider value={{ open, setOpen, handleClick }}>
      <div className="dropdown" {...props} ref={dropdownRef}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

const DropdownToggle = ({ hideChevron = false, children, ...props }) => {
  const { open, setOpen } = useContext(DropdownContext);

  return (
    <button {...props} onClick={() => setOpen(!open)} className="dropdown-toggle">
      {children}
      {!hideChevron && <ChevronIcon style={{ width: "18px", height: "18px" }} />}
    </button>
  );
};

const DropdownContent = ({ children }) => {
  const { open } = useContext(DropdownContext);
  return <div className={`dropdown-content ${open ? "open" : ""} `}>{children}</div>;
};

const DropdownMenu = ({ children }) => {
  const { open } = useContext(DropdownContext);

  return (
    <ul id={"menu"} className={` dropdown-content menu ${open ? "open" : ""}`}>
      {children.map((child) => (
        <DropdownItem key={child.id || generateUUID()}>{child}</DropdownItem>
      ))}
    </ul>
  );
};

const DropdownItem = ({ children, ...props }) => {
  const { handleClick } = useContext(DropdownContext);

  return (
    <li key={children.id} className={`menu-item`} onClick={() => handleClick(children.value)} {...props}>
      {children.active && (
        <div className="menu-item-check">
          <CheckIcon className="icon-16" />
        </div>
      )}
      {children.label}
    </li>
  );
};

export { Dropdown, DropdownContent, DropdownToggle, DropdownMenu, DropdownItem };
