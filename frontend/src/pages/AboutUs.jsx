/**
 * AboutUs - Página "Sobre Nosotros" de Negromate Creatives
 *
 * @description
 * Página que muestra información dinámica sobre la empresa y los artistas.
 * El contenido se carga desde la API del backend, permitiendo actualizaciones
 * sin modificar el código. Incluye información sobre los fundadores, su historia
 * y enlaces a sus perfiles de Instagram.
 *
 * @component
 * Características principales:
 * - Carga dinámica de contenido desde el backend
 * - Manejo de estados de carga y errores
 * - Cancelación de peticiones al desmontar el componente
 * - Renderizado HTML seguro para contenido enriquecido
 * - Enlaces a redes sociales de los artistas
 *
 * @returns {JSX.Element} Página "Sobre Nosotros" completa
 */

import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import '@/css/pages/AboutUs.css';

const AboutUs = () => {
    // Estado para almacenar el contenido dinámico obtenido de la API
    const [content, setContent] = useState(null);

    // Estado de carga para mostrar mensaje mientras se obtienen los datos
    const [loading, setLoading] = useState(true);

    // Estado para manejar errores en la petición a la API
    const [error, setError] = useState('');

    /**
     * useEffect - Obtiene el contenido de "Sobre Nosotros" al montar el componente
     *
     * Implementa:
     * - AbortController para cancelar la petición si el componente se desmonta
     * - Manejo de errores con distinción entre AbortError y otros errores
     * - Actualización del estado de carga en el bloque finally
     */
    useEffect(() => {
        // Controlador para cancelar la petición si el componente se desmonta
        const controller = new AbortController();

        /**
         * fetchContent - Función asíncrona para obtener el contenido desde la API
         *
         * Realiza una petición GET a /api/content/aboutUs y actualiza el estado
         * con la respuesta. Si hay un error (excepto AbortError), muestra un mensaje.
         */
        const fetchContent = async () => {
            try {
                // Petición a la API para obtener el contenido de "aboutUs"
                const response = await api.content.get('aboutUs', { signal: controller.signal });
                setContent(response.data);
            } catch (err) {
                // Ignorar errores de cancelación (cuando el componente se desmonta)
                if (err.name !== 'AbortError') {
                    setError('No se pudo cargar el contenido. Inténtalo más tarde.');
                }
            } finally {
                // Finalizar estado de carga independientemente del resultado
                setLoading(false);
            }
        };

        fetchContent();

        // Cleanup: cancelar la petición si el componente se desmonta antes de completarse
        return () => controller.abort();
    }, []);

    // Renderizado condicional: mostrar mensaje de carga mientras se obtienen los datos
    if (loading) return <div className="loading-message">Cargando...</div>;

    // Renderizado condicional: mostrar mensaje de error si la petición falla
    if (error) return <div className="error-message">{error}</div>;

    // Renderizado condicional: mostrar mensaje si no hay contenido disponible
    if (!content) return <div className="loading-message">No hay contenido disponible.</div>;

    return (
        <section className="section">
            <div className="container">
                {/* Título principal de la página obtenido desde la API */}
                <h1 className="section-title">{content.title}</h1>

                {/* Párrafo principal con HTML renderizado de forma segura */}
                <p
                    className="about-us-main-paragraph"
                    dangerouslySetInnerHTML={{ __html: content.mainParagraph }}
                ></p>

                <div className="about-us-content">
                    {/* Figura con imagen de los artistas y enlaces a Instagram */}
                    <figure className="artist-figure">
                        <img src={content.artists.imageUrl} alt={content.artists.title} className="artist-image" />
                        <figcaption className="artist-figcaption">
                            {/* Enlaces a perfiles de Instagram con target="_blank" para nueva pestaña */}
                            <a href={content.artists.instagram.adriana} target="_blank" rel="noopener noreferrer">@adriluzzatto</a>
                            <a href={content.artists.instagram.yoel} target="_blank" rel="noopener noreferrer">@soyyowyow</a>
                        </figcaption>
                    </figure>

                    {/* Información detallada sobre los artistas */}
                    <div className="artist-info">
                         <h2 className="artist-info-title">{content.artists.title}</h2>
                         {/* Mapeo de párrafos con renderizado HTML dinámico */}
                        {content.artists.paragraphs.map((p, index) => (
                            <p key={index} dangerouslySetInnerHTML={{ __html: p }}></p>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
