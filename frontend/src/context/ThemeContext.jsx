/**
 * ThemeContext.jsx
 *
 * Contexto de React para gestionar el tema visual de la aplicación (claro/oscuro).
 *
 * Propósito:
 * - Controlar el tema visual de toda la aplicación (light/dark)
 * - Persistir la preferencia del usuario en localStorage
 * - Aplicar dinámicamente las clases CSS al body según el tema activo
 * - Permitir el cambio de tema desde cualquier componente
 *
 * Valores expuestos:
 * - theme: String con el tema actual ('light' o 'dark')
 * - toggleTheme: Función para alternar entre tema claro y oscuro
 *
 * Funcionamiento:
 * - Al cambiar el tema, se agregan clases CSS al <body>: 'light-theme' o 'dark-theme'
 * - Los estilos CSS de la aplicación deben estar definidos para estas clases
 * - La preferencia se guarda automáticamente en localStorage
 */

import React, { createContext, useState, useEffect, useContext } from 'react';

// Crea el contexto del tema
const ThemeContext = createContext();

/**
 * ThemeProvider - Componente proveedor del contexto de tema
 *
 * Envuelve la aplicación para proporcionar el tema actual y funciones
 * para cambiar entre tema claro y oscuro.
 *
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos que tendrán acceso al contexto
 */
export const ThemeProvider = ({ children }) => {
    /**
     * Estado del tema actual
     * Inicializa desde localStorage si existe, de lo contrario usa 'light' como valor por defecto
     */
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

    /**
     * Efecto que sincroniza el tema con el DOM y localStorage
     * Se ejecuta cada vez que el estado 'theme' cambia
     */
    useEffect(() => {
        const body = window.document.body;

        // Limpia las clases de tema anteriores para evitar conflictos
        // Esto asegura que solo una clase de tema esté activa a la vez
        body.classList.remove('light-theme', 'dark-theme');

        // Añade la clase correspondiente al tema actual
        // Por ejemplo: 'light-theme' o 'dark-theme'
        body.classList.add(`${theme}-theme`);

        // Guarda la preferencia del usuario en localStorage
        // Esto permite que el tema persista entre sesiones
        localStorage.setItem('theme', theme);
    }, [theme]); // Este efecto se ejecuta cada vez que el estado 'theme' cambia

    /**
     * Función para alternar entre tema claro y oscuro
     *
     * Cambia de 'light' a 'dark' o viceversa.
     * El cambio se refleja automáticamente en el DOM y localStorage gracias al useEffect.
     */
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

/**
 * Hook personalizado para acceder al contexto del tema
 *
 * Simplifica el acceso al ThemeContext desde cualquier componente.
 *
 * @returns {Object} Objeto con { theme, toggleTheme }
 *
 * Ejemplo de uso:
 * const { theme, toggleTheme } = useTheme();
 * <button onClick={toggleTheme}>Cambiar tema</button>
 */
export const useTheme = () => useContext(ThemeContext);
