"use client";
import { useEffect } from "react";
import usePersistentState from "./usePersistentState";

export const useTheme = () => {
  const [theme, setTheme] = usePersistentState("theme", "light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return { theme, toggleTheme };
};