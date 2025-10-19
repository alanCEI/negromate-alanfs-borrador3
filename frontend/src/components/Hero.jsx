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
      className="hero-section"
      style={{ backgroundImage: `url(/images/bghero-clear.webp)` }}
    >
      {/* Overlay oscuro semitransparente */}
      <div className="hero-overlay"></div>
      {/* Contenedor del logo del hero */}
      <div className={`hero-logo-container ${scrolled ? "scrolled" : ""}`}>
        <img
          src="/images/logoclear.webp"
          alt="Negromate Creatives Logo"
          className="hero-logo"
        />
      </div>
    </section>
  );
};

export default Hero;
