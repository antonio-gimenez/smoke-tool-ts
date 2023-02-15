import { useEffect, useState } from "react";
import useLocalStorage from "./use-local-storage";



interface ThemeState {
  currentTheme: string;
  setTheme: (value: string) => void;
  systemPreference: string | undefined;
  isSystemPreferenceUsed: boolean;
  removeTheme: (value: string) => void;
}

function useThemeState(defaultTheme?: 'light'): ThemeState {
  const [storedTheme, setStoredTheme, removeStoredTheme, storedThemeExists] =
    useLocalStorage({ key: "theme" });
  const [systemPreferredTheme, setSystemPreferredTheme] =
    useState<string | undefined>(undefined);

  useEffect(() => {
    const colorSchemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemPreferredTheme(
      colorSchemeMediaQuery.matches ? 'dark' : 'light'
    );

    const updateSystemPreferredTheme = (e: MediaQueryListEvent) => {
      setSystemPreferredTheme(e.matches ? 'dark' : 'light');
    };

    colorSchemeMediaQuery.addEventListener("change", updateSystemPreferredTheme);
    return () => colorSchemeMediaQuery.removeEventListener("change", updateSystemPreferredTheme);
  }, []);

  const themeValue = storedTheme || systemPreferredTheme || defaultTheme;
  const isSystemPreferenceUsed = !storedThemeExists();

  return {
    currentTheme: themeValue,
    setTheme: setStoredTheme,
    systemPreference: systemPreferredTheme,
    isSystemPreferenceUsed,
    removeTheme: removeStoredTheme,
  };
}


export default useThemeState;