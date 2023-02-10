import { generateUUID } from "../../utils/utils";

function Button({
  as = "button",
  color = "secondary",
  ghost = false,
  type = "button",
  children,
  id = generateUUID(),
  block = false,
  onClick = () => {},
  ...props
}) {
  const buttonColor = color;
  const buttonBlock = block ? "block" : "";
  const buttonGhost = ghost ? "ghost" : "";

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
