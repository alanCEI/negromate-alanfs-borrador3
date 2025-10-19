import { Link } from "react-router-dom";
import "@/css/components/Products.css";

// Configuración de las categorías de los servicios
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
// Componente de servicios/productos
const Products = () => {
  return (
    <section className="section products-section">
      <div className="container">
        {/* Título */}
        <h2 className="section-title">Nuestros Servicios</h2>
        {/* Grid de tarjetas */}
        <div className="products-grid">
          {/* Generamos las tarjetas dinámicamente */}
          {productCategories.map((category) => (
            // Link que envuelve cada tarjeta
            <Link
              to={category.path}
              key={category.title}
              className="category-card"
            >
              {/* Fondo de la categoría */}
              <img
                src={category.image}
                alt={category.title}
                className="category-card-image"
              />
              {/* Overlay con el título del servicio */}
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
