import { useTheme } from '@/context/ThemeContext';
import '@/css/components/Footer.css';

/**
 * Footer - Componente de pie de página de la aplicación
 *
 * Proporciona información de copyright, enlaces a redes sociales y control del tema visual.
 * Se renderiza en todas las páginas de la aplicación.
 *
 * Características:
 * - Muestra copyright dinámico con el año actual
 * - Botón para alternar entre tema claro y oscuro
 * - Enlaces a redes sociales (Instagram y Behance)
 * - Los enlaces externos se abren en nueva pestaña con seguridad (noopener noreferrer)
 *
 * @component
 */
const Footer = () => {
    // Obtiene el tema actual y la función para alternarlo desde ThemeContext
    const { theme, toggleTheme } = useTheme();

    return (
        <footer className="footer">
            <div className="container footer-container">
                {/* Línea divisoria superior */}
                <hr className="footer-divider" />
                <div className="footer-content">
                    {/* Copyright con año dinámico - se actualiza automáticamente cada año */}
                    <p className="footer-copyright">&copy; {new Date().getFullYear()} Negromate Creatives. Todos los derechos reservados.</p>

                    {/* Sección de enlaces y controles */}
                    <div className="footer-links">
                        {/* Botón para cambiar entre tema claro y oscuro
                            El texto del botón muestra el tema hacia el que se cambiará */}
                        <button
                            onClick={toggleTheme}
                            className="theme-toggle-button"
                        >
                            Modo {theme === 'light' ? 'Oscuro' : 'Claro'}
                        </button>

                        {/* Enlaces a redes sociales - se abren en nueva pestaña
                            rel="noopener noreferrer" previene vulnerabilidades de seguridad */}
                         <a href="https://www.instagram.com/negromatecreatives/" target="_blank" rel="noopener noreferrer">
                           Instagram
                        </a>
                         <a href="https://www.behance.net/soyyowyow/" target="_blank" rel="noopener noreferrer">
                            Behance
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
