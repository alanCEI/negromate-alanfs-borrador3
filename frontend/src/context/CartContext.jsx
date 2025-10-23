/** -------------------------------------------------------------------
 * ===============================================
 * Contexto para gestionar el carrito de compras
 * ===============================================
 */

import React, { createContext, useState, useEffect, useContext } from "react";

// Crea el contexto del carrito de compras
const CartContext = createContext();

// Componente del contexto del carrito de compras
export const CartProvider = ({ children }) => {
  // Si no existen datos previos, inicia como array vacío
  const [cartItems, setCartItems] = useState(() => {
    const localData = localStorage.getItem("cartItems");
    return localData ? JSON.parse(localData) : [];
  });

  // Se ejecuta cada vez que cartItems cambia
  useEffect(() => {
    // Guarda el carrito actualizado en localStorage
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Agregar un producto al carrito de compras
  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      // Verifica si el producto ya existe en el carrito de compras
      const itemExists = prevItems.find((item) => item._id === product._id);

      if (itemExists) {
        // Si existe, incrementa la cantidad del producto
        return prevItems.map((item) =>
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

  // Eliminar un producto del carrito de compras
  const removeFromCart = (productId) => {
    // Filtra el carrito removiendo el producto con ID
    setCartItems((prevItems) =>
      prevItems.filter((item) => item._id !== productId)
    );
  };

  // Actualizar la cantidad de un producto
  const updateQuantity = (productId, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        // Solo actualiza el item que coincide con productId
        item._id === productId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  // Vaciar completamente el carrito de compras
  const clearCart = () => {
    setCartItems([]);
  };

  // Calcula el número total de items en el carrito de compras
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Calcula el precio total del carrito de compras
  const cartTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
