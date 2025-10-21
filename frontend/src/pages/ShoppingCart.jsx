/**
 * ==============================================
 *  Página del ShoppingCart "Carrito de compras"
 * ==============================================
 */

import { useCart } from "@/context/CartContext";
import { api } from "@/services/api";
import { useState } from "react";
import { Link } from "react-router-dom";
import "@/css/pages/ShoppingCart.css";

const ShoppingCart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } =
    useCart();
  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: false,
  });

  // Procesamos la compra y crea una orden
  const handleCheckout = async () => {
    // Iniciamos estado de carga y reseteamos error/success
    setStatus({ loading: true, error: null, success: false });

    try {
      // Validar que el usuario esté autenticado
      const token = localStorage.getItem("userToken");
      if (!token) {
        throw new Error("Debes iniciar sesión para finalizar la compra.");
      }
      // Datos de la orden con el formato de la API
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
      };
      // Crear la orden en el backend
      await api.orders.create(orderData, token);
      // Marcar como exitoso y limpiar el carrito
      setStatus({ loading: false, error: null, success: true });
      setTimeout(clearCart, 300);
    } catch (error) {
      // Capta errores y muestra mensaje al usuario
      setStatus({
        loading: false,
        error: error.message || "Hubo un error al procesar tu orden.",
        success: false,
      });
    }
  };

  // Mensaje de éxito si la orden fue procesada
  if (status.success) {
    return (
      <div className="ContactPage-successMessage">
        <div className="ContactPage-successBox">
          <h1 className="text-3xl font-bold text-contrast-color mb-4">
            ¡Orden Realizada con Éxito!
          </h1>
          <p>Gracias por tu compra. Hemos recibido tu pedido.</p>
          <Link
            to="/"
            className="button"
            style={{ marginTop: "1.5rem", display: "inline-block" }}
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="section CartPage">
      <div className="container">
        <h1 className="Section-title">Carrito de Compras</h1>
        {/* Mensaje si el carrito está vacío */}
        {cartItems.length === 0 ? (
          <div className="CartPage-empty">
            <p>Tu carrito está vacío.</p>
            <Link to="/" className="button">
              Explorar productos
            </Link>
          </div>
        ) : (
          // Lista de items y resumen
          <div className="CartPage-layout">
            {/* Contenedor de items del carrito */}
            <div className="CartPage-itemsContainer">
              {/* Mapeo de cada producto en el carrito */}
              {cartItems.map((item) => (
                <div key={item._id} className="CartItem">
                  {/* Información del producto */}
                  <div className="CartItem-info">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="CartItem-image"
                    />
                    <div className="CartItem-details">
                      <h3>{item.name}</h3>
                      <p>{item.price.toFixed(2)}€</p>
                    </div>
                  </div>
                  {/* Modificar cantidad y eliminar */}
                  <div className="CartItem-actions">
                    {/* Input numérico para cambiar la cantidad */}
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item._id, parseInt(e.target.value))
                      }
                      className="CartItem-quantity"
                      min="1"
                    />
                    {/* Botón para eliminar el producto del carrito de compras */}
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="CartItem-removeButton"
                    >
                      {/* Icono de papelera */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* Panel lateral con resumen de la orden */}
            <div className="CartPage-summary">
              <h2>Resumen de la Orden</h2>
              {/* Fila de subtotal */}
              <div className="CartPage-summaryRow">
                <span>Subtotal</span>
                <span>{cartTotal.toFixed(2)}€</span>
              </div>
              {/* Fila de total */}
              <div className="CartPage-summaryTotal">
                <span>Total</span>
                <span>{cartTotal.toFixed(2)}€</span>
              </div>
              {/* Botón para finalizar la compra */}
              <button
                onClick={handleCheckout}
                disabled={status.loading}
                className="button"
              >
                {status.loading ? "Procesando..." : "Finalizar Compra"}
              </button>
              {/* Mensaje de error si la petición falla */}
              {status.error && (
                <p
                  className="ErrorMessage"
                  style={{ textAlign: "center", marginTop: "1rem" }}
                >
                  {status.error}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShoppingCart;
