/** -------------------------------------------------------------------
 * ==============================================
 * Página de Ropa Personalizada "CustomClothing"
 * ==============================================
 */

import { useState, useEffect } from "react";
import { api } from "@/services/api";
import PriceCard from "@/components/PriceCard";
import "@/css/pages/CustomClothing.css";
import "@/css/pages/GraphicDesign.css";

/** -------------------------------------------------------------------
 * ============================================
 * Componente principal "CustomClothing"
 * ============================================
 */
const CustomClothing = () => {
  const [products, setProducts] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [modalImage, setModalImage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar productos y galería
  useEffect(() => {
    // Controlador para cancelar la petición
    const controller = new AbortController();
    // Fetch
    const fetchData = async () => {
      try {
        // Llamada a la API para obtener productos y galería
        const response = await api.products.getWithGallery("CustomClothing", {
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
    return <div className="u-loadingMessage">Cargando prendas...</div>;

  return (
    <>
      {/* Sección de galería*/}
      <section className="u-section">
        <div className="u-container">
          <h2 className="u-sectionTitle">Galería de Ropa Personalizada</h2>
          {/* Grid de imágenes de galería */}
          <div className="ClothingGallery-grid">
            {gallery.map((item) => (
              // Cada item es clickeable con la imagen ampliada
              <div
                key={item.id}
                className="ClothingGalleryItem"
                onClick={() => setModalImage(item.imageUrl)}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="ClothingGalleryItem-image"
                />
                {/* Overlay con información que aparece con hover */}
                <div className="ClothingGalleryItem-overlay">
                  <h3 className="ClothingGalleryItem-title">{item.title}</h3>
                  <p className="ClothingGalleryItem-desc">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Sección de paquetes de precios */}
      <section className="u-section PriceCard-section">
        <div className="u-container">
          <h2 className="u-sectionTitle">Paquetes de Personalización</h2>
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

export default CustomClothing;
