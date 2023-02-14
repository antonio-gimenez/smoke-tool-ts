import { createContext, useContext, useRef, useState } from "react";
import { ReactComponent as CheckIcon } from "../../assets/icons/check.svg";
import { ReactComponent as ChevronIcon } from "../../assets/icons/chevron-down.svg";
import useKeyPress from "../../hooks/use-key-press";
import useOnClickOutside from "../../hooks/use-on-click-outside";
import { generateUUID } from "../../utils/utils";

const DropdownContext = createContext();

const Dropdown = ({ children, onClick = () => {}, ...props }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

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
    <button {...props} onClick={() => setOpen(!open)} className="button button-ghost">
      {children}
      {!hideChevron && <ChevronIcon style={{ width: "18px", height: "18px" }} />}
    </button>
  );
};

const DropdownContent = ({ children }) => {
  const { open } = useContext(DropdownContext);
  return <div className={`dropdown-content ${open ? "open" : ""} `}>{children}</div>;
};

const DropdownItem = ({ children, ...props }) => {
  const { handleClick } = useContext(DropdownContext);

  return (
    <li key={children.id} className={`menu-item`} onClick={() => handleClick(children.value)} {...props}>
      {children.label}
    </li>
  );
};

export { Dropdown, DropdownContent, DropdownToggle, DropdownItem };
