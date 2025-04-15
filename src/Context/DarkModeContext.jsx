// src/Context/DarkModeContext.js
import { createContext, useContext, useEffect, useState } from "react";

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const darkTheme = "dark";
    const lightTheme = "light";

    if (storedTheme === darkTheme) {
      setIsDarkMode(true);
      document.documentElement.classList.add(darkTheme);
    } else if (storedTheme === lightTheme) {
      setIsDarkMode(false);
      document.documentElement.classList.remove(darkTheme);
    } else {
      // Si aucun thème n'est stocké, on vérifie le thème système
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(prefersDark);
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      document.documentElement.classList.toggle("dark", newMode);
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => useContext(DarkModeContext);
