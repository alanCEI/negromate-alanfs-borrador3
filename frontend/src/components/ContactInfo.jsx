/**
 * ============================================
 * Componente de sección para contacto
 * ============================================
 */

import { Link } from "react-router-dom";
import "@/css/components/ContactInfo.css";

const ContactInfo = () => {
  return (
    <section className="section contact-info-section">
      <div className="container">
        {/* Título principal */}
        <h2 className="contact-info-title">¿Tienes un proyecto en mente?</h2>
        {/* Texto que invita al usuario a contactar */}
        <p className="contact-info-text">
          Nos encantaría escucharlo. Ponte en contacto con nosotros y hagamos
          que tu idea cobre vida.
        </p>
        {/* Botón para la página de contacto */}
        <Link to="/contact" className="button">
          Hablemos
        </Link>
      </div>
    </section>
  );
};

export default ContactInfo;
