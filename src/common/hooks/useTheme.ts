import { err, ok, type Result } from "neverthrow";
import { useEffect, useState } from "react";
import z from "zod";

const ThemeSchema = z.enum(["dark", "light"]);
type Theme = z.infer<typeof ThemeSchema>;

function getPreferredTheme(): Result<Theme, Error> {
  const raw = localStorage.getItem("theme");
  if (!raw) {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    return ok(prefersDark ? "dark" : "light");
  }

  const result = ThemeSchema.safeParse(raw);
  return result.success ? ok(result.data) : err(new Error("Invalid theme"));
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const themeResult = getPreferredTheme();
    const newTheme = themeResult.isOk() ? themeResult.value : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return { theme, toggleTheme, isDark: theme === "dark" };
}
