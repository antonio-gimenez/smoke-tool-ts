import { useEffect, useState } from "react";
import useLocalStorage from "./use-local-storage";

function useTheme() {
  const [storedTheme, setStoredTheme, removeStoredTheme, storedThemeExists] = useLocalStorage({ key: "theme" });
  // System preferred theme is only used if there is no stored theme. This is to prevent the theme from changing when the user changes their system theme.
  const [systemPreferredTheme, setSystemPreferredTheme] = useState<"dark" | "light">();

  useEffect(() => {
    const colorSchemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    // Set the system preferred theme on initial render.
    setSystemPreferredTheme(colorSchemeMediaQuery.matches ? "dark" : "light");
    // Update the system preferred theme when the user changes their system theme.
    const updateSystemPreferredTheme = (e: MediaQueryListEvent) => {
      setSystemPreferredTheme(e.matches ? "dark" : "light");
    };

    // Add the event listener when the component mounts.
    colorSchemeMediaQuery.addEventListener("change", updateSystemPreferredTheme);
    // Remove the event listener when the component unmounts.
    return () => colorSchemeMediaQuery.removeEventListener("change", updateSystemPreferredTheme);
  }, []);

  // Return the theme, system preferred theme, and functions to set and remove the theme.
  return {
    theme: storedTheme || (systemPreferredTheme && !storedThemeExists() ? systemPreferredTheme : null),
    system: !storedThemeExists(),
    remove: removeStoredTheme,
    setTheme: setStoredTheme,
  };
}

export default useTheme;