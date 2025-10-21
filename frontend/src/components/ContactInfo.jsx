/**
 * ============================================
 * Componente de sección para contacto
 * ============================================
 */

import { Link } from "react-router-dom";
import "@/css/components/ContactInfo.css";

const ContactInfo = () => {
  return (
    <section className="u-section ContactInfo">
      <div className="u-container">
        {/* Título principal */}
        <h2 className="ContactInfo-title">¿Tienes un proyecto en mente?</h2>
        {/* Texto que invita al usuario a contactar */}
        <p className="ContactInfo-text">
          Nos encantaría escucharlo. Ponte en contacto con nosotros y hagamos
          que tu idea cobre vida.
        </p>
        {/* Botón para la página de contacto */}
        <Link to="/contact" className="Button">
          Hablemos
        </Link>
      </div>
    </section>
  );
};

export default ContactInfo;
