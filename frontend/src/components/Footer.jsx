import { useTheme } from "@/context/ThemeContext";
import "@/css/components/Footer.css";

// Componente del Footer
const Footer = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <footer className="footer">
      <div className="container footer-container">
        <hr className="footer-divider" />
        <div className="footer-content">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} Negromate Creatives. Todos los
            derechos reservados.
          </p>
          {/* Sección de enlaces y controles */}
          <div className="footer-links">
            {/* Botón para cambiar entre tema claro y oscuro */}
            <button onClick={toggleTheme} className="theme-toggle-button">
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
