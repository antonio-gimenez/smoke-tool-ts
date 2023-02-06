import React from "react";
import { generateUUID } from "../../utils/utils";

function Button({
  as = "button",
  color,
  ghost = false,
  type = "button",
  children,
  id = generateUUID(),
  block = false,
  onClick = () => {},
  ...props
}) {
  // const id = props.id || Math.random().toString(36).substr(2, 9);
  const buttonColor = color ? color : "";
  const buttonBlock = block ? "block" : "";
  const buttonGhost = ghost ? "ghost" : "";
  if (as === "link") {
    return (
      <a role="link" aria-label={children} id={id} className={`button link  ${buttonBlock}`} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type ? type : "button"}
      id={id}
      onClick={onClick}
      className={`button ${buttonGhost} ${buttonColor} ${buttonBlock}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
