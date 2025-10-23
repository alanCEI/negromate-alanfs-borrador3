/** -------------------------------------------------------------------
 * ============================================
 * Página de Murales "Murals"
 * ============================================
 */

import { useState, useEffect } from "react";
import { api } from "@/services/api";
import PriceCard from "@/components/PriceCard";
import "@/css/pages/Murals.css";
import "@/css/pages/GraphicDesign.css";

const Murals = () => {
  const [products, setProducts] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [modalImage, setModalImage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargamos productos y galería
  useEffect(() => {
    // Controlador para cancelar la petición
    const controller = new AbortController();
    // Fetch
    const fetchData = async () => {
      try {
        // Llamada a la API para obtener productos y galería
        const response = await api.products.getWithGallery("Murals", {
          signal: controller.signal,
        });
        // Actualizamos estado con los productos obtenidos
        setProducts(response.data.products);
        // Actualizamos estado con la galería obtenida
        setGallery(response.data.gallery);
      } catch (error) {
        // Captamos errores
        if (error.name !== "AbortError")
          console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, []);

  // Mensaje de carga mientras se obtienen los datos
  if (loading)
    return <div className="u-loadingMessage">Cargando murales...</div>;

  return (
    <>
      {/* Sección de galería */}
      <section className="u-section">
        <div className="u-container">
          <h2 className="u-sectionTitle">Galería de Murales</h2>
          {/* Grid de imágenes de galería */}
          <div className="MuralsGallery-grid">
            {gallery.map((item) => (
              // Cada item es clickeable con la imagen ampliada
              <div
                key={item.id}
                className="MuralsGalleryItem"
                onClick={() => setModalImage(item.imageUrl)}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="MuralsGalleryItem-image"
                />
                {/* Overlay con título que aparece con hover */}
                <div className="MuralsGalleryItem-overlay">
                  <h3 className="MuralsGalleryItem-title">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Sección de paquetes de precios */}
      <section className="u-section PriceCard-section">
        <div className="u-container">
          <h2 className="u-sectionTitle">Paquetes de Murales</h2>
          {/* Grid de tarjetas de productos */}
          <div className="PriceCards-grid">
            {products.map((p) => (
              <PriceCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      </section>
      {/* Vista ampliada de la imagen */}
      {modalImage && (
        <div className="Modal-overlay" onClick={() => setModalImage(null)}>
          <img src={modalImage} alt="Vista ampliada" className="Modal-image" />
        </div>
      )}
    </>
  );
};

export default Murals;
