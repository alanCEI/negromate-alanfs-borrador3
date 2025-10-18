import { Link } from 'react-router-dom';
import '@/css/components/Products.css';

/**
 * productCategories - Configuración de las categorías de servicios
 *
 * Array que define las tres categorías principales de servicios ofrecidos por Negromate Creatives.
 * Cada categoría incluye:
 * - title: Nombre del servicio que se muestra al usuario
 * - path: Ruta de React Router a la que navega cuando se hace clic
 * - image: Ruta de la imagen de fondo que representa visualmente el servicio
 */
const productCategories = [
    { title: 'Diseño Gráfico', path: '/graphic-design', image: '/images/ivy-bg.webp' },
    { title: 'Ropa Personalizada', path: '/custom-clothing', image: '/images/clothes.webp' },
    { title: 'Murales', path: '/murals', image: '/images/goiko.webp' }
];

/**
 * Products - Componente de sección de servicios/productos
 *
 * Este componente renderiza la sección "Nuestros Servicios" en la landing page,
 * mostrando las tres categorías principales de servicios creativos como tarjetas
 * interactivas con imágenes de fondo. Cada tarjeta es un enlace navegable a su
 * respectiva página de categoría.
 *
 * Estructura del componente:
 * - Título de sección: "Nuestros Servicios"
 * - Grid de 3 tarjetas (products-grid) con diseño responsivo
 * - Cada tarjeta incluye:
 *   - Imagen de fondo representativa del servicio
 *   - Overlay oscuro para mejorar la legibilidad
 *   - Título del servicio superpuesto
 *
 * Contenido mostrado:
 * - Diseño Gráfico: Enlaza a /graphic-design
 * - Ropa Personalizada: Enlaza a /custom-clothing
 * - Murales: Enlaza a /murals
 *
 * Navegación:
 * - Utiliza React Router DOM (<Link>) para navegación SPA sin recargas de página
 * - Las tarjetas son completamente clicables y accesibles
 *
 * Estilos:
 * - Importa Products.css para estilos específicos del componente
 * - Utiliza clases CSS para layout grid responsivo y efectos hover
 *
 * @returns {JSX.Element} Sección de servicios con grid de tarjetas navegables
 */
const Products = () => {
    return (
        <section className="section products-section">
            <div className="container">
                {/* Título principal de la sección */}
                <h2 className="section-title">Nuestros Servicios</h2>

                {/* Grid de tarjetas de categorías */}
                <div className="products-grid">
                    {/* Mapeo del array de categorías para generar las tarjetas dinámicamente */}
                    {productCategories.map((category) => (
                        // Link navegable envuelve cada tarjeta completa
                        <Link to={category.path} key={category.title} className="category-card">
                            {/* Imagen de fondo de la categoría */}
                            <img src={category.image} alt={category.title} className="category-card-image" />

                            {/* Overlay oscuro con el título del servicio */}
                            <div className="category-card-overlay">
                                <h3 className="category-card-title">{category.title}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Products;
