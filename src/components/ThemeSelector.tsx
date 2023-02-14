import { useState } from "react";
import { ReactComponent as Moon } from "../assets/icons/moon.svg";
import { ReactComponent as Sun } from "../assets/icons/sun.svg";
import { ReactComponent as System } from "../assets/icons/system.svg";
import useThemeState from "../hooks/use-theme-state";
import { generateUUID } from "../utils/utils";
import { Dropdown, DropdownMenu, DropdownToggle } from "./ui/Dropdown";

type ThemeOption = {
  id: string,
  label: string,
  value: "dark" | "light" | "dracula" | "system",
};

type ThemeSelectorProps = {
  themes: ThemeOption[],
};

function ThemeSelector({ themes }: ThemeSelectorProps) {
  const { value, toggle, systemPreference } = useThemeState();
  const [open, setOpen] = useState(false);

  function toggleTheme(theme: ThemeOption) {
    if (theme.value === "system") {
      toggle();
    } else {
      toggle();
    }
    setOpen(false);
  }

  function getIcon() {
    switch (value) {
      case "dark":
        return Moon;
      case "light":
      default:
        return Sun;
    }
  }


  const Icon = getIcon();

  return (
    <Dropdown label="abc">
      <DropdownToggle>
        <Icon />
      </DropdownToggle>
      <DropdownMenu>
        {themes.map((theme) => (
          <li
            key={theme.id}
            className={`menu-item ${theme.value === value && !systemPreference ? "active" : ""}`}
            onClick={() => toggleTheme(theme)}
          >
            {theme.label}
          </li>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}

export default ThemeSelector;
