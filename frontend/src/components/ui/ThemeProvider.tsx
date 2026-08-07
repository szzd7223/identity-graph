"use client";

import { useEffect, useState } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"dark" | "light">("light");

  useEffect(() => {
    // Read from localStorage or fall back to light
    const stored = localStorage.getItem("ig-theme") as "dark" | "light" | null;
    if (stored) {
      setTheme(stored);
    } else {
      setTheme("light");
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("ig-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

import { createContext, useContext } from "react";

interface ThemeContextValue {
  theme: "dark" | "light";
  setTheme: (t: "dark" | "light") => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}
