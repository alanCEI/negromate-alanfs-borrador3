/**
 * ============================================
 * Componente del Header
 * ============================================
 */

import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import "@/css/components/Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  // CSS del NavLink si está activo o no
  const navLinkClass = ({ isActive }) => `NavLink ${isActive ? "NavLink--active" : ""}`;
  // Cierra el menú cuando se hace clic
  const handleMenuClick = () => setIsMenuOpen(false);
  // Cierre de sesión del usuario
  const handleLogoutClick = () => {
    logout();
    setIsMenuOpen(false);
  };

/**
 * ============================================
 * NavLinks
 * ============================================
 */
  const NavLinks = () => (
    <>
      <NavLink to="/about" className={navLinkClass} onClick={handleMenuClick}>
        Sobre Nosotros
      </NavLink>
      <NavLink to="/contact" className={navLinkClass} onClick={handleMenuClick}>
        Contacto
      </NavLink>
      {/* Si esta está autenticado, muestra botón de cerrar sesión, si no muestra perfil/login */}
      {user ? (
        <button onClick={handleLogoutClick} className="LogoutButton">
          Cerrar Sesión
        </button>
      ) : (
        <NavLink
          to="/profile"
          className={navLinkClass}
          onClick={handleMenuClick}
        >
          Perfil
        </NavLink>
      )}
    </>
  );

  return (
    <header className="Header">
      <div className="u-container Header-content">
        {/* Logo que redirige al inicio */}
        <Link
          to="/"
          className="Header-logo"
          onClick={() => setIsMenuOpen(false)}
        >
          <img
            src="/images/isotipo-header.webp"
            alt="Negromate Creatives Logo"
          />
        </Link>
        {/* Nav desktop */}
        <nav className="Header-desktopNav">
          <NavLinks />
          <NavLink to="/cart" className="CartLink">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="CartLink-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {/* Contador solo si hay items en el carrito de compras */}
            {cartCount > 0 && <span className="CartLink-count">{cartCount}</span>}
          </NavLink>
        </nav>
        {/* Nav móvil */}
        <div className="Header-mobileMenuContainer">
          {/* Icono de carrito de compras*/}
          <NavLink
            to="/cart"
            className="CartLink"
            style={{ marginRight: "0.5rem" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="CartLink-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {cartCount > 0 && (
              <span className="CartLink-countMobile">{cartCount}</span>
            )}
          </NavLink>
          {/* Botón hamburguesa menu */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="MobileMenuButton"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="MobileMenuButton-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>
      {/* Menú desplegable */}
      {isMenuOpen && (
        <nav className="MobileNav">
          <NavLinks />
        </nav>
      )}
    </header>
  );
};

export default Header;
