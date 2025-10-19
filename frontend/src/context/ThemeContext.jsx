/**
 * ============================================================
 * Contexto para gestionar el tema de la app (claro/oscuro).
 * ============================================================
 */

import React, { createContext, useState, useEffect, useContext } from "react";

// Crea el contexto del tema
const ThemeContext = createContext();

// Componente del contexto de tema
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    const body = window.document.body;
    // Solo una clase de tema activa a la vez
    body.classList.remove("light-theme", "dark-theme");
    // Añade la clase correspondiente
    body.classList.add(`${theme}-theme`);
    // Guarda la preferencia en localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Alternar entre tema claro y oscuro
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
