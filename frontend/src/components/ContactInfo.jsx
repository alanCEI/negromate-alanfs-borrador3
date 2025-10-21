/**
 * ============================================
 * Componente de sección para contacto
 * ============================================
 */

import { Link } from "react-router-dom";
import "@/css/components/ContactInfo.css";

const ContactInfo = () => {
  return (
    <section className="section ContactInfo">
      <div className="container">
        {/* Título principal */}
        <h2 className="text-4xl font-bold mb-4">¿Tienes un proyecto en mente?</h2>
        {/* Texto que invita al usuario a contactar */}
        <p className="text-xl mb-8 max-w-2xl mx-auto">
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
