/**
 * Página de Diseño Gráfico - Muestra servicios de diseño gráfico y galería de trabajos
 *
 * Esta página de categoría presenta:
 * - Galería interactiva de trabajos previos de diseño gráfico
 * - Paquetes de precios con detalles de cada servicio
 * - Integración con el carrito de compras para agregar productos
 */

import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { useCart } from '@/context/CartContext';
import '@/css/pages/GraphicDesign.css';

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
                {product.details.map((detail, i) => (
                    <li key={i}>
                        {/* Icono de check verde para cada característica */}
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        <span>{detail}</span>
                    </li>
                ))}
            </ul>
            {/* Botón para agregar el producto al carrito usando CartContext */}
            <button onClick={() => addToCart(product)} className="button">
                Agregar al Carrito
            </button>
        </div>
    );
};

/**
 * Componente GalleryItem - Elemento de la galería lateral
 *
 * @param {Object} item - Item de galería con brand e imageUrl
 * @param {Function} onSelect - Función para seleccionar este item
 * @param {boolean} isSelected - Indica si este item está seleccionado actualmente
 * @returns {JSX.Element} Item de galería clickeable
 */
const GalleryItem = ({ item, onSelect, isSelected }) => (
    <div
        onClick={onSelect}
        className={`gallery-item ${isSelected ? 'selected' : ''}`}
    >
        <h4 className="gallery-item-brand">{item.brand}</h4>
    </div>
);

/**
 * Componente principal GraphicDesign
 *
 * Página de categoría para servicios de diseño gráfico que muestra:
 * - Galería de trabajos previos con vista previa interactiva
 * - Paquetes de precios disponibles para contratar
 */
const GraphicDesign = () => {
    // Estado para almacenar los productos/paquetes de diseño gráfico
    const [products, setProducts] = useState([]);

    // Estado para almacenar los items de la galería de trabajos
    const [gallery, setGallery] = useState([]);

    // Estado para el item seleccionado en la galería (vista principal)
    const [selectedItem, setSelectedItem] = useState(null);

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
                // Llamada a la API para obtener productos y galería de la categoría 'GraphicDesign'
                const response = await api.products.getWithGallery('GraphicDesign', { signal: controller.signal });

                // Actualizar estado con los productos obtenidos
                setProducts(response.data.products);

                // Actualizar estado con la galería obtenida
                setGallery(response.data.gallery);

                // Seleccionar automáticamente el primer item de la galería si existe
                if(response.data.gallery.length > 0) {
                    setSelectedItem(response.data.gallery[0]);
                }
            } catch (error) {
                // Ignorar errores de cancelación, solo mostrar otros errores
                if (error.name !== 'AbortError') console.error("Error fetching data:", error);
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
    if (loading) return <div className="loading-message">Cargando diseños...</div>;

    return (
        <div className="bg-main-color text-sub-color">
            {/* Sección de galería de trabajos */}
            <section className="section">
                <div className="container">
                    <h2 className="section-title">Galería de Diseño Gráfico</h2>
                    <div className="gallery-layout">
                        {/* Sidebar con lista de items de galería */}
                        <div className="gallery-sidebar">
                            {gallery.map(item => <GalleryItem key={item.id} item={item} onSelect={() => setSelectedItem(item)} isSelected={selectedItem?.id === item.id}/>)}
                        </div>
                        {/* Vista principal del item seleccionado */}
                        <div className="md-col-span-2">
                             {selectedItem && (
                                 <div className="gallery-main">
                                     <img src={selectedItem.imageUrl} alt={selectedItem.brand} className="gallery-main-image"/>
                                     <h3 className="gallery-main-brand">{selectedItem.brand}</h3>
                                     <p>{selectedItem.description}</p>
                                 </div>
                             )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Sección de paquetes de precios */}
            <section className="section price-card-section">
                <div className="container">
                    <h2 className="section-title">Paquetes de Precios</h2>
                    {/* Grid de tarjetas de productos */}
                    <div className="price-cards-grid">
                       {products.map(p => <PriceCard key={p._id} product={p} />)}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default GraphicDesign;
