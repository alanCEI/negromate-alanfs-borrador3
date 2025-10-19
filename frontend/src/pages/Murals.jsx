/**
 *
 * Página de Murals "Murales"
 *
 */

import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { useCart } from "@/context/CartContext";
import "@/css/pages/Murals.css";
import "@/css/pages/GraphicDesign.css";

/**
 *
 * Componente PriceCard - Tarjeta de producto con precio y detalles
 *
 */
const PriceCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="price-card">
      <h3 className="price-card-name">{product.name}</h3>
      <p className="price-card-description">{product.description}</p>
      <div className="price-card-price">{product.price}€</div>
      {/* Lista de características en el paquete */}
      <ul className="price-card-details">
        {product.details.map((detail, i) => (
          <li key={i}>
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
 *
 * Componente principal Murals
 *
 */
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
    return <div className="loading-message">Cargando murales...</div>;

  return (
    <div className="bg-main-color text-sub-color">
      {/* Sección de galería */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Galería de Murales</h2>
          {/* Grid de imágenes de galería */}
          <div className="murals-gallery-grid">
            {gallery.map((item) => (
              // Cada item es clickeable con la imagen ampliada
              <div
                key={item.id}
                className="murals-gallery-item"
                onClick={() => setModalImage(item.imageUrl)}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="murals-gallery-item-image"
                />
                {/* Overlay con título que aparece con hover */}
                <div className="murals-gallery-item-overlay">
                  <h3 className="murals-gallery-item-title">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Sección de paquetes de precios */}
      <section className="section price-card-section">
        <div className="container">
          <h2 className="section-title">Paquetes de Murales</h2>
          {/* Grid de tarjetas de productos */}
          <div className="price-cards-grid">
            {products.map((p) => (
              <PriceCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      </section>
      {/* Vista ampliada de la imagen */}
      {modalImage && (
        <div className="modal-overlay" onClick={() => setModalImage(null)}>
          <img src={modalImage} alt="Vista ampliada" className="modal-image" />
        </div>
      )}
    </div>
  );
};

export default Murals;
