/** -------------------------------------------------------------------
 * ============================================
 * Página de Diseño Gráfico "Graphic Design" 
 * ============================================
 */

import { useState, useEffect } from "react";
import { api } from "@/services/api";
import PriceCard from "@/components/PriceCard";
import "@/css/pages/GraphicDesign.css";

/** -------------------------------------------------------------------
 * ============================================
 * Componente GalleryItem
 * ============================================
 */
const GalleryItem = ({ item, onSelect, isSelected }) => (
  <div
    onClick={onSelect}
    className={`GalleryItem ${isSelected ? "GalleryItem--selected" : ""}`}
  >
    <h4 className="GalleryItem-brand">{item.brand}</h4>
  </div>
);

/** -------------------------------------------------------------------
 * ============================================
 * Componente principal "GraphicDesign"
 * ============================================
 */
const GraphicDesign = () => {
  const [products, setProducts] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargamos productos y galería
  useEffect(() => {
    // Controlador para cancelar la petición
    const controller = new AbortController();
    // Fetch
    const fetchData = async () => {
      try {
        // Llamada a la API para obtener productos y galería
        const response = await api.products.getWithGallery("GraphicDesign", {
          signal: controller.signal,
        });
        // Actualizamos estado con los productos
        setProducts(response.data.products);
        // Actualizamos estado con la galería
        setGallery(response.data.gallery);
        // Selecciona automaticamente el primer item de la galería
        if (response.data.gallery.length > 0) {
          setSelectedItem(response.data.gallery[0]);
        }
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
    return <div className="u-loadingMessage">Cargando diseños...</div>;

  return (
    <>
      {/* Sección de galería */}
      <section className="u-section">
        <div className="u-container">
          <h2 className="u-sectionTitle">Galería de Diseño Gráfico</h2>
          <div className="Gallery-layout">
            {/* Lista de items de galería */}
            <div className="Gallery-sidebar">
              {gallery.map((item) => (
                <GalleryItem
                  key={item.id}
                  item={item}
                  onSelect={() => setSelectedItem(item)}
                  isSelected={selectedItem?.id === item.id}
                />
              ))}
            </div>
            {/* Vista del item seleccionado */}
            <div>
              {selectedItem && (
                <div className="Gallery-main">
                  <img
                    src={selectedItem.imageUrl}
                    alt={selectedItem.brand}
                    className="Gallery-mainImage"
                  />
                  <h3 className="Gallery-mainBrand">{selectedItem.brand}</h3>
                  <p>{selectedItem.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* Sección de paquetes de precios */}
      <section className="u-section PriceCard-section">
        <div className="u-container">
          <h2 className="u-sectionTitle">Paquetes de Precios</h2>
          {/* Grid de tarjetas de productos */}
          <div className="PriceCards-grid">
            {products.map((p) => (
              <PriceCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default GraphicDesign;
