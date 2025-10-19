/**
 * ============================================
 * RUTAS DE LA API
 * ============================================
 */

import express from "express";
// Importar controladores
import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../controllers/auth.controller.js";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsWithGallery,
} from "../controllers/product.controller.js";
import {
  getAllOrders,
  getUserOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/order.controller.js";
import {
  getAllContent,
  getContentBySection,
  createContent,
  updateContent,
  deleteContent,
} from "../controllers/content.controller.js";
// Importar middlewares
import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/auth.middleware.js";

// Crear el router principal de Express
const router = express.Router();

/**
 * ========================================
 * RUTAS DE AUTENTICACIÓN
 * ========================================
 */
// Registro de nuevos usuarios
router.post("/auth/register", registerUser);
// Inicio de sesión
router.post("/auth/login", loginUser);
// Obtener perfil del usuario autenticado
router.get("/auth/profile", authMiddleware, getUserProfile);

/**
 * ========================================
 * RUTAS DE USUARIOS
 * ========================================
 */
// Obtener todos los usuarios
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
// Obtener un usuario específico por ID
router.get("/users/:id", authMiddleware, adminMiddleware, getUserById);
// Actualizar información de un usuario
router.put("/users/:id", authMiddleware, updateUser);
// Eliminar un usuario
router.delete("/users/:id", authMiddleware, adminMiddleware, deleteUser);

/**
 * ========================================
 * RUTAS DE PRODUCTOS
 * ========================================
 */
// Obtener todos los productos
router.get("/products", getProducts);
// Obtener productos por categoría con galería
router.get("/products/category/:category", getProductsWithGallery);
// Obtener detalles de un producto específico
router.get("/products/:id", getProductById);
// Crear un nuevo producto
router.post("/products", authMiddleware, adminMiddleware, createProduct);
// Actualizar un producto existente
router.put("/products/:id", authMiddleware, adminMiddleware, updateProduct);
// Eliminar un producto
router.delete("/products/:id", authMiddleware, adminMiddleware, deleteProduct);

/**
 * ========================================
 * RUTAS DE ÓRDENES
 * ========================================
 */
// Obtener todas las órdenes del sistema
router.get("/orders", authMiddleware, adminMiddleware, getAllOrders);
// Obtener órdenes del usuario autenticado
router.get("/orders/myorders", authMiddleware, getUserOrders);
// Obtener detalles de una orden específica
router.get("/orders/:id", authMiddleware, getOrderById);
// Crear una nueva orden
router.post("/orders", authMiddleware, createOrder);
// Actualizar el estado de una orden
router.put("/orders/:id", authMiddleware, adminMiddleware, updateOrderStatus);
// Eliminar una orden
router.delete("/orders/:id", authMiddleware, adminMiddleware, deleteOrder);

/**
 * ========================================
 * RUTAS DE CONTENIDO
 * ========================================
 */
// Obtener todo el contenido del sistema
router.get("/content", authMiddleware, adminMiddleware, getAllContent);
// Obtener contenido de una sección específica
router.get("/content/:sectionName", getContentBySection);
// Crear una nueva sección de contenido
router.post("/content", authMiddleware, adminMiddleware, createContent);
// Actualizar contenido existente
router.put("/content/:id", authMiddleware, adminMiddleware, updateContent);
// Eliminar una sección de contenido
router.delete("/content/:id", authMiddleware, adminMiddleware, deleteContent);

export default router;
