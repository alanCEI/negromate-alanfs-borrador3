/**
 * Módulo de Conexión a MongoDB
 *
 * Este archivo gestiona la conexión a la base de datos MongoDB Atlas
 * y la población automática de datos iniciales cuando la base de datos está vacía.
 */

import mongoose from 'mongoose';
import { DB_USER, DB_PASS, CLUSTER, DATABASE } from '../config/config.js';
import { mockData } from './data.mock.js';
import Content from './models/Content.model.js';
import Product from './models/Product.model.js';

/**
 * Conecta la aplicación a MongoDB Atlas
 *
 * - Construye la URL de conexión usando las variables de entorno
 * - Intenta establecer la conexión con Mongoose
 * - Si la conexión es exitosa, puebla la base de datos con datos iniciales
 * - Si falla, detiene la aplicación con process.exit(1)
 */
export const connectDB = async () => {
    // Construir la URL de conexión a MongoDB Atlas
    const url = `mongodb+srv://${DB_USER}:${DB_PASS}@${CLUSTER}/${DATABASE}?retryWrites=true&w=majority`;

    try {
        // Intentar conectar a MongoDB
        await mongoose.connect(url);
        console.log("✅ Conectado a MongoDB Atlas");
        console.log(`DB: ${mongoose.connection.db.databaseName}`);

        // Poblar la base de datos si está vacía (solo en primera ejecución)
        await populateDatabase();

    } catch (error) {
        // Si hay un error en la conexión, mostrar el error y detener la app
        console.error(`❌ Error al conectar con MongoDB: ${error}`);
        process.exit(1); // Detiene la aplicación si no se puede conectar a la DB
    }
};

/**
 * Pobla la base de datos con datos iniciales
 *
 * Esta función se ejecuta automáticamente después de conectar a la base de datos.
 * Verifica si existen datos en las colecciones de Content y Product.
 * Si están vacías, inserta los datos mock predefinidos.
 *
 * Esto es útil para:
 * - Primera ejecución de la aplicación
 * - Ambientes de desarrollo y testing
 * - Asegurar que siempre haya contenido disponible en el sitio
 */
const populateDatabase = async () => {
    try {
        // Verificar si ya existe contenido en la colección Content
        const contentCount = await Content.countDocuments();
        if (contentCount === 0) {
            // Si no hay contenido, insertar los datos mock (About Us, etc.)
            await Content.insertMany(mockData.content);
            console.log("📚 Contenido inicial insertado en la base de datos.");
        }

        // Verificar si ya existen productos en la colección Product
        const productCount = await Product.countDocuments();
        if (productCount === 0) {
            // Si no hay productos, insertar los productos mock
            await Product.insertMany(mockData.products);
            console.log("🛍️ Productos iniciales insertados en la base de datos.");
        }

    } catch (error) {
        // Si hay un error al poblar, mostrar el error pero no detener la app
        console.error("🔥 Error al poblar la base de datos:", error);
    }
};