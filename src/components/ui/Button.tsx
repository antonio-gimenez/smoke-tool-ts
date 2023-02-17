import { Color } from "../../utils/colors";
import { generateUUID } from "../../utils/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  as?: React.ElementType;
  color?: Color;
  ghost?: boolean;
  block?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

function Button({
  as: As = "button",
  color,
  ghost = false,
  type = "button",
  children,
  id = generateUUID(),
  block = false,
  onClick = () => { },
  ...props
}: ButtonProps) {
  const buttonColor = color ? `button-${color}` : "button-ghost";
  const buttonBlock = block ? "button-block" : "";
  const buttonGhost = ghost ? "button-ghost" : "";

  return (
    <As
      type={type}
      id={id}
      onClick={onClick}
      className={`button ${buttonGhost} ${buttonColor} ${buttonBlock}`}
      {...props}
    >
      {children}
    </As>
  );
}

export default Button;
