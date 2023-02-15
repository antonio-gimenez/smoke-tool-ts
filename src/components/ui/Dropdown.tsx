import { useState } from "react";

interface DropdownProps {
  position: "end" | "left" | "right" | "top" | "bottom";
  label: string;
  children: React.ReactNode;
}
const Dropdown = ({ position, label, children }: DropdownProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`dropdown dropdown-${position}`}>
      <button
        className="button button-ghost"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {label}
      </button>
      <div
        className={`dropdown-content ${open ? "visible" : "hidden"}`}
        role="listbox"
        aria-labelledby="theme-selector"
        tabIndex={0}
      >
        {children}
      </div>
    </div>
  );
};

export default Dropdown;