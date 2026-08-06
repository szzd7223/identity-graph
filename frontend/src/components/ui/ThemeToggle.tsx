"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="btn-ghost"
      title="Toggle theme"
      aria-label="Toggle light/dark mode"
      style={{ fontSize: "1rem", padding: "6px 8px" }}
    >
      {theme === "dark" ? "☀" : "☾"}
    </button>
  );
}
