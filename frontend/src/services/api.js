/**
 * api.js - Servicio de Comunicación con el Backend
 *
 * Este módulo centraliza todas las peticiones HTTP al backend de la aplicación.
 * Proporciona una interfaz unificada para interactuar con la API REST del servidor,
 * gestionando automáticamente:
 * - Construcción de URLs
 * - Headers de autenticación (JWT tokens)
 * - Serialización/deserialización de JSON
 * - Manejo de errores HTTP
 *
 * Arquitectura:
 * - apiRequest(): Función genérica de bajo nivel para hacer peticiones HTTP
 * - api: Objeto con métodos organizados por recurso (auth, products, content, orders)
 *
 * Configuración:
 * - La URL base del backend se obtiene de la variable de entorno VITE_API_URL
 * - Automáticamente agrega el prefijo /api si no está presente en BASE_URL
 * - Soporta autenticación JWT mediante el header Authorization: Bearer <token>
 *
 * @module services/api
 */

// ===== CONFIGURACIÓN =====
// Obtener la URL base del backend desde las variables de entorno de Vite
// Ejemplo: http://localhost:3000 o https://negromate-backend.vercel.app
const BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Procesa y maneja las respuestas HTTP de la API
 *
 * Esta función auxiliar se encarga de:
 * 1. Parsear el JSON de la respuesta
 * 2. Verificar si la respuesta fue exitosa (response.ok)
 * 3. Lanzar un error con el mensaje apropiado si falló
 *
 * @param {Response} response - Objeto Response de fetch()
 * @returns {Promise<Object>} Los datos parseados de la respuesta si fue exitosa
 * @throws {Error} Si la respuesta HTTP no fue exitosa (status >= 400)
 */
const handleResponse = async (response) => {
    // Parsear el cuerpo de la respuesta como JSON
    const data = await response.json();

    // Si la respuesta no fue exitosa (códigos 4xx o 5xx)
    if (!response.ok) {
        // Extraer el mensaje de error del backend o usar el statusText por defecto
        const error = (data && data.msg) || response.statusText;
        throw new Error(error);
    }

    // Retornar los datos si todo salió bien
    return data;
};

/**
 * Función genérica para realizar peticiones HTTP a la API
 *
 * Esta es la función central que todas las demás funciones de la API utilizan.
 * Maneja automáticamente:
 * - Construcción de URLs (agrega /api si es necesario)
 * - Configuración de headers (Content-Type, Authorization)
 * - Serialización del body a JSON
 * - Manejo de errores
 *
 * @param {string} endpoint - Ruta del endpoint (ej: 'auth/login', 'products', 'orders/myorders')
 * @param {string} [method='GET'] - Método HTTP: 'GET', 'POST', 'PUT', 'DELETE', etc.
 * @param {Object|null} [body=null] - Datos a enviar en el cuerpo de la petición (se serializa a JSON)
 * @param {string|null} [token=null] - Token JWT para autenticación (se agrega como Bearer token)
 * @param {Object} [options={}] - Opciones adicionales de fetch (ej: signal para AbortController)
 * @returns {Promise<Object>} Los datos de la respuesta parseados
 * @throws {Error} Si la petición falla o el servidor retorna un error
 *
 * @example
 * // GET sin autenticación
 * const products = await apiRequest('products', 'GET');
 *
 * @example
 * // POST con autenticación
 * const order = await apiRequest('orders', 'POST', orderData, userToken);
 *
 * @example
 * // GET con AbortController para cancelación
 * const controller = new AbortController();
 * const data = await apiRequest('products', 'GET', null, null, { signal: controller.signal });
 */
export const apiRequest = async (endpoint, method = 'GET', body = null, token = null, options = {}) => {
    // ===== CONSTRUCCIÓN DE LA URL =====
    // Normalizar BASE_URL removiendo la barra final si existe
    // Ejemplo: "http://localhost:3000/" -> "http://localhost:3000"
    let baseUrl = BASE_URL.replace(/\/$/, '');

    // Asegurar que la URL siempre incluya el prefijo /api
    // Si BASE_URL ya incluye /api, no se duplica
    if (!baseUrl.endsWith('/api')) {
        baseUrl = `${baseUrl}/api`;
    }

    // Construir la URL final evitando barras dobles
    // Ejemplo: "http://localhost:3000/api" + "auth/login" -> "http://localhost:3000/api/auth/login"
    const url = `${baseUrl}/${endpoint.replace(/^\//, '')}`;

    // ===== CONFIGURACIÓN DE HEADERS =====
    const headers = {
        'Content-Type': 'application/json',  // Indicar que enviamos y esperamos JSON
        'accept': 'application/json',        // Solicitar respuesta en formato JSON
    };

    // Si se proporciona un token JWT, agregarlo al header Authorization
    // Formato estándar: "Bearer <token>"
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // ===== CONFIGURACIÓN DE FETCH =====
    const fetchOptions = {
        method,   // Método HTTP (GET, POST, PUT, DELETE, etc.)
        headers,  // Headers configurados arriba
        ...options, // Spread de opciones adicionales (ej: signal, credentials, etc.)
    };

    // Si hay un body, serializarlo a JSON y agregarlo a las opciones
    // Solo se agrega body en métodos POST, PUT, PATCH
    if (body) {
        fetchOptions.body = JSON.stringify(body);
    }

    // ===== EJECUCIÓN DE LA PETICIÓN =====
    try {
        const response = await fetch(url, fetchOptions);
        return handleResponse(response);
    } catch (error) {
        // Loguear el error en consola para debugging
        console.error('API request error:', error);
        // Re-lanzar el error para que el componente que llamó pueda manejarlo
        throw error;
    }
};

/**
 * Objeto con todos los servicios de la API organizados por recurso
 *
 * Cada propiedad representa un recurso del backend (auth, products, content, orders)
 * y contiene métodos específicos para interactuar con ese recurso.
 * Todos los métodos internamente utilizan apiRequest().
 *
 * Estructura:
 * api.{recurso}.{acción}(params)
 *
 * @namespace api
 */
export const api = {
    /**
     * Servicios relacionados con autenticación
     * @namespace api.auth
     */
    auth: {
        /**
         * Iniciar sesión de usuario
         *
         * @param {Object} credentials - Credenciales de acceso
         * @param {string} credentials.email - Email del usuario
         * @param {string} credentials.password - Contraseña del usuario
         * @param {Object} [options={}] - Opciones adicionales de fetch
         * @returns {Promise<Object>} Objeto con token JWT y datos del usuario
         * @throws {Error} Si las credenciales son inválidas
         *
         * @example
         * const result = await api.auth.login({ email: 'user@example.com', password: '123456' });
         * // result = { token: 'jwt...', user: { id, email, username, role } }
         */
        login: (credentials, options = {}) => apiRequest('auth/login', 'POST', credentials, null, options),

        /**
         * Registrar un nuevo usuario
         *
         * @param {Object} userData - Datos del nuevo usuario
         * @param {string} userData.username - Nombre de usuario
         * @param {string} userData.email - Email del usuario
         * @param {string} userData.password - Contraseña del usuario
         * @param {Object} [options={}] - Opciones adicionales de fetch
         * @returns {Promise<Object>} Objeto con token JWT y datos del usuario creado
         * @throws {Error} Si el email ya existe o los datos son inválidos
         *
         * @example
         * const result = await api.auth.register({
         *   username: 'juan123',
         *   email: 'juan@example.com',
         *   password: 'securepass'
         * });
         */
        register: (userData, options = {}) => apiRequest('auth/register', 'POST', userData, null, options),

        /**
         * Obtener el perfil del usuario autenticado
         *
         * @param {string} token - Token JWT del usuario
         * @param {Object} [options={}] - Opciones adicionales de fetch
         * @returns {Promise<Object>} Datos del perfil del usuario
         * @throws {Error} Si el token es inválido o ha expirado
         *
         * @example
         * const profile = await api.auth.getProfile(userToken);
         * // profile = { id, username, email, role, createdAt }
         */
        getProfile: (token, options = {}) => apiRequest('auth/profile', 'GET', null, token, options),
    },

    /**
     * Servicios relacionados con productos
     * @namespace api.products
     */
    products: {
        /**
         * Obtener lista de productos, opcionalmente filtrados por categoría
         *
         * @param {string} [category=''] - Categoría para filtrar (GraphicDesign, CustomClothing, Murals)
         * @param {Object} [options={}] - Opciones adicionales de fetch
         * @returns {Promise<Array>} Array de productos
         *
         * @example
         * // Obtener todos los productos
         * const allProducts = await api.products.get();
         *
         * @example
         * // Obtener solo productos de diseño gráfico
         * const designProducts = await api.products.get('GraphicDesign');
         */
        get: (category = '', options = {}) => apiRequest(`products${category ? `?category=${category}` : ''}`, 'GET', null, null, options),

        /**
         * Obtener un producto específico por su ID
         *
         * @param {string} id - ID del producto (MongoDB ObjectId)
         * @param {Object} [options={}] - Opciones adicionales de fetch
         * @returns {Promise<Object>} Datos del producto
         * @throws {Error} Si el producto no existe
         *
         * @example
         * const product = await api.products.getById('507f1f77bcf86cd799439011');
         */
        getById: (id, options = {}) => apiRequest(`products/${id}`, 'GET', null, null, options),

        /**
         * Obtener productos de una categoría con información de galería
         *
         * @param {string} category - Categoría (GraphicDesign, CustomClothing, Murals)
         * @param {Object} [options={}] - Opciones adicionales de fetch
         * @returns {Promise<Object>} Objeto con productos y datos de galería
         *
         * @example
         * const gallery = await api.products.getWithGallery('Murals');
         * // gallery = { products: [...], category: 'Murals', ... }
         */
        getWithGallery: (category, options = {}) => apiRequest(`products/category/${category}`, 'GET', null, null, options),
    },

    /**
     * Servicios relacionados con contenido dinámico
     * @namespace api.content
     */
    content: {
        /**
         * Obtener contenido dinámico de una sección específica
         *
         * @param {string} sectionName - Nombre de la sección (ej: 'aboutUs', 'contact')
         * @param {Object} [options={}] - Opciones adicionales de fetch
         * @returns {Promise<Object>} Datos del contenido de la sección
         * @throws {Error} Si la sección no existe
         *
         * @example
         * const aboutContent = await api.content.get('aboutUs');
         * // aboutContent = { section: 'aboutUs', title: '...', content: '...', ... }
         */
        get: (sectionName, options = {}) => apiRequest(`content/${sectionName}`, 'GET', null, null, options),
    },

    /**
     * Servicios relacionados con órdenes/pedidos
     * @namespace api.orders
     */
    orders: {
        /**
         * Crear una nueva orden de compra
         *
         * @param {Object} orderData - Datos de la orden
         * @param {Array} orderData.items - Array de items: [{ product: productId, quantity, price }]
         * @param {number} orderData.totalAmount - Monto total de la orden
         * @param {string} token - Token JWT del usuario autenticado
         * @param {Object} [options={}] - Opciones adicionales de fetch
         * @returns {Promise<Object>} Orden creada con su ID y estado
         * @throws {Error} Si el usuario no está autenticado o los datos son inválidos
         *
         * @example
         * const order = await api.orders.create({
         *   items: [
         *     { product: '507f...', quantity: 2, price: 25.00 },
         *     { product: '607g...', quantity: 1, price: 50.00 }
         *   ],
         *   totalAmount: 100.00
         * }, userToken);
         */
        create: (orderData, token, options = {}) => apiRequest('orders', 'POST', orderData, token, options),

        /**
         * Obtener todas las órdenes del usuario autenticado
         *
         * @param {string} token - Token JWT del usuario
         * @param {Object} [options={}] - Opciones adicionales de fetch
         * @returns {Promise<Array>} Array de órdenes del usuario
         * @throws {Error} Si el usuario no está autenticado
         *
         * @example
         * const myOrders = await api.orders.getMyOrders(userToken);
         * // myOrders = [{ _id, items, totalAmount, status, createdAt, ... }, ...]
         */
        getMyOrders: (token, options = {}) => apiRequest('orders/myorders', 'GET', null, token, options)
    }
};