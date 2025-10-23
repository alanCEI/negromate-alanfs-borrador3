/** -------------------------------------------------------------------
 * ============================================
 * Página AboutUs "Sobre Nosotros"
 * ============================================
 */

import { useState, useEffect } from "react";
import { api } from "@/services/api";
import "@/css/pages/AboutUs.css";

const AboutUs = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Obtenemos contenido para AboutUs 
  useEffect(() => {
    // Controlador para cancelar la petición
    const controller = new AbortController();
    // Fetch
    const fetchContent = async () => {
      try {
        // Petición a la API
        const response = await api.content.get("aboutUs", {
          signal: controller.signal,
        });
        setContent(response.data);
      } catch (err) {
        // Captamos errores
        if (err.name !== "AbortError") {
          setError("No se pudo cargar el contenido. Inténtalo más tarde.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchContent();

    return () => controller.abort();
  }, []);

  // Mostrar mensaje de carga mientras se obtienen los datos
  if (loading) return <div className="u-loadingMessage">Cargando...</div>;
  // Mostrar mensaje de error si la petición falla
  if (error) return <div className="u-errorMessage">{error}</div>;
  // Mostrar mensaje si no hay contenido disponible
  if (!content)
    return <div className="u-loadingMessage">No hay contenido disponible.</div>;

  return (
    <section className="u-section">
      <div className="u-container">
        {/* Título obtenido desde la API */}
        <h1 className="u-sectionTitle">{content.title}</h1>
        {/* Párrafo principal */}
        <p
          className="AboutUs-mainParagraph"
          dangerouslySetInnerHTML={{ __html: content.mainParagraph }}
        ></p>
        <div className="AboutUs-content">
          {/* Imagen de los artistas y enlaces a Instagram */}
          <figure className="Artist-figure">
            <img
              src={content.artists.imageUrl}
              alt={content.artists.title}
              className="Artist-image"
            />
            <figcaption className="Artist-figcaption">
              {/* Enlaces a perfiles de Instagram */}
              <a
                href={content.artists.instagram.adriana}
                target="_blank"
                rel="noopener noreferrer"
              >
                @adriluzzatto
              </a>
              <a
                href={content.artists.instagram.yoel}
                target="_blank"
                rel="noopener noreferrer"
              >
                @soyyowyow
              </a>
            </figcaption>
          </figure>
          {/* Información sobre los artistas */}
          <div className="Artist-info">
            <h2 className="Artist-infoTitle">{content.artists.title}</h2>
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
