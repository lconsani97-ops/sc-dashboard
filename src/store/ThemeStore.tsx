"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeState | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Determine initial state from localStorage or system preference
    const storedPref = localStorage.getItem("sc_theme_dark");
    let initialPref = false;

    if (storedPref !== null) {
      initialPref = storedPref === "true";
    } else {
      initialPref = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    setIsDarkMode(initialPref);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Apply or remove dark class from the root HTML element
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    // Save preference
    localStorage.setItem("sc_theme_dark", String(isDarkMode));
  }, [isDarkMode, mounted]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <div className="invisible">{children}</div>; // Or a very minimal skeleton
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
