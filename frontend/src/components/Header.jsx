import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import '@/css/components/Header.css';

/**
 * Header - Componente de cabecera principal de la aplicación
 *
 * Proporciona navegación global, acceso al carrito de compras y gestión de sesión.
 * Incluye navegación responsive con menú hamburguesa para dispositivos móviles.
 *
 * Características:
 * - Logo clicable que redirige al home
 * - Menú de navegación con enlaces a Sobre Nosotros, Contacto y Perfil
 * - Indicador visual del carrito con contador de items
 * - Botón de cerrar sesión cuando el usuario está autenticado
 * - Menú móvil responsive que se despliega/colapsa
 *
 * @component
 */
const Header = () => {
    // Estado para controlar la apertura/cierre del menú móvil
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Obtiene información del usuario autenticado y función de logout desde AuthContext
    const { user, logout } = useAuth();

    // Obtiene el contador de items en el carrito desde CartContext
    const { cartCount } = useCart();

    /**
     * Función que determina las clases CSS del NavLink según si está activo
     * @param {boolean} isActive - Indica si el link corresponde a la ruta actual
     * @returns {string} Clases CSS para aplicar al enlace
     */
    const navLinkClass = ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`;

    /**
     * Cierra el menú móvil cuando se hace clic en un enlace de navegación
     */
    const handleMenuClick = () => setIsMenuOpen(false);

    /**
     * Maneja el cierre de sesión del usuario
     * - Ejecuta la función logout del AuthContext
     * - Cierra el menú móvil si estaba abierto
     */
    const handleLogoutClick = () => {
        logout();
        setIsMenuOpen(false);
    };

    /**
     * NavLinks - Componente interno que renderiza los enlaces de navegación
     * Se reutiliza tanto en el menú desktop como en el menú móvil
     * Muestra diferentes opciones según el estado de autenticación del usuario
     */
    const NavLinks = () => (
        <>
            <NavLink to="/about" className={navLinkClass} onClick={handleMenuClick}>Sobre Nosotros</NavLink>
            <NavLink to="/contact" className={navLinkClass} onClick={handleMenuClick}>Contacto</NavLink>
            {/* Si el usuario está autenticado, muestra botón de Cerrar Sesión,
                si no lo está, muestra enlace a Perfil (que redirige a login) */}
            {user ? (
                <button onClick={handleLogoutClick} className="logout-button">Cerrar Sesión</button>
            ) : (
                <NavLink to="/profile" className={navLinkClass} onClick={handleMenuClick}>Perfil</NavLink>
            )}
        </>
    );

    return (
        <header className="header">
            <div className="container header-content">
                {/* Logo que redirige al home y cierra el menú móvil si está abierto */}
                <Link to="/" className="header-logo" onClick={() => setIsMenuOpen(false)}>
                    <img src="/images/isotipo-header.webp" alt="Negromate Creatives Logo" />
                </Link>

                {/* Navegación para pantallas desktop */}
                <nav className="desktop-nav">
                    <NavLinks />
                    {/* Enlace al carrito con icono SVG y contador de items */}
                    <NavLink to="/cart" className="cart-link">
                        <svg xmlns="http://www.w3.org/2000/svg" className="cart-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        {/* Muestra el contador solo si hay items en el carrito */}
                        {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                    </NavLink>
                </nav>

                {/* Controles para navegación móvil (icono de carrito y botón hamburguesa) */}
                <div className="mobile-menu-container">
                     {/* Icono de carrito para móvil */}
                     <NavLink to="/cart" className="cart-link" style={{marginRight: '0.5rem'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="cart-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        {cartCount > 0 && <span className="cart-count-mobile">{cartCount}</span>}
                    </NavLink>
                    {/* Botón hamburguesa que alterna el estado del menú móvil */}
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="mobile-menu-button">
                        <svg xmlns="http://www.w3.org/2000/svg" className="menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                    </button>
                </div>
            </div>

            {/* Menú móvil desplegable - se muestra solo cuando isMenuOpen es true */}
            {isMenuOpen && (
                <nav className="mobile-nav">
                    <NavLinks />
                </nav>
            )}
        </header>
    );
};
export default Header;
