/**
 * Módulo de Configuración del Backend
 *
 * Este archivo centraliza todas las variables de entorno de la aplicación.
 * Carga las variables desde archivos .env según el ambiente de ejecución.
 */

import dotenv from 'dotenv';

// Cargar variables de entorno según el ambiente
// Si estamos en producción, usa .env.production, sino usa .env (desarrollo)
if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: '.env.production' });
} else {
    dotenv.config();
}

// Exportar las variables de entorno para ser usadas en toda la aplicación
// Puerto donde se ejecutará el servidor (por defecto 3000)
export const PORT = process.env.PORT || 3000;

// Credenciales de MongoDB Atlas
export const DB_USER = process.env.DB_USER; // Usuario de la base de datos
export const DB_PASS = process.env.DB_PASS; // Contraseña de la base de datos
export const CLUSTER = process.env.CLUSTER; // URL del cluster de MongoDB Atlas
export const DATABASE = process.env.DATABASE; // Nombre de la base de datos

// Clave secreta para firmar tokens JWT (autenticación)
export const JWT_SECRET = process.env.JWT_SECRET;