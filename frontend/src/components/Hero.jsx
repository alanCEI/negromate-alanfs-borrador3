import { useState, useEffect } from 'react';
import '@/css/components/Hero.css';

/**
 * Hero - Componente de sección hero/banner principal de la página de inicio
 *
 * Este componente renderiza la sección hero de la landing page con un fondo de imagen,
 * un overlay oscuro para mejorar la legibilidad, y el logo de Negromate Creatives.
 * Incluye un efecto interactivo que detecta el scroll del usuario para aplicar
 * animaciones o estilos al logo cuando se hace scroll.
 *
 * Estructura del componente:
 * - Sección hero con imagen de fondo (bghero-clear.webp)
 * - Overlay oscuro semitransparente para contraste
 * - Contenedor del logo que cambia de estilo al hacer scroll
 * - Logo de Negromate Creatives centrado
 *
 * Estados:
 * - scrolled: Booleano que indica si el usuario ha hecho scroll más de 50px
 *
 * Efectos:
 * - useEffect: Agrega un event listener para detectar scroll y actualizar el estado
 *   - Se activa cuando scrollY > 50px
 *   - Usa { passive: true } para mejorar el rendimiento del scroll
 *   - Se limpia al desmontar el componente (cleanup function)
 *
 * Estilos dinámicos:
 * - La clase 'scrolled' se agrega al logo-container cuando se hace scroll,
 *   permitiendo aplicar animaciones CSS definidas en Hero.css
 *
 * @returns {JSX.Element} Sección hero con fondo de imagen y logo animado
 */
const Hero = () => {
    // Estado para rastrear si el usuario ha hecho scroll más de 50px
    const [scrolled, setScrolled] = useState(false);

    // Efecto para detectar el evento de scroll y actualizar el estado
    useEffect(() => {
        /**
         * handleScroll - Función que verifica la posición del scroll
         * Actualiza el estado 'scrolled' cuando el scroll supera los 50px
         */
        const handleScroll = () => {
            // Verifica si la posición vertical del scroll es mayor a 50px
            const isScrolled = window.scrollY > 50;
            // Solo actualiza el estado si el valor cambió (evita re-renders innecesarios)
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        // Agrega el event listener al documento con la opción passive para mejor rendimiento
        // passive: true indica que el listener no llamará preventDefault()
        document.addEventListener('scroll', handleScroll, { passive: true });

        // Función de limpieza: remueve el event listener cuando el componente se desmonta
        return () => {
            document.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled]); // Se ejecuta cuando 'scrolled' cambia

    return (
        <section
            className="hero-section"
            style={{ backgroundImage: `url(/images/bghero-clear.webp)` }}
        >
            {/* Overlay oscuro semitransparente para mejorar el contraste con el logo */}
            <div className="hero-overlay"></div>

            {/* Contenedor del logo que recibe la clase 'scrolled' dinámicamente */}
            <div className={`hero-logo-container ${scrolled ? 'scrolled' : ''}`}>
                <img
                    src='/images/logoclear.webp'
                    alt="Negromate Creatives Logo"
                    className="hero-logo"
                />
            </div>
        </section>
    );
};

export default Hero;
