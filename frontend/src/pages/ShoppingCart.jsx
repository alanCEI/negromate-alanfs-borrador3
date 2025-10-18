/**
 * ShoppingCart - Página del carrito de compras
 *
 * @description
 * Página que muestra los productos agregados al carrito, permite modificar cantidades,
 * eliminar items y finalizar la compra. Se integra con CartContext para gestionar
 * el estado del carrito y con la API para crear órdenes de compra.
 *
 * @component
 * Características principales:
 * - Lista de productos en el carrito con imagen, nombre y precio
 * - Modificación de cantidades por producto
 * - Eliminación de productos del carrito
 * - Cálculo automático del total
 * - Proceso de checkout con validación de autenticación
 * - Creación de órdenes en el backend
 * - Feedback de estados: vacío, carga, error, éxito
 *
 * @requires CartContext - Para acceso al estado del carrito
 * @requires api.orders - Para crear órdenes en el backend
 *
 * @returns {JSX.Element} Página del carrito de compras
 */

import { useCart } from '@/context/CartContext';
import { api } from '@/services/api';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import '@/css/pages/ShoppingCart.css';

const ShoppingCart = () => {
    /**
     * Desestructuración de CartContext
     *
     * - cartItems: Array de productos en el carrito
     * - removeFromCart: Función para eliminar un producto
     * - updateQuantity: Función para modificar la cantidad de un producto
     * - clearCart: Función para vaciar el carrito completamente
     * - cartTotal: Total calculado del carrito
     */
    const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();

    /**
     * Estado para controlar el proceso de checkout
     *
     * - loading: Indica si se está procesando la orden
     * - error: Mensaje de error si la petición falla
     * - success: Indica si la orden se completó exitosamente
     */
    const [status, setStatus] = useState({ loading: false, error: null, success: false });

    /**
     * handleCheckout - Procesa la compra y crea una orden en el backend
     *
     * @async
     * @description
     * Valida que el usuario esté autenticado, prepara los datos de la orden
     * y realiza una petición POST a la API para crear la orden. Si es exitoso,
     * limpia el carrito después de 300ms.
     *
     * Flujo:
     * 1. Activa estado de carga
     * 2. Valida token de autenticación en localStorage
     * 3. Prepara datos de la orden (productos y cantidades)
     * 4. Envía petición a la API
     * 5. Si es exitoso: marca success y limpia carrito
     * 6. Si falla: muestra mensaje de error
     */
    const handleCheckout = async () => {
        // Iniciar estado de carga y resetear error/success
        setStatus({ loading: true, error: null, success: false });

        try {
            // Validar que el usuario esté autenticado
            const token = localStorage.getItem('userToken');
            if (!token) {
                throw new Error("Debes iniciar sesión para finalizar la compra.");
            }

            // Preparar datos de la orden: mapear items del carrito al formato esperado por la API
            const orderData = {
                orderItems: cartItems.map(item => ({
                    product: item._id,      // ID del producto
                    quantity: item.quantity  // Cantidad seleccionada
                }))
            };

            // Crear la orden en el backend mediante petición POST
            await api.orders.create(orderData, token);

            // Marcar como exitoso y limpiar el carrito después de un breve delay
            setStatus({ loading: false, error: null, success: true });
            setTimeout(clearCart, 300);
        } catch (error) {
            // Manejar errores y mostrar mensaje al usuario
            setStatus({ loading: false, error: error.message || 'Hubo un error al procesar tu orden.', success: false });
        }
    };

    // Renderizado condicional: mostrar mensaje de éxito si la orden fue procesada
    if (status.success) {
        return (
             <div className="contact-success-message">
                <div className="contact-success-box">
                    <h1 className="text-3xl font-bold text-contrast-color mb-4">¡Orden Realizada con Éxito!</h1>
                    <p>Gracias por tu compra. Hemos recibido tu pedido.</p>
                    <Link to="/" className="button" style={{marginTop: '1.5rem', display: 'inline-block'}}>Volver al Inicio</Link>
                </div>
            </div>
        )
    }

    return (
        <section className="section cart-page">
            <div className="container">
                <h1 className="section-title">Carrito de Compras</h1>

                {/* Renderizado condicional: mensaje si el carrito está vacío */}
                {cartItems.length === 0 ? (
                    <div className="cart-empty">
                        <p>Tu carrito está vacío.</p>
                        <Link to="/" className="button">Explorar productos</Link>
                    </div>
                ) : (
                    // Layout del carrito: lista de items + resumen
                    <div className="cart-layout">
                        {/* Contenedor de items del carrito */}
                        <div className="cart-items-container">
                            {/* Mapeo de cada producto en el carrito */}
                            {cartItems.map(item => (
                                <div key={item._id} className="cart-item">
                                    {/* Información del producto: imagen, nombre y precio */}
                                    <div className="cart-item-info">
                                        <img src={item.imageUrl} alt={item.name} className="cart-item-image"/>
                                        <div className="cart-item-details">
                                            <h3>{item.name}</h3>
                                            <p>{item.price.toFixed(2)}€</p>
                                        </div>
                                    </div>

                                    {/* Acciones: modificar cantidad y eliminar */}
                                    <div className="cart-item-actions">
                                        {/* Input numérico para cambiar la cantidad */}
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                                            className="cart-item-quantity"
                                            min="1"
                                        />

                                        {/* Botón para eliminar el producto del carrito */}
                                        <button onClick={() => removeFromCart(item._id)} className="cart-item-remove">
                                           {/* Icono de papelera (trash) en SVG */}
                                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Panel lateral con resumen de la orden */}
                        <div className="cart-summary">
                             <h2>Resumen de la Orden</h2>

                             {/* Fila de subtotal */}
                             <div className="cart-summary-row">
                                 <span>Subtotal</span>
                                 <span>{cartTotal.toFixed(2)}€</span>
                             </div>

                             {/* Fila de total (actualmente igual al subtotal) */}
                             <div className="cart-summary-total">
                                 <span>Total</span>
                                 <span>{cartTotal.toFixed(2)}€</span>
                             </div>

                             {/* Botón para finalizar la compra - Se deshabilita durante el procesamiento */}
                             <button
                                onClick={handleCheckout}
                                disabled={status.loading}
                                className="button"
                             >
                                 {status.loading ? 'Procesando...' : 'Finalizar Compra'}
                             </button>

                             {/* Mensaje de error si la petición falla */}
                             {status.error && <p className="error-message" style={{textAlign: 'center', marginTop: '1rem'}}>{status.error}</p>}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ShoppingCart;
