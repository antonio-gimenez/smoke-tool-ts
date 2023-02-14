import { useEffect, useState } from "react";
import useLocalStorage from "./use-local-storage";

enum ThemeValue {
  Dark = "dark",
  Light = "light",
  Dracula = "dracula",
}

interface ThemeState {
  value: ThemeValue;
  systemPreference: ThemeValue | undefined;
  isSystemPreferenceUsed: boolean;
  toggle: () => void;
}

function useThemeState(defaultTheme: ThemeValue = ThemeValue.Light): ThemeState {
  const [storedTheme, setStoredTheme, removeStoredTheme, storedThemeExists] =
    useLocalStorage({ key: "theme" });
  const [systemPreferredTheme, setSystemPreferredTheme] =
    useState<ThemeValue | undefined>(undefined);

  useEffect(() => {
    const colorSchemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemPreferredTheme(
      colorSchemeMediaQuery.matches ? ThemeValue.Dark : ThemeValue.Light
    );

    const updateSystemPreferredTheme = (e: MediaQueryListEvent) => {
      setSystemPreferredTheme(e.matches ? ThemeValue.Dark : ThemeValue.Light);
    };

    colorSchemeMediaQuery.addEventListener("change", updateSystemPreferredTheme);
    return () => colorSchemeMediaQuery.removeEventListener("change", updateSystemPreferredTheme);
  }, []);

  const themeValue = storedTheme || systemPreferredTheme || defaultTheme;
  const isSystemPreferenceUsed = !storedThemeExists();

  const toggleTheme = () => {
    if (themeValue === ThemeValue.Dark) {
      setStoredTheme(ThemeValue.Light);
    } else if (themeValue === ThemeValue.Light) {
      setStoredTheme(ThemeValue.Dark);
    }
  };

  return {
    value: themeValue,
    systemPreference: systemPreferredTheme,
    isSystemPreferenceUsed,
    toggle: toggleTheme,
  };
}

export default useThemeState;