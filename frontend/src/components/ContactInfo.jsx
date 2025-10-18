import { Link } from 'react-router-dom';
import '@/css/components/ContactInfo.css';

/**
 * ContactInfo - Componente de sección de llamada a la acción (CTA) para contacto
 *
 * Este componente renderiza una sección de llamada a la acción que invita a los usuarios
 * a contactar con Negromate Creatives para discutir sus proyectos creativos. Funciona
 * como un punto de conversión en la landing page, guiando a los visitantes hacia la
 * página de contacto.
 *
 * Estructura del componente:
 * - Título persuasivo: "¿Tienes un proyecto en mente?"
 * - Texto descriptivo que motiva al usuario a hacer contacto
 * - Botón CTA que navega a la página de contacto
 *
 * Contenido mostrado:
 * - Pregunta directa al usuario sobre proyectos
 * - Mensaje de bienvenida y disposición a ayudar
 * - Botón "Hablemos" con estilo destacado
 *
 * Navegación:
 * - Utiliza React Router DOM (<Link>) para navegar a /contact
 * - Evita recargas de página manteniendo la experiencia SPA
 *
 * Propósito:
 * - CTA (Call To Action): Convierte visitantes en leads
 * - Posicionada estratégicamente en la landing page
 * - Diseño simple y directo para maximizar conversiones
 *
 * Estilos:
 * - Importa ContactInfo.css para estilos específicos
 * - Utiliza clase "button" para consistencia visual con otros CTAs
 *
 * @returns {JSX.Element} Sección CTA con título, descripción y botón de contacto
 */
const ContactInfo = () => {
    return (
        <section className="section contact-info-section">
            <div className="container">
                {/* Título principal de la sección CTA - pregunta directa al usuario */}
                <h2 className="contact-info-title">¿Tienes un proyecto en mente?</h2>

                {/* Texto persuasivo que invita al usuario a contactar */}
                <p className="contact-info-text">
                    Nos encantaría escucharlo. Ponte en contacto con nosotros y hagamos que tu idea cobre vida.
                </p>

                {/* Botón CTA que navega a la página de contacto */}
                <Link to="/contact" className="button">
                    Hablemos
                </Link>
            </div>
        </section>
    );
};

export default ContactInfo;
