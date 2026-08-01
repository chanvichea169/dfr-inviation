import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";

  // Check stored preference first
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    /* ignore storage errors */
  }

  // Fallback to DOM class (set by inline anti-FOUC script) or media query
  if (document.documentElement.classList.contains("dark")) return "dark";

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  // Sync DOM and LocalStorage when theme state changes
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Handles private mode write restrictions
    }
  }, [theme]);

  // Listen to OS system theme changes only if user hasn't saved an explicit choice
  useEffect(() => {
    if (typeof window === "undefined") return;

    let hasStoredPreference = false;
    try {
      hasStoredPreference = Boolean(localStorage.getItem(STORAGE_KEY));
    } catch {
      /* ignore */
    }

    if (hasStoredPreference) return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event: MediaQueryListEvent) => {
      setThemeState(event.matches ? "dark" : "light");
    };

    if (media.addEventListener) {
      media.addEventListener("change", handleChange);
      return () => media.removeEventListener("change", handleChange);
    } else {
      // Legacy browser fallback
      media.addListener(handleChange);
      return () => media.removeListener(handleChange);
    }
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const toggle = useCallback(() => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return { theme, setTheme, toggle };
}
