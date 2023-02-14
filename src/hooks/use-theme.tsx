import { useEffect, useState } from "react";
import useLocalStorage from "./use-local-storage";

interface ThemeState {
  theme: "dark" | "light" | "dracula";
  system: boolean;
  remove: () => void;
  setTheme: (theme: "dark" | "light" | "dracula") => void;
}

const themeList = ["dark", "light", "dracula"];

function useTheme() {
  const [storedTheme, setStoredTheme, removeStoredTheme, storedThemeExists] = useLocalStorage({ key: "theme" });
  const [systemPreferredTheme, setSystemPreferredTheme] = useState<ThemeState["theme"]>();


  useEffect(() => {
    const colorSchemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemPreferredTheme(colorSchemeMediaQuery.matches ? "dark" : "light");

    const updateSystemPreferredTheme = (e: MediaQueryListEvent) => {
      setSystemPreferredTheme(e.matches ? "dark" : "light");
    };

    colorSchemeMediaQuery.addEventListener("change", updateSystemPreferredTheme);
    return () => colorSchemeMediaQuery.removeEventListener("change", updateSystemPreferredTheme);
  }, []);

  return {
    theme: storedTheme || (systemPreferredTheme && !storedThemeExists() ? systemPreferredTheme : 'light'),
    system: !storedThemeExists(),
    remove: removeStoredTheme,
    setTheme: (theme: "dark" | "light" | "dracula") => {
      if (themeList.includes(theme)) {
        setStoredTheme(theme);
      }
    },
  };
}

export default useTheme;
