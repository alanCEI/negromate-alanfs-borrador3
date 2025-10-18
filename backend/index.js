/**
 * ============================================
 * SERVIDOR PRINCIPAL DE NEGROMATE CREATIVES
 * ============================================
 *
 * Este archivo es el punto de entrada de la aplicación backend.
 * Configura y ejecuta el servidor Express con todas sus dependencias,
 * middlewares y rutas de la API.
 *
 * Responsabilidades principales:
 * - Inicializar el servidor Express
 * - Configurar middlewares globales (CORS, parseo de JSON, archivos estáticos)
 * - Conectar a la base de datos MongoDB Atlas
 * - Registrar todas las rutas de la API
 * - Manejar errores globales
 *
 * @module index
 * @requires express - Framework web para Node.js
 * @requires cors - Middleware para habilitar Cross-Origin Resource Sharing
 * @requires ./config/config - Variables de configuración del entorno
 * @requires ./db/mongoose - Conexión a MongoDB Atlas
 * @requires ./middlewares/error.middleware - Middleware centralizado de errores
 * @requires ./routes/index.routes - Todas las rutas de la API
 */

import express from 'express';
import cors from 'cors';
import { PORT } from './config/config.js';
import { connectDB } from './db/mongoose.js';
import errorMiddleware from './middlewares/error.middleware.js';

// Importar Rutas
import apiRoutes from './routes/index.routes.js';

// Inicializar la aplicación Express
const app = express();

/**
 * ============================================
 * CONFIGURACIÓN DE MIDDLEWARES
 * ============================================
 * Los middlewares se ejecutan en orden secuencial para cada petición HTTP.
 * Es importante mantener el orden correcto para el funcionamiento adecuado.
 */

// CORS (Cross-Origin Resource Sharing)
// Permite que el frontend (ejecutándose en otro dominio/puerto) pueda hacer peticiones a esta API
// Sin esto, los navegadores bloquearían las peticiones por política de seguridad
app.use(cors());

// Parser de JSON
// Transforma el body de las peticiones que vienen en formato JSON a objetos JavaScript
// Necesario para recibir datos en POST, PUT, PATCH (ej: req.body)
app.use(express.json());

// Parser de URL encoded
// Permite procesar datos que vienen en formato application/x-www-form-urlencoded
// El parámetro extended:true permite procesar objetos anidados y arrays
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
// Expone la carpeta 'public' para servir imágenes, CSS, JS u otros recursos estáticos
// Los archivos se acceden directamente: http://localhost:3000/images/logo.png
app.use(express.static('public'));

/**
 * ============================================
 * DEFINICIÓN DE RUTAS
 * ============================================
 */

// Ruta raíz - Health check del servidor
// Sirve para verificar que el servidor está funcionando correctamente
app.get('/', (req, res) => {
    res.json({ message: 'API de Negromate Creatives funcionando correctamente' });
});

// Rutas de la API
// Todas las rutas definidas en index.routes.js estarán bajo el prefijo '/api'
// Ej: /api/auth/login, /api/products, /api/orders, etc.
app.use('/api', apiRoutes);

/**
 * ============================================
 * MIDDLEWARE DE MANEJO DE ERRORES
 * ============================================
 * IMPORTANTE: Este middleware DEBE ir al final, después de todas las rutas.
 * Captura cualquier error que ocurra en las rutas y controladores,
 * formateándolo en una respuesta JSON consistente.
 */
app.use(errorMiddleware);

/**
 * Función para iniciar el servidor
 *
 * Esta función asíncrona realiza dos tareas críticas en orden:
 * 1. Conecta a la base de datos MongoDB Atlas
 * 2. Inicia el servidor Express en el puerto especificado
 *
 * El servidor solo se inicia después de una conexión exitosa a la BD,
 * garantizando que la aplicación no acepte peticiones si no hay acceso a datos.
 */
const startServer = async () => {
    // Conectar a MongoDB Atlas
    // Esta función también inicializa datos de prueba si es la primera vez
    await connectDB();

    // Iniciar el servidor HTTP en el puerto configurado
    // El puerto viene de las variables de entorno (.env)
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
};

// Ejecutar la función de inicio del servidor
startServer();