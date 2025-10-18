/**
 * main.jsx - Punto de Entrada de la Aplicación React
 *
 * Este archivo es el punto de entrada principal de la aplicación frontend.
 * Se encarga de:
 * 1. Inicializar React y montar la aplicación en el DOM
 * 2. Configurar el enrutador de navegación (BrowserRouter)
 * 3. Establecer el orden jerárquico de los Context Providers
 * 4. Importar los estilos globales de la aplicación
 *
 * Jerarquía de Providers (de externo a interno):
 * - StrictMode: Modo estricto de React para detectar problemas potenciales
 * - BrowserRouter: Habilita el sistema de rutas de React Router
 * - ThemeProvider: Gestiona el tema visual (claro/oscuro)
 * - AuthProvider: Gestiona el estado de autenticación del usuario
 * - CartProvider: Gestiona el estado del carrito de compras
 *
 * El orden de anidación es importante ya que los providers internos
 * pueden acceder a los contextos de los providers externos.
 *
 * @module main
 */

import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

// ===== ESTILOS GLOBALES =====
// Importados en orden: reset -> base -> responsive
import './css/reset.css';      // Reseteo de estilos del navegador para consistencia cross-browser
import './css/index.css';      // Estilos base de la aplicación (variables CSS, tipografía, etc.)
import './css/queries.css';    // Media queries para diseño responsive

// ===== PROVEEDORES DE CONTEXTO =====
// Importación de Context Providers para estado global de la aplicación
import { AuthProvider } from './context/AuthContext.jsx';    // Gestión de autenticación y sesión
import { ThemeProvider } from './context/ThemeContext.jsx';  // Gestión de tema visual (light/dark)
import { CartProvider } from './context/CartContext.jsx';    // Gestión del carrito de compras

/**
 * Inicialización y renderizado de la aplicación React
 *
 * Proceso de inicialización:
 * 1. ReactDOM.createRoot() crea la raíz de React en el elemento DOM con id="root"
 * 2. Se envuelve la aplicación en múltiples capas de providers y configuraciones
 * 3. Cada provider proporciona funcionalidad específica a toda la aplicación
 *
 * Estructura de anidación (orden de ejecución de afuera hacia adentro):
 * - StrictMode: Activa verificaciones y advertencias adicionales en desarrollo
 * - BrowserRouter: Proporciona capacidades de navegación y gestión de rutas
 * - ThemeProvider: Contexto para el tema, debe estar antes que Auth y Cart para que estos puedan usar el tema
 * - AuthProvider: Contexto de autenticación, proporciona userInfo y token a toda la app
 * - CartProvider: Contexto del carrito, puede acceder a AuthContext para asociar el carrito al usuario
 * - App: Componente raíz que contiene todas las rutas y páginas
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* BrowserRouter: Habilita navegación basada en el historial del navegador */}
    <BrowserRouter>
      {/* ThemeProvider: Proporciona el estado del tema (claro/oscuro) a toda la aplicación */}
      <ThemeProvider>
        {/* AuthProvider: Proporciona el estado de autenticación (usuario, token, login, logout) */}
        <AuthProvider>
          {/* CartProvider: Proporciona el estado y funciones del carrito (items, agregar, eliminar, limpiar) */}
          <CartProvider>
            {/* App: Componente principal que contiene el sistema de rutas y layout */}
            <App />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)