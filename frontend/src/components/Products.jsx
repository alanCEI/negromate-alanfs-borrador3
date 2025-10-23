/** -------------------------------------------------------------------
 * ==============================================================
 * Productos - Configuración de las categorías de los servicios
 * ==============================================================
 */

import { Link } from "react-router-dom";
import "@/css/components/Products.css";

const productCategories = [
  {
    title: "Diseño Gráfico",
    path: "/graphic-design",
    image: "/images/ivy-bg.webp",
  },
  {
    title: "Ropa Personalizada",
    path: "/custom-clothing",
    image: "/images/clothes.webp",
  },
  { title: "Murales", path: "/murals", image: "/images/goiko.webp" },
];

/** -------------------------------------------------------------------
 * ============================================
 * Componente de los productos
 * ============================================
 */
const Products = () => {
  return (
    <section className="u-section Products">
      <div className="u-container">
        {/* Título */}
        <h2 className="u-sectionTitle">Nuestros Servicios</h2>
        {/* Grid de tarjetas */}
        <div className="Products-grid">
          {/* Generamos las tarjetas dinámicamente */}
          {productCategories.map((category) => (
            // Link que envuelve cada tarjeta
            <Link
              to={category.path}
              key={category.title}
              className="CategoryCard"
            >
              {/* Fondo de la categoría */}
              <img
                src={category.image}
                alt={category.title}
                className="CategoryCard-image"
              />
              {/* Overlay con el título del servicio */}
              <div className="CategoryCard-overlay">
                <h3 className="CategoryCard-title">{category.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
