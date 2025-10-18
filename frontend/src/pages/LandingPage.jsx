/**
 * LandingPage - Página principal de inicio de Negromate Creatives
 *
 * @description
 * Esta es la página de aterrizaje principal de la aplicación que muestra el contenido
 * promocional e informativo para los visitantes. Combina tres componentes principales
 * que conforman la experiencia inicial del usuario.
 *
 * @component
 * Estructura de la página:
 * - Hero: Banner principal con imagen destacada y call-to-action
 * - Products: Catálogo de productos/servicios disponibles
 * - ContactInfo: Información de contacto y ubicación
 *
 * @returns {JSX.Element} Página de inicio completa
 */

import Hero from '@/components/Hero';
import Products from '@/components/Products';
import ContactInfo from '@/components/ContactInfo';

const LandingPage = () => {
    return (
        <>
            {/* Hero: Sección principal con imagen y mensaje de bienvenida */}
            <Hero />

            {/* Products: Muestra el catálogo de productos disponibles */}
            <Products />

            {/* ContactInfo: Información de contacto y redes sociales */}
            <ContactInfo />
        </>
    );
};

export default LandingPage;
