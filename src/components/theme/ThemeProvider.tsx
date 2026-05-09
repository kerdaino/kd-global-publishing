"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

type ThemePreference = "light" | "dark";
type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
};

const storageKey = "kd-global-theme";
const themeChangeEvent = "kd-global-theme-change";
const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveTheme(preference: ThemePreference): ResolvedTheme {
  return preference;
}

function applyTheme(preference: ThemePreference, resolvedTheme: ResolvedTheme) {
  const root = document.documentElement;

  root.classList.remove("light", "dark");
  root.classList.add(resolvedTheme);
  root.dataset.theme = resolvedTheme;
  root.dataset.themePreference = preference;
  root.style.colorScheme = resolvedTheme;
}

function readStoredPreference(): ThemePreference {
  if (typeof window === "undefined") {
    return "light";
  }

  const stored = localStorage.getItem(storageKey);

  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return "light";
}

function getThemeSnapshot() {
  const preference = readStoredPreference();
  const resolvedTheme = resolveTheme(preference);

  return `${preference}:${resolvedTheme}`;
}

function getServerThemeSnapshot() {
  return "light:light";
}

function subscribeToThemeChanges(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(themeChangeEvent, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(themeChangeEvent, onStoreChange);
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const snapshot = useSyncExternalStore(
    subscribeToThemeChanges,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );
  const [preference, resolvedTheme] = snapshot.split(":") as [
    ThemePreference,
    ResolvedTheme,
  ];

  const setPreference = useCallback((nextPreference: ThemePreference) => {
    const nextResolvedTheme = resolveTheme(nextPreference);

    localStorage.setItem(storageKey, nextPreference);
    applyTheme(nextPreference, nextResolvedTheme);
    window.dispatchEvent(new Event(themeChangeEvent));
  }, []);

  useEffect(() => {
    applyTheme(preference, resolvedTheme);
  }, [preference, resolvedTheme]);

  const value = useMemo(
    () => ({ preference, resolvedTheme, setPreference }),
    [preference, resolvedTheme, setPreference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);

  if (!value) {
    throw new Error("useTheme must be used within ThemeProvider.");
  }

  return value;
}
