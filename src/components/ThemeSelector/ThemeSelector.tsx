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
  const { currentTheme, setTheme, systemPreference, isSystemPreferenceUsed, removeTheme } = useThemeState();
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

  const setSystemTheme = () => {
    removeTheme(currentTheme);
    setOpen(false);
  }


  return (
    <div className="dropdown dropdown-end" ref={dropdownRef}>
      <button className="button button-ghost" onClick={() => setOpen(!open)} aria-expanded={open}>
        Theme
      </button>

      <div className={`dropdown-content  ${open ? 'visible' : 'hidden'}`} role="listbox" tabIndex={0}>
        <div className="theme-list">
          <button className={`theme-list-item button`} onClick={setSystemTheme} role="option" aria-selected={currentTheme === 'system'}>
            System Preference
          </button>
          {themes.map((theme) => {
            const active = theme.value === currentTheme && !isSystemPreferenceUsed;

            return <button
              tabIndex={0}
              key={theme.id}
              data-theme={theme.value}
              className={`button theme-list-item ${active ? 'active' : ''}`}
              onClick={() => set(theme)}
              role="option"
              aria-selected={active}
              aria-label={theme.label}
            >
              <span className="theme-list-item-name">
                {active && <span className="theme-list-item-active">*</span>}
                {theme.label}
              </span>
              <div className="theme-list-palette">
                {paletteColors.map((color) => (
                  <div className={`theme-list-palette-${color}`} key={color} />
                ))}
              </div>
            </button>
          })}
        </div>
      </div >
      <div className="dropdown-fade-decoration" />
    </div >

  );
}

export default ThemeSelector;
