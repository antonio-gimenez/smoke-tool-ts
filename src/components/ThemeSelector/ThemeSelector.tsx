import { useRef, useState } from "react";
import useKeyPress from "../../hooks/use-key-press";
import useOnClickOutside from "../../hooks/use-on-click-outside";
import useThemeState from "../../hooks/use-theme-state";
import { upperCaseFirstLetter } from "../../utils/utils";
import "./theme-selector.css";

type ThemeOption = {
  id: string;
  label: string;
  value: string;
};

type ThemeSelectorProps = {
  themes: ThemeOption[];
};

function ThemeSelector({ themes }: ThemeSelectorProps): JSX.Element {
  const {
    currentTheme,
    setTheme,
    isSystemPreferenceUsed,
    removeTheme,
  } = useThemeState();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  function set(theme: ThemeOption): void {
    if (theme.value === "system") {
      removeTheme("system");
    } else {
      setTheme(theme.value);
    }
    setOpen(false);
  }

  useOnClickOutside({
    ref: dropdownRef,
    handler: () => setOpen(false),
  });

  useKeyPress({
    key: "Escape",
    handler: () => setOpen(false),
  });

  const setSystemTheme = (): void => {
    removeTheme(currentTheme);
    setOpen(false);
  };

  const Palette = ({ color }: { color: string }): JSX.Element => (
    <span className={`theme-list-palette-${color}`}>
      {/* show only the first letter of the color in uppercase */}
      {/* {color[0].toUpperCase()} */}
      A
    </span>

  );

  return (
    <div className="dropdown dropdown-end" ref={dropdownRef}>
      <button
        className="button button-ghost"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {/* check if isSystemPreferenceUsed, then only call theme */}
        {isSystemPreferenceUsed
          ? 'Theme'
          : upperCaseFirstLetter(currentTheme)}
      </button>

      <div
        className={`dropdown-content ${open ? "visible" : "hidden"}`}
        role="listbox"
        aria-labelledby="theme-selector"
        tabIndex={0}
      >
        <ul className="theme-list">
          <li>
            <button
              className="button theme-list-item"
              onClick={setSystemTheme}
              role="option"
              aria-selected={currentTheme === "system"}
            >
              System Preference
            </button>
          </li>
          {themes.map((theme) => {
            const active = theme.value === currentTheme && !isSystemPreferenceUsed;
            return (
              <li >
                <div
                  key={theme.id}
                  tabIndex={0}
                  data-theme={theme.value}
                  className={`theme-list-item ${active ? "active" : ""}`}
                  onClick={() => set(theme)}
                  role="option"
                  aria-selected={active}
                  aria-label={theme.label}
                >

                  {theme.label}

                  <div className="theme-list-palette">
                    {["primary", "secondary", "accent", "neutral"].map((color) => (
                      <Palette color={color} key={color} />
                    ))}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

    </div>
  );
}

export default ThemeSelector;
