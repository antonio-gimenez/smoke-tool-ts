import { useState } from "react";
import { ReactComponent as Moon } from "../assets/icons/moon.svg";
import { ReactComponent as Sun } from "../assets/icons/sun.svg";
import { ReactComponent as System } from "../assets/icons/system.svg";
import useTheme from "../hooks/use-theme";
import { Dropdown, DropdownMenu, DropdownToggle } from "./ui/Dropdown";

function ThemeSwitcher() {
  const { theme, setTheme, remove, system } = useTheme();
  const [open, setOpen] = useState(false);

  function toggleOpen() {
    setOpen(!open);
  }

  function toggleTheme(theme) {
    if (theme === "system") {
      remove();
    } else {
      setTheme(theme);
    }
    setOpen(false);
  }

  function getIcon() {
    if (system) return System;
    if (theme === "light") return Sun;
    if (theme === "dark") return Moon;
  }

  const Icon = getIcon();

  const themes = [
    {
      id: 0,
      label: "Light",
      value: "light",
      active: theme === "light" && !system,
    },
    {
      id: 1,
      label: "Dark",
      value: "dark",
      active: theme === "dark" && !system,
    },
    { id: 2, label: "System", value: "system", active: system },
  ];

  return (
    <Dropdown label={<Icon />} onClick={toggleTheme}>
      <DropdownToggle>
        <Icon />
      </DropdownToggle>
      <DropdownMenu>
        {/* {themes.map((theme) => (
          <li key={theme.id} className="menu-item" onClick={() => toggleTheme(theme.value)}>
            {theme.label}
          </li>
        ))} */}
        {themes}
      </DropdownMenu>
    </Dropdown>
  );
}

export default ThemeSwitcher;
