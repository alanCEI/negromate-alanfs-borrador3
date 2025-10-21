/**
 * ============================================
 * Componente del Hero
 * ============================================
 */

import { useState, useEffect } from "react";
import "@/css/components/Hero.css";

const Hero = () => {
  const [scrolled, setScrolled] = useState(false);

  // Verificamos la posición del scroll
  useEffect(() => {
    const handleScroll = () => {
      // Si la posición del scroll es mayor a 50px
      const isScrolled = window.scrollY > 50;
      // Actualizamos si el estado cambio
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    document.addEventListener("scroll", handleScroll, { passive: true });
    // Se remueve cuando el componente se desmonta
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <section
      className="Hero h-screen relative w-full overflow-hidden flex items-center justify-center"
      style={{ backgroundImage: `url(/images/bghero-clear.webp)` }}
    >
      {/* Overlay oscuro semitransparente */}
      <div className="Hero-overlay absolute inset-0 opacity-50"></div>
      {/* Contenedor del logo del hero */}
      <div className={`Hero-logoContainer z-10 ${scrolled ? "is-scrolled" : ""}`}>
        <img
          src="/images/logoclear.webp"
          alt="Negromate Creatives Logo"
          className="Hero-logo w-64 h-64 object-contain rounded-full shadow-2xl"
        />
      </div>
    </section>
  );
};

export default Hero;
