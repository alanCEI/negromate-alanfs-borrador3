/**
 * ============================================
 * Módulo de Configuración del Backend
 * ============================================
 */

import dotenv from "dotenv";

// Cargar variables de entorno para desarrollo y producción
if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config();
}
// Puerto donde se ejecutará el servidor
export const PORT = process.env.PORT || 3000;
// MongoDB Atlas
export const DB_USER = process.env.DB_USER;
export const DB_PASS = process.env.DB_PASS;
export const CLUSTER = process.env.CLUSTER;
export const DATABASE = process.env.DATABASE;
// Clave secreta para tokens JWT (autenticación)
export const JWT_SECRET = process.env.JWT_SECRET;
