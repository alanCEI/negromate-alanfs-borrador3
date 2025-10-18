/**
 * Modelo de Producto
 *
 * Define el esquema de la colección 'products' en MongoDB.
 * Este modelo gestiona el catálogo de productos/servicios creativos
 * que se ofrecen en Negromate Creatives.
 */

import mongoose from 'mongoose';

/**
 * Esquema de Producto
 *
 * Campos:
 * - name: Nombre del producto/servicio (obligatorio)
 * - category: Categoría del producto (GraphicDesign, CustomClothing, o Murals)
 * - price: Precio del producto en la moneda de la aplicación (obligatorio)
 * - imageUrl: URL de la imagen del producto (obligatorio)
 * - description: Descripción del producto (obligatorio)
 * - details: Array de detalles adicionales del producto (opcional)
 * - timestamps: Añade automáticamente createdAt y updatedAt
 */
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true // Elimina espacios en blanco al inicio y final
    },
    category: {
        type: String,
        required: true,
        // Solo acepta estas 3 categorías de servicios creativos
        enum: ['GraphicDesign', 'CustomClothing', 'Murals']
    },
    price: {
        type: Number,
        required: true
        // NOTA: El precio debe ser un número positivo (validado en el controlador)
    },
    imageUrl: {
        type: String,
        required: true
        // URL de la imagen que representa el producto (puede ser local o externa)
    },
    description: {
        type: String,
        required: true
        // Descripción general del producto mostrada en las tarjetas
    },
    details: {
        type: [String], // Array de strings con detalles adicionales
        default: [] // Por defecto es un array vacío
        // Usado para mostrar características específicas del producto
    }
}, {
    timestamps: true // Añade automáticamente createdAt y updatedAt
});

// Crear el modelo 'Product' a partir del esquema
const Product = mongoose.model('Product', productSchema);

// Exportar el modelo para usarlo en controladores
export default Product;