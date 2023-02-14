import { useRef, useState } from "react";
import useKeyPress from "../../hooks/use-key-press";
import useOnClickOutside from "../../hooks/use-on-click-outside";
import useThemeState from "../../hooks/use-theme-state";
import { ReactComponent as CheckIcon } from "../../assets/icons/check.svg";
import "./theme-selector.css";

type ThemeOption = {
  id: string,
  label: string,
  value: "dark" | "light" | "dracula" | "system",
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

  const paletteColors = ['primary', 'secondary', 'accent', 'base', 'neutral']




  return (
    <div className="dropdown dropdown-end" ref={dropdownRef}>
      <button className="button button-ghost" onClick={() => setOpen(!open)}>
        Theme
      </button>

      <ul className={`dropdown-content  ${open ? 'visible' : 'hidden'}`}>
        <div className="theme-list-grid">
          {themes.map((theme) => {
            const active = theme.value === currentTheme;
            return <div
              key={theme.id}
              data-theme={theme.value}
              className={`theme-list-item ${active ? 'active' : ''
                } `}
              onClick={() => set(theme)}
            >
              <span>
                {active && <CheckIcon style={{ height: '12px' }} />}

                {theme.label}
              </span>
              <div className="theme-list-palette">
                {paletteColors.map((color) => (
                  <div className={`theme-list-palette-${color}`} key={color}></div>
                ))}
              </div>

            </div>
          })}

        </div>
      </ul>
    </div>
    // <div className="dropdown" ref={dropdownRef}>
    //   <button className="button button-ghost" onClick={() => setOpen(!open)}>
    //     Theme
    //   </button>

    //   <ul className={`dropdown-content   menu ${open ? 'visible' : 'hidden'}`}>

    //     {themes.map((theme) => (
    //       <li
    //         key={theme.id}
    //         className={theme.value === currentTheme ? 'active' : ''}
    //         onClick={() => set(theme)}
    //       >

    //         {theme.label}
    //       </li>
    //     ))}
    //   </ul>
    // </div>

  );
}

export default ThemeSelector;
