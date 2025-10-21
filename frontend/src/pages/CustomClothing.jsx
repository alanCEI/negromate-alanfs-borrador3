/**
 * ============================================
 * Página de Ropa Personalizada
 * ============================================
 */

import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { useCart } from "@/context/CartContext";
import "@/css/pages/CustomClothing.css";
import "@/css/pages/GraphicDesign.css";

// Tarjeta de producto con precio y detalles
const PriceCard = ({ product }) => {
  // Agregar al carrito desde el context
  const { addToCart } = useCart();

  return (
    <div className="PriceCard bg-main p-8 rounded-lg shadow-lg flex flex-col border-accent">
      <h3 className="text-2xl font-bold text-contrast mb-4 text-center">{product.name}</h3>
      <p className="text-center mb-6 PriceCard-description">{product.description}</p>
      <div className="text-6xl font-bold text-center mb-6 text-contrast">{product.price}€</div>
      {/* Lista de características en el paquete */}
      <ul className="PriceCard-details">
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
 * ============================================
 * Componente "CustomClothing"
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
    return <div className="LoadingMessage">Cargando prendas...</div>;

  return (
    <div className="bg-main-color text-sub-color">
      {/* Sección de galería*/}
      <section className="section">
        <div className="container">
          <h2 className="Section-title">Galería de Ropa Personalizada</h2>
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
                <div className="ClothingGalleryItem-overlay absolute inset-0 transition-opacity flex flex-col p-4">
                  <h3 className="ClothingGalleryItem-title text-xl font-bold transition-transform">{item.title}</h3>
                  <p className="ClothingGalleryItem-description">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Sección de paquetes de precios */}
      <section className="section PriceCardSection">
        <div className="container">
          <h2 className="Section-title">Paquetes de Personalización</h2>
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
        <div className="Modal-overlay fixed inset-0 z-100 flex items-center justify-center p-4" onClick={() => setModalImage(null)}>
          <img src={modalImage} alt="Vista ampliada" className="Modal-image" />
        </div>
      )}
    </div>
  );
};

export default CustomClothing;
