/**
 * ============================================
 * Componente del Footer
 * ============================================
 */

import { useTheme } from "@/context/ThemeContext";
import "@/css/components/Footer.css";

const Footer = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <footer className="Footer bg-dark text-sub py-6 mt-auto">
      <div className="container">
        <hr className="Footer-divider" />
        <div className="Footer-content">
          <p className="text-sm text-center">
            &copy; {new Date().getFullYear()} Negromate Creatives. Todos los
            derechos reservados.
          </p>
          {/* Sección de enlaces y controles */}
          <div className="Footer-links">
            {/* Botón para cambiar entre tema claro y oscuro */}
            <button onClick={toggleTheme} className="Footer-themeToggleButton rounded-lg py-2 px-4 text-sm transition-colors">
              Modo {theme === "light" ? "Oscuro" : "Claro"}
            </button>
            {/* Enlaces a redes sociales */}
            <a
              href="https://www.instagram.com/negromatecreatives/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            <a
              href="https://www.behance.net/soyyowyow/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Behance
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
