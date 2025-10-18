/**
 * Página de Ropa Personalizada - Muestra servicios de personalización de prendas
 *
 * Esta página de categoría presenta:
 * - Galería en grid de trabajos previos de ropa personalizada
 * - Modal para ver imágenes ampliadas al hacer clic
 * - Paquetes de precios para servicios de personalización
 * - Integración con el carrito de compras
 */

import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { useCart } from '@/context/CartContext';
import '@/css/pages/CustomClothing.css';
import '@/css/pages/GraphicDesign.css'; // Reutilizamos los estilos de PriceCard

/**
 * Componente PriceCard - Tarjeta de producto con precio y detalles
 *
 * @param {Object} product - Producto con name, description, price, details
 * @returns {JSX.Element} Tarjeta con información del producto y botón de compra
 */
const PriceCard = ({ product }) => {
    // Obtener función para agregar al carrito desde el contexto
    const { addToCart } = useCart();

    return (
        <div className="price-card">
            <h3 className="price-card-name">{product.name}</h3>
            <p className="price-card-description">{product.description}</p>
            <div className="price-card-price">{product.price}€</div>
            {/* Lista de características incluidas en el paquete */}
             <ul className="price-card-details">
                {product.details.map((detail, i) => <li key={i}><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg><span>{detail}</span></li>)}
            </ul>
            {/* Botón para agregar el producto al carrito usando CartContext */}
            <button onClick={() => addToCart(product)} className="button">Agregar al Carrito</button>
        </div>
    );
}

/**
 * Componente principal CustomClothing
 *
 * Página de categoría para servicios de ropa personalizada que muestra:
 * - Galería en cuadrícula de trabajos realizados
 * - Modal interactivo para ampliar imágenes
 * - Paquetes de personalización disponibles
 */
const CustomClothing = () => {
    // Estado para almacenar los productos/paquetes de personalización
    const [products, setProducts] = useState([]);

    // Estado para almacenar los items de la galería de trabajos
    const [gallery, setGallery] = useState([]);

    // Estado para la imagen mostrada en el modal (null cuando el modal está cerrado)
    const [modalImage, setModalImage] = useState(null);

    // Estado de carga para mostrar mensaje mientras se obtienen los datos
    const [loading, setLoading] = useState(true);

    /**
     * Effect para cargar productos y galería al montar el componente
     * Implementa cancelación de petición para evitar memory leaks
     */
    useEffect(() => {
        // Controlador para cancelar la petición si el componente se desmonta
        const controller = new AbortController();

        const fetchData = async () => {
            try {
                // Llamada a la API para obtener productos y galería de la categoría 'CustomClothing'
                const response = await api.products.getWithGallery('CustomClothing', { signal: controller.signal });

                // Actualizar estado con los productos obtenidos
                setProducts(response.data.products);

                // Actualizar estado con la galería obtenida
                setGallery(response.data.gallery);
            } catch (error) {
                // Ignorar errores de cancelación, solo mostrar otros errores
                if(error.name !== 'AbortError') console.error("Error fetching data:", error);
            } finally {
                // Siempre actualizar el estado de carga al finalizar
                setLoading(false);
            }
        };

        fetchData();

        // Cleanup: cancelar la petición si el componente se desmonta
        return () => controller.abort();
    }, []);

    // Mostrar mensaje de carga mientras se obtienen los datos
    if (loading) return <div className="loading-message">Cargando prendas...</div>;

    return (
        <div className="bg-main-color text-sub-color">
            {/* Sección de galería de trabajos */}
            <section className="section">
                <div className="container">
                    <h2 className="section-title">Galería de Ropa Personalizada</h2>
                    {/* Grid de imágenes de galería */}
                    <div className="clothing-gallery-grid">
                        {gallery.map(item => (
                            // Cada item es clickeable para abrir el modal con la imagen ampliada
                            <div key={item.id} className="clothing-gallery-item" onClick={() => setModalImage(item.imageUrl)}>
                                <img src={item.imageUrl} alt={item.title} className="clothing-gallery-item-image" />
                                {/* Overlay con información que aparece al hacer hover */}
                                <div className="clothing-gallery-item-overlay">
                                    <h3 className="clothing-gallery-item-title">{item.title}</h3>
                                    <p className="clothing-gallery-item-desc">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sección de paquetes de precios */}
            <section className="section price-card-section">
                <div className="container">
                    <h2 className="section-title">Paquetes de Personalización</h2>
                    {/* Grid de tarjetas de productos */}
                     <div className="price-cards-grid">
                       {products.map(p => <PriceCard key={p._id} product={p} />)}
                    </div>
                </div>
            </section>

            {/* Modal para vista ampliada de imagen - solo se muestra si modalImage tiene valor */}
            {modalImage && (
                <div className="modal-overlay" onClick={() => setModalImage(null)}>
                    <img src={modalImage} alt="Vista ampliada" className="modal-image" />
                </div>
            )}
        </div>
    );
};

export default CustomClothing;
