/**
 * ============================================
 * Página de Graphic Design "Diseño Gráfico"
 * ============================================
 */

import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { useCart } from "@/context/CartContext";
import "@/css/pages/GraphicDesign.css";

/**
 * ============================================
 * Componente de PriceCard - Tarjeta de producto con precio y detalles
 * ============================================
 */
const PriceCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="PriceCard bg-main p-8 rounded-lg shadow-lg flex flex-col border-accent">
      <h3 className="PriceCard-name">{product.name}</h3>
      <p className="PriceCard-description">{product.description}</p>
      <div className="PriceCard-price">{product.price}€</div>
      {/* Lista de características en el paquete */}
      <ul className="PriceCard-details">
        {product.details.map((detail, i) => (
          <li key={i}>
            {/* Icono de check */}
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <span>{detail}</span>
          </li>
        ))}
      </ul>
      {/* Botón para agregar el producto al carrito de compras */}
      <button onClick={() => addToCart(product)} className="button">
        Agregar al Carrito
      </button>
    </div>
  );
};

/**
 * ============================================
 * Componente GalleryItem
 * ============================================
 */
const GalleryItem = ({ item, onSelect, isSelected }) => (
  <div
    onClick={onSelect}
    className={`GalleryItem ${isSelected ? "is-selected" : ""}`}
  >
    <h4 className="GalleryItem-brand">{item.brand}</h4>
  </div>
);

/**
 * ============================================
 * Componente principal GraphicDesign
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
    return <div className="LoadingMessage">Cargando diseños...</div>;

  return (
    <div className="bg-main-color text-sub-color">
      {/* Sección de galería */}
      <section className="section">
        <div className="container">
          <h2 className="Section-title">Galería de Diseño Gráfico</h2>
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
            <div className="md-col-span-2">
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
      <section className="section PriceCardSection">
        <div className="container">
          <h2 className="Section-title">Paquetes de Precios</h2>
          {/* Grid de tarjetas de productos */}
          <div className="PriceCards-grid">
            {products.map((p) => (
              <PriceCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default GraphicDesign;
