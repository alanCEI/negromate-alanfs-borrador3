/**
 * AuthContext.jsx
 *
 * Contexto de React para manejar la autenticación de usuarios en toda la aplicación.
 *
 * Propósito:
 * - Gestionar el estado del usuario autenticado (login, register, logout)
 * - Persistir la sesión del usuario usando localStorage
 * - Proveer funciones de autenticación accesibles desde cualquier componente
 * - Manejar el estado de carga durante la inicialización de la sesión
 *
 * Valores expuestos:
 * - user: Objeto con datos del usuario autenticado (username, email, role, token)
 * - loading: Booleano que indica si se está cargando la sesión inicial
 * - login: Función para autenticar usuario con email y password
 * - register: Función para registrar un nuevo usuario
 * - logout: Función para cerrar sesión y limpiar datos
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '@/services/api';
import { useNavigate } from 'react-router-dom';

// Crea el contexto de autenticación
const AuthContext = createContext();

/**
 * AuthProvider - Componente proveedor del contexto de autenticación
 *
 * Envuelve la aplicación para proporcionar estado y funciones de autenticación
 * a todos los componentes hijos que lo necesiten.
 *
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos que tendrán acceso al contexto
 */
export const AuthProvider = ({ children }) => {
    // Estado que almacena los datos del usuario autenticado (null si no hay sesión)
    const [user, setUser] = useState(null);

    // Estado para controlar la carga inicial de la sesión desde localStorage
    const [loading, setLoading] = useState(true);

    // Hook de navegación de React Router para redirecciones
    const navigate = useNavigate();

    /**
     * Efecto que se ejecuta al montar el componente
     * Recupera la sesión del usuario desde localStorage si existe
     */
    useEffect(() => {
        // Intenta recuperar el token JWT almacenado
        const token = localStorage.getItem('userToken');

        if (token) {
            // Si existe un token, recupera los datos del usuario
            // Aquí podrías validar el token con el backend para asegurar que es válido
            // y obtener los datos frescos del usuario.
            const userData = JSON.parse(localStorage.getItem('userInfo'));
            setUser(userData);
        }

        // Finaliza el estado de carga
        setLoading(false);
    }, []);

    /**
     * Función para iniciar sesión
     *
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña del usuario
     * @returns {Promise<Object>} Respuesta del servidor con datos del usuario y token
     * @throws {Error} Si las credenciales son inválidas o hay un error de red
     */
    const login = async (email, password) => {
        try {
            // Llama al endpoint de login en el backend
            const response = await api.auth.login({ email, password });

            // Si la respuesta incluye un token JWT válido
            if (response.data && response.data.token) {
                // Guarda el token JWT en localStorage para persistir la sesión
                localStorage.setItem('userToken', response.data.token);

                // Guarda la información del usuario (username, email, role, etc.)
                localStorage.setItem('userInfo', JSON.stringify(response.data));

                // Actualiza el estado del usuario en el contexto
                setUser(response.data);

                // Redirige al usuario al carrito después del login exitoso
                navigate('/cart');
            }

            return response;
        } catch (error) {
            console.error("Error en login:", error);
            throw error;
        }
    };

    /**
     * Función para registrar un nuevo usuario
     *
     * @param {string} username - Nombre de usuario
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña del usuario
     * @returns {Promise<Object>} Respuesta del servidor con datos del usuario y token
     * @throws {Error} Si hay un error en el registro (email duplicado, etc.)
     */
    const register = async (username, email, password) => {
        try {
            // Llama al endpoint de registro en el backend
            const response = await api.auth.register({ username, email, password });

            // Si el registro es exitoso y se recibe un token
            if (response.data && response.data.token) {
                // Guarda el token JWT en localStorage
                localStorage.setItem('userToken', response.data.token);

                // Guarda la información del usuario recién registrado
                localStorage.setItem('userInfo', JSON.stringify(response.data));

                // Actualiza el estado del usuario en el contexto
                setUser(response.data);

                // Redirige al carrito después del registro exitoso
                navigate('/cart');
            }

            return response;
        } catch (error) {
            console.error("Error en registro:", error);
            throw error;
        }
    };

    /**
     * Función para cerrar sesión
     *
     * Limpia todos los datos de autenticación del localStorage y del estado,
     * y redirige al usuario a la página principal.
     */
    const logout = () => {
        // Elimina el token JWT del almacenamiento local
        localStorage.removeItem('userToken');

        // Elimina la información del usuario del almacenamiento local
        localStorage.removeItem('userInfo');

        // Limpia el estado del usuario en el contexto
        setUser(null);

        // Redirige a la página principal
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {/* Solo renderiza los hijos cuando la carga inicial haya terminado */}
            {!loading && children}
        </AuthContext.Provider>
    );
};

/**
 * Hook personalizado para acceder al contexto de autenticación
 *
 * Simplifica el acceso al AuthContext desde cualquier componente.
 *
 * @returns {Object} Objeto con { user, loading, login, register, logout }
 *
 * Ejemplo de uso:
 * const { user, login, logout } = useAuth();
 * if (user) { ... }
 */
export const useAuth = () => useContext(AuthContext);