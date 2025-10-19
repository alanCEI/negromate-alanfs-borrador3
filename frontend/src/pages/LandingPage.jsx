/**
 *
 * Página principal LandingPage de inicio de Negromate Creatives
 *
 */

import Hero from "@/components/Hero";
import Products from "@/components/Products";
import ContactInfo from "@/components/ContactInfo";

const LandingPage = () => {
  return (
    <>
      {/* Sección principal con imagen */}
      <Hero />
      {/* Muestra el catálogo de productos disponibles */}
      <Products />
      {/* Información de contacto y redes sociales */}
      <ContactInfo />
    </>
  );
};

export default LandingPage;
