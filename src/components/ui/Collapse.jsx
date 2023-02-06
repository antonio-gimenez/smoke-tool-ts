import React, { useState } from "react";
import { ReactComponent as Chevron } from "../../assets/icons/chevron-down.svg";

const Collapse = ({ children, title = "New Item", open = true, ...props }) => {
  const [isOpen, setOpen] = useState(open);

  return (
    <div className="collapse" {...props} tabIndex={0}>
      <button type="button" className="collapse-button" onClick={() => setOpen(!isOpen)}>
        <div className="collapse-title">
          <span>{title}</span>
          <Chevron className={`chevron ${isOpen ? "rotated-180deg" : "no-rotated"}`} />
        </div>
      </button>
      <span className={`collapse-content ${isOpen ? "visible" : "hidden"}`}>{children}</span>
    </div>
  );
};

export default Collapse;
