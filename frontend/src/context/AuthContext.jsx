/**
 * =====================================================
 * Contexto para manejar la autenticación de usuarios
 * =====================================================
 */

import React, { createContext, useState, useEffect, useContext } from "react";
import { api } from "@/services/api";
import { useNavigate } from "react-router-dom";

// Crea el contexto de autenticación
const AuthContext = createContext();

// Componente proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // Recupera la sesión del usuario desde localStorage
  useEffect(() => {
    // Recuperar el token JWT almacenado
    const token = localStorage.getItem("userToken");

    if (token) {
      // Si existe un token, recuperamos los datos del usuario
      const userData = JSON.parse(localStorage.getItem("userInfo"));
      setUser(userData);
    }
    setLoading(false);
  }, []);

  // Iniciar sesión
  const login = async (email, password) => {
    try {
      // Llamamos al endpoint de login
      const response = await api.auth.login({ email, password });
      // Si la respuesta incluye un token JWT válido
      if (response.data && response.data.token) {
        // Guarda el token JWT en localStorage
        localStorage.setItem("userToken", response.data.token);
        // Guarda la información del usuario
        localStorage.setItem("userInfo", JSON.stringify(response.data));
        setUser(response.data);
        // Redirige al usuario al carrito de compras después del login exitoso
        navigate("/cart");
      }
      return response;
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  };

  // Registrar nuevo usuario
  const register = async (username, email, password) => {
    try {
      // Llamamos al endpoint de registro
      const response = await api.auth.register({ username, email, password });
      // Si la respuesta incluye un token JWT válido
      if (response.data && response.data.token) {
        // Guarda el token JWT en localStorage
        localStorage.setItem("userToken", response.data.token);
        // Guarda la información del usuario recién registrado
        localStorage.setItem("userInfo", JSON.stringify(response.data));
        setUser(response.data);
        // Redirige al carrito de compras después del registro exitoso
        navigate("/cart");
      }
      return response;
    } catch (error) {
      console.error("Error en registro:", error);
      throw error;
    }
  };

  // Cerrar sesión
  const logout = () => {
    // Elimina el token JWT del localStorage
    localStorage.removeItem("userToken");
    // Elimina la información del usuario del localStorage
    localStorage.removeItem("userInfo");
    setUser(null);
    // Redirige a la página principal
    navigate("/");
  };
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
