/** -------------------------------------------------------------------
 * =====================================
 * Componente de PriceCard
 * =====================================
 */

import { useCart } from "@/context/CartContext";

const PriceCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="PriceCard">
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
      <button onClick={() => addToCart(product)} className="Button">
        Agregar al Carrito
      </button>
    </div>
  );
};

export default PriceCard;
