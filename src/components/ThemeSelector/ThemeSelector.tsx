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
    systemPreference,
    removeTheme,
  } = useThemeState();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  function set(theme: ThemeOption): void {
    setTheme(theme.value);
  }

  useOnClickOutside({
    ref: dropdownRef,
    handler: () => setOpen(false),
  });

  useKeyPress({
    key: "Escape",
    handler: () => setOpen(false),
  });

  const Palette = ({ color }: { color: string }): JSX.Element => (
    <span className={`theme-list-palette-${color}-bullet`} />

  );

  return (
    <div className="dropdown dropdown-end" ref={dropdownRef}>
      <button
        className="button button-ghost"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
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
            <div className={`theme-list-item `} data-theme={systemPreference} onClick={() => removeTheme(currentTheme)}
              role="option"
              aria-selected={currentTheme === "system"}
            >
              <span>

                System
              </span>
              <div className="theme-list-palette">
                {["primary", "secondary", "accent", "neutral"].map((color) => (
                  <span className={`theme-list-palette-${color}-bullet`} key={color} />
                ))}
              </div>
            </div>
          </li>
          {themes.map((theme) => {
            const active = theme.value === currentTheme && !isSystemPreferenceUsed;
            return (
              <li
                key={theme.id}
              >
                <div
                  tabIndex={0}
                  data-theme={theme.value}
                  className={`theme-list-item ${active ? "active" : ""}`}
                  onClick={() => set(theme)}
                  role="option"
                  aria-selected={active}
                  aria-label={theme.label}
                >
                  <span>
                    {theme.label}
                  </span>

                  <div className="theme-list-palette">
                    {["primary", "secondary", "accent", "neutral"].map((color) => (
                      <Palette color={color} key={'theme-' + color} />
                    ))}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

    </div >
  );
}

export default ThemeSelector;
