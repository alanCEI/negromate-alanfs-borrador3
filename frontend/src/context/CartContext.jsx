/**
 * CartContext.jsx
 *
 * Contexto de React para gestionar el carrito de compras de la aplicación.
 *
 * Propósito:
 * - Mantener el estado del carrito de compras (productos agregados)
 * - Persistir el carrito en localStorage para conservarlo entre sesiones
 * - Proveer funciones para agregar, eliminar y actualizar productos
 * - Calcular automáticamente el total de items y el precio total del carrito
 *
 * Valores expuestos:
 * - cartItems: Array de productos en el carrito (cada item incluye product + quantity)
 * - addToCart: Función para agregar productos al carrito
 * - removeFromCart: Función para eliminar un producto del carrito
 * - updateQuantity: Función para actualizar la cantidad de un producto
 * - clearCart: Función para vaciar completamente el carrito
 * - cartCount: Número total de items en el carrito (suma de cantidades)
 * - cartTotal: Precio total del carrito (suma de price * quantity)
 */

import React, { createContext, useState, useEffect, useContext } from 'react';

// Crea el contexto del carrito de compras
const CartContext = createContext();

/**
 * CartProvider - Componente proveedor del contexto del carrito
 *
 * Envuelve la aplicación para proporcionar estado y funciones del carrito
 * a todos los componentes hijos.
 *
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos que tendrán acceso al contexto
 */
export const CartProvider = ({ children }) => {
    /**
     * Estado del carrito de compras
     * Inicializa desde localStorage para persistir el carrito entre sesiones
     * Si no existe datos previos, inicializa como array vacío
     */
    const [cartItems, setCartItems] = useState(() => {
        const localData = localStorage.getItem('cartItems');
        return localData ? JSON.parse(localData) : [];
    });

    /**
     * Efecto que sincroniza el carrito con localStorage
     * Se ejecuta cada vez que cartItems cambia
     */
    useEffect(() => {
        // Guarda el carrito actualizado en localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    /**
     * Función para agregar un producto al carrito
     *
     * Si el producto ya existe en el carrito, incrementa su cantidad.
     * Si es un producto nuevo, lo agrega con la cantidad especificada.
     *
     * @param {Object} product - Objeto del producto con _id, name, price, imageUrl, etc.
     * @param {number} quantity - Cantidad a agregar (por defecto 1)
     */
    const addToCart = (product, quantity = 1) => {
        setCartItems(prevItems => {
            // Verifica si el producto ya existe en el carrito
            const itemExists = prevItems.find(item => item._id === product._id);

            if (itemExists) {
                // Si existe, incrementa la cantidad del producto existente
                return prevItems.map(item =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                // Si no existe, agrega el producto como nuevo item
                return [...prevItems, { ...product, quantity }];
            }
        });
    };

    /**
     * Función para eliminar un producto del carrito
     *
     * @param {string} productId - ID del producto a eliminar (_id de MongoDB)
     */
    const removeFromCart = (productId) => {
        // Filtra el carrito removiendo el producto con el ID especificado
        setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
    };

    /**
     * Función para actualizar la cantidad de un producto específico
     *
     * La cantidad mínima es 1, no permite cantidades negativas o cero.
     *
     * @param {string} productId - ID del producto a actualizar
     * @param {number} quantity - Nueva cantidad del producto (mínimo 1)
     */
    const updateQuantity = (productId, quantity) => {
        setCartItems(prevItems => prevItems.map(item =>
            // Solo actualiza el item que coincide con el productId
            // Math.max(1, quantity) asegura que la cantidad sea al menos 1
            item._id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
        ));
    };

    /**
     * Función para vaciar completamente el carrito
     *
     * Útil después de completar una compra o cuando el usuario desea limpiar el carrito.
     */
    const clearCart = () => {
        setCartItems([]);
    };

    /**
     * Calcula el número total de items en el carrito
     * Suma todas las cantidades de cada producto
     */
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    /**
     * Calcula el precio total del carrito
     * Suma el precio de cada producto multiplicado por su cantidad
     */
    const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartCount,
            cartTotal
        }}>
            {children}
        </CartContext.Provider>
    );
};

/**
 * Hook personalizado para acceder al contexto del carrito
 *
 * Simplifica el acceso al CartContext desde cualquier componente.
 *
 * @returns {Object} Objeto con { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }
 *
 * Ejemplo de uso:
 * const { cartItems, addToCart, cartCount, cartTotal } = useCart();
 * addToCart(product, 2);
 */
export const useCart = () => useContext(CartContext);