import { generateUUID } from "../../utils/utils";

function Menu({ id = `menu-${generateUUID()}`, children, open = false }) {
  return (
    <ul id={id} className={`menu  ${open ? "open" : ""}`}>
      {children}
    </ul>
  );
}

export default Menu;
