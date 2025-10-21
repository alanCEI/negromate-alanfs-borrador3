/**
 * ==============================================
 * Configuración de las categorías de los servicios
 * ==============================================
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

/**
 * ============================================
 * Componente de servicios/productos
 * ============================================
 */
const Products = () => {
  return (
    <section className="section Products">
      <div className="container">
        {/* Título */}
        <h2 className="Section-title">Nuestros Servicios</h2>
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
              <div className="CategoryCard-overlay absolute inset-0 flex items-center justify-center">
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
