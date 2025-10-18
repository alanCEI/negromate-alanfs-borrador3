/**
 * App.jsx - Componente Principal de la Aplicación
 *
 * Este archivo define el componente raíz de la aplicación Negromate Creatives.
 * Configura el sistema de rutas (routing) de React Router y establece la estructura
 * base del layout con Header, Footer y el área de contenido principal.
 *
 * Estructura de Rutas:
 * - Rutas Públicas: Accesibles por cualquier usuario (autenticado o no)
 * - Rutas Protegidas: Requieren autenticación, redirigen a login si no están autenticados
 * - Rutas para Invitados: Solo accesibles sin autenticación, redirigen al home si ya están autenticados
 *
 * @module App
 */

import { Routes, Route } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LandingPage from '@/pages/LandingPage';
import AboutUs from '@/pages/AboutUs';
import Contact from '@/pages/Contact';
import Profile from '@/pages/Profile';
import GraphicDesign from '@/pages/GraphicDesign';
import CustomClothing from '@/pages/CustomClothing';
import Murals from '@/pages/Murals';
import ShoppingCart from '@/pages/ShoppingCart';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';
import './css/App.css';

/**
 * Componente principal de la aplicación
 *
 * Define la estructura de navegación completa de la aplicación utilizando React Router.
 * Implementa tres tipos de rutas:
 *
 * 1. Rutas Públicas (sin wrapper de protección):
 *    - "/" - Página de inicio (LandingPage)
 *    - "/about" - Página Sobre Nosotros
 *    - "/contact" - Página de Contacto
 *    - "/graphic-design" - Catálogo de Diseño Gráfico
 *    - "/custom-clothing" - Catálogo de Ropa Personalizada
 *    - "/murals" - Catálogo de Murales
 *
 * 2. Rutas para Invitados (wrapper GuestRoute):
 *    - "/profile" - Perfil de usuario (redirige a "/" si ya está autenticado)
 *    - Estas rutas solo son accesibles para usuarios NO autenticados
 *    - GuestRoute valida el estado de autenticación y redirige según corresponda
 *
 * 3. Rutas Protegidas (wrapper ProtectedRoute):
 *    - "/cart" - Carrito de Compras
 *    - Requieren que el usuario esté autenticado
 *    - ProtectedRoute valida el token JWT y redirige a login si es necesario
 *
 * @returns {JSX.Element} Estructura completa de la aplicación con Header, rutas y Footer
 */
function App() {
  return (
    <div className="app-container">
      {/* Header: Barra de navegación superior, visible en todas las páginas */}
      <Header />

      {/* Main Content: Área principal donde se renderizan las páginas según la ruta */}
      <main className="main-content">
        <Routes>
          {/* ===== RUTAS PÚBLICAS ===== */}
          {/* Accesibles por cualquier usuario, autenticado o no */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/graphic-design" element={<GraphicDesign />} />
          <Route path="/custom-clothing" element={<CustomClothing />} />
          <Route path="/murals" element={<Murals />} />

          {/* ===== RUTAS PARA INVITADOS (Solo usuarios NO autenticados) ===== */}
          {/* GuestRoute redirige a "/" si el usuario ya está autenticado */}
          <Route element={<GuestRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* ===== RUTAS PROTEGIDAS (Solo usuarios autenticados) ===== */}
          {/* ProtectedRoute valida el token JWT y redirige a login si no existe */}
          <Route element={<ProtectedRoute />}>
             <Route path="/cart" element={<ShoppingCart />} />
          </Route>
        </Routes>
      </main>

      {/* Footer: Pie de página, visible en todas las páginas */}
      <Footer />
    </div>
  );
}

export default App;