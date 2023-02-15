import { useRef, useState } from "react";
import useKeyPress from "../../hooks/use-key-press";
import useOnClickOutside from "../../hooks/use-on-click-outside";
import useThemeState from "../../hooks/use-theme-state";
import "./theme-selector.css";

type ThemeOption = {
  id: string,
  label: string,
  value: string,
};

type ThemeSelectorProps = {
  themes: ThemeOption[],
};

function ThemeSelector({ themes }: ThemeSelectorProps) {
  const { currentTheme, setTheme, systemPreference, removeTheme } = useThemeState();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  function set(theme: ThemeOption) {
    if (theme.value === "system") {
      removeTheme('system');
    } else {
      console.log(theme.value);
      setTheme(theme.value);
    }
    setOpen(false);
  }


  useOnClickOutside({
    ref: dropdownRef,
    handler: () => setOpen(false),
  })

  useKeyPress({
    key: "Escape",
    handler: () => setOpen(false),
  })

  const paletteColors = ['primary', 'secondary', 'accent', 'base-200', 'base-300', 'neutral']




  return (
    <div className="dropdown dropdown-end" ref={dropdownRef}>
      <button className="button button-ghost" onClick={() => setOpen(!open)}>
        Theme
      </button>

      <ul className={`dropdown-content  ${open ? 'visible' : 'hidden'}`}>
        <div className="theme-list">
          <li className="theme-list-item" data-theme={systemPreference} onClick={() => removeTheme(currentTheme)}>
            System Theme: {systemPreference === "dark" ? "Dark" : "Light"}
          </li>
          {themes.map((theme) => {
            const active = theme.value === currentTheme || null;
            return <div
              key={theme.id}
              data-theme={theme.value}
              className={`theme-list-item ${active ? 'active' : ''
                } `}
              onClick={() => set(theme)}
            >
              <span className="theme-list-item-name">
                {theme.label}
              </span>
              <div className="theme-list-palette">
                {paletteColors.map((color) => (
                  <div className={`theme-list-palette-${color}`} key={color} />
                ))}
              </div>

            </div>
          })}

        </div>
      </ul >
    </div >
  );
}

export default ThemeSelector;
