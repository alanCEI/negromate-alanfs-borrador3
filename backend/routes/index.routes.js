/**
 * ============================================
 * DEFINICIÓN DE RUTAS DE LA API
 * ============================================
 *
 * Este archivo centraliza todas las rutas de la aplicación.
 * Define los endpoints disponibles, sus métodos HTTP y qué controladores los manejan.
 * También especifica qué rutas requieren autenticación y/o privilegios de administrador.
 *
 * Estructura de la API:
 * - /api/auth - Autenticación de usuarios (registro, login, perfil)
 * - /api/users - Gestión de usuarios (solo admin)
 * - /api/products - Catálogo de productos y servicios
 * - /api/orders - Gestión de pedidos
 * - /api/content - Contenido dinámico de las páginas
 *
 * Middlewares de protección:
 * - authMiddleware: Verifica que el usuario esté autenticado (tiene token JWT válido)
 * - adminMiddleware: Verifica que el usuario sea administrador (requiere authMiddleware primero)
 *
 * @module routes/index
 * @requires express - Framework de enrutamiento
 * @requires ../controllers/* - Controladores con la lógica de negocio
 * @requires ../middlewares/auth.middleware - Middlewares de autenticación y autorización
 */

import express from 'express';

// Importar controladores
import { registerUser, loginUser, getUserProfile } from '../controllers/auth.controller.js';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/user.controller.js';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getProductsWithGallery } from '../controllers/product.controller.js';
import { getAllOrders, getUserOrders, getOrderById, createOrder, updateOrderStatus, deleteOrder } from '../controllers/order.controller.js';
import { getAllContent, getContentBySection, createContent, updateContent, deleteContent } from '../controllers/content.controller.js';

// Importar middlewares
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware.js';

// Crear el router principal de Express
const router = express.Router();

/**
 * ========================================
 * RUTAS DE AUTENTICACIÓN (/api/auth)
 * ========================================
 *
 * Endpoints relacionados con el sistema de autenticación y gestión de sesiones.
 * Permiten a los usuarios crear cuentas, iniciar sesión y obtener su información.
 */

// POST /api/auth/register - Registro de nuevos usuarios
// Crea una nueva cuenta de usuario en el sistema
// Body requerido: { username, email, password }
router.post('/auth/register', registerUser);

// POST /api/auth/login - Inicio de sesión
// Autentica un usuario y devuelve un token JWT
// Body requerido: { email, password }
router.post('/auth/login', loginUser);

// GET /api/auth/profile - Obtener perfil del usuario autenticado
// Protegida: Requiere token JWT válido
// Devuelve la información completa del usuario actual (sin contraseña)
router.get('/auth/profile', authMiddleware, getUserProfile);

/**
 * ========================================
 * RUTAS DE USUARIOS (/api/users)
 * ========================================
 *
 * Endpoints para administrar usuarios del sistema.
 * La mayoría requieren privilegios de administrador para proteger datos sensibles.
 */

// GET /api/users - Obtener todos los usuarios
// Protegida: Solo administradores
// Devuelve un array con todos los usuarios registrados
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);

// GET /api/users/:id - Obtener un usuario específico por ID
// Protegida: Solo administradores
// Parámetro de ruta: id (MongoDB ObjectId del usuario)
router.get('/users/:id', authMiddleware, adminMiddleware, getUserById);

// PUT /api/users/:id - Actualizar información de un usuario
// Protegida: Usuario autenticado (puede actualizar sus propios datos)
// Parámetro de ruta: id (MongoDB ObjectId del usuario)
// Body: Campos a actualizar (username, email, etc.)
router.put('/users/:id', authMiddleware, updateUser);

// DELETE /api/users/:id - Eliminar un usuario
// Protegida: Solo administradores
// Parámetro de ruta: id (MongoDB ObjectId del usuario)
router.delete('/users/:id', authMiddleware, adminMiddleware, deleteUser);

/**
 * ========================================
 * RUTAS DE PRODUCTOS (/api/products)
 * ========================================
 *
 * Endpoints para gestionar el catálogo de productos y servicios.
 * Incluye paquetes de diseño gráfico, ropa personalizada y murales.
 *
 * Nota: Las rutas de consulta (GET) son públicas para que los visitantes
 * puedan ver el catálogo. Las operaciones de modificación son solo para admins.
 */

// GET /api/products - Obtener todos los productos
// Pública: No requiere autenticación
// Devuelve el catálogo completo de productos disponibles
router.get('/products', getProducts);

// GET /api/products/category/:category - Obtener productos por categoría con galería
// Pública: No requiere autenticación
// Parámetro de ruta: category (GraphicDesign, CustomClothing, Murals)
// Incluye imágenes de galería relacionadas con la categoría
router.get('/products/category/:category', getProductsWithGallery);

// GET /api/products/:id - Obtener detalles de un producto específico
// Pública: No requiere autenticación
// Parámetro de ruta: id (MongoDB ObjectId del producto)
router.get('/products/:id', getProductById);

// POST /api/products - Crear un nuevo producto
// Protegida: Solo administradores
// Body requerido: { name, category, price, imageUrl, description, details[] }
router.post('/products', authMiddleware, adminMiddleware, createProduct);

// PUT /api/products/:id - Actualizar un producto existente
// Protegida: Solo administradores
// Parámetro de ruta: id (MongoDB ObjectId del producto)
// Body: Campos a actualizar
router.put('/products/:id', authMiddleware, adminMiddleware, updateProduct);

// DELETE /api/products/:id - Eliminar un producto
// Protegida: Solo administradores
// Parámetro de ruta: id (MongoDB ObjectId del producto)
router.delete('/products/:id', authMiddleware, adminMiddleware, deleteProduct);

/**
 * ========================================
 * RUTAS DE ÓRDENES (/api/orders)
 * ========================================
 *
 * Endpoints para gestionar pedidos de clientes.
 * Los usuarios pueden crear y ver sus propios pedidos.
 * Los administradores tienen acceso completo a todas las órdenes.
 */

// GET /api/orders - Obtener todas las órdenes del sistema
// Protegida: Solo administradores
// Útil para el panel de administración y reportes
router.get('/orders', authMiddleware, adminMiddleware, getAllOrders);

// GET /api/orders/myorders - Obtener órdenes del usuario autenticado
// Protegida: Usuario autenticado
// Devuelve solo las órdenes creadas por el usuario actual
// IMPORTANTE: Esta ruta debe ir ANTES de /orders/:id para evitar conflictos
router.get('/orders/myorders', authMiddleware, getUserOrders);

// GET /api/orders/:id - Obtener detalles de una orden específica
// Protegida: Usuario autenticado
// Los usuarios solo pueden ver sus propias órdenes (verificado en el controlador)
// Parámetro de ruta: id (MongoDB ObjectId de la orden)
router.get('/orders/:id', authMiddleware, getOrderById);

// POST /api/orders - Crear una nueva orden
// Protegida: Usuario autenticado
// Body requerido: { items: [{ product, quantity, price }], totalAmount }
router.post('/orders', authMiddleware, createOrder);

// PUT /api/orders/:id - Actualizar el estado de una orden
// Protegida: Solo administradores
// Parámetro de ruta: id (MongoDB ObjectId de la orden)
// Body: { status: 'pending' | 'completed' | 'cancelled' }
router.put('/orders/:id', authMiddleware, adminMiddleware, updateOrderStatus);

// DELETE /api/orders/:id - Eliminar una orden
// Protegida: Solo administradores
// Parámetro de ruta: id (MongoDB ObjectId de la orden)
router.delete('/orders/:id', authMiddleware, adminMiddleware, deleteOrder);

/**
 * ========================================
 * RUTAS DE CONTENIDO (/api/content)
 * ========================================
 *
 * Endpoints para gestionar contenido dinámico de las páginas.
 * Permite actualizar textos, imágenes y otros contenidos sin modificar código.
 * Útil para páginas como "Sobre Nosotros", FAQ, banners, etc.
 */

// GET /api/content - Obtener todo el contenido del sistema
// Protegida: Solo administradores
// Devuelve todas las secciones de contenido para gestión
router.get('/content', authMiddleware, adminMiddleware, getAllContent);

// GET /api/content/:sectionName - Obtener contenido de una sección específica
// Pública: No requiere autenticación
// Parámetro de ruta: sectionName (ej: 'aboutUs', 'homepage', 'faq')
// Usado por el frontend para cargar contenido dinámico de las páginas
router.get('/content/:sectionName', getContentBySection);

// POST /api/content - Crear una nueva sección de contenido
// Protegida: Solo administradores
// Body requerido: { section, title, mainParagraph, ... }
router.post('/content', authMiddleware, adminMiddleware, createContent);

// PUT /api/content/:id - Actualizar contenido existente
// Protegida: Solo administradores
// Parámetro de ruta: id (MongoDB ObjectId del contenido)
// Body: Campos a actualizar
router.put('/content/:id', authMiddleware, adminMiddleware, updateContent);

// DELETE /api/content/:id - Eliminar una sección de contenido
// Protegida: Solo administradores
// Parámetro de ruta: id (MongoDB ObjectId del contenido)
router.delete('/content/:id', authMiddleware, adminMiddleware, deleteContent);

// Exportar el router para ser usado en index.js
export default router;
