import React from "react";
import { ReactComponent as CheckIcon } from "../assets/icons/check.svg";

function Menu({ children, open = false, onClick = () => {} }) {
  return (
    <ul id={"menu"} className={`menu  ${open ? "open" : ""}`}>
      {children.map((child) => (
        <li key={child.id} className={`menu-item`} onClick={() => onClick(child.value)}>
          {child.active && <CheckIcon />}
          <span>{child.label}</span>
        </li>
      ))}
    </ul>
  );
}

export default Menu;
