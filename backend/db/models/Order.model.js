/**
 * Modelo de Orden/Pedido
 *
 * Define el esquema de la colección 'orders' en MongoDB.
 * Este modelo gestiona los pedidos realizados por los usuarios,
 * incluyendo los productos comprados, cantidades y estados del pedido.
 */

import mongoose from 'mongoose';
const { Schema } = mongoose;

/**
 * Esquema de Item de Orden
 *
 * Representa cada producto dentro de una orden/pedido.
 * Campos:
 * - product: Referencia al producto (ObjectId que apunta a la colección 'products')
 * - quantity: Cantidad de unidades del producto (mínimo 1)
 * - price: Precio unitario del producto al momento de la compra
 *          (se guarda aquí para mantener el historial, aunque el precio cambie después)
 */
const orderItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product', // Relación con el modelo Product
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1 // Mínimo 1 unidad
    },
    price: {
        type: Number,
        required: true
        // Precio unitario guardado en el momento de la compra
    }
});

/**
 * Esquema de Orden/Pedido
 *
 * Campos:
 * - user: Referencia al usuario que realizó el pedido (ObjectId)
 * - items: Array de productos incluidos en el pedido (OrderItem)
 * - totalAmount: Monto total del pedido (suma de price * quantity de todos los items)
 * - status: Estado del pedido (pending, completed, o cancelled)
 * - timestamps: Añade automáticamente createdAt y updatedAt
 */
const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Relación con el modelo User
        required: true
    },
    items: [orderItemSchema], // Array de items del pedido
    totalAmount: {
        type: Number,
        required: true
        // Monto total calculado en el controlador antes de crear la orden
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'], // Estados posibles
        default: 'pending' // Por defecto, toda orden nueva está pendiente
    }
}, {
    timestamps: true // Añade automáticamente createdAt y updatedAt
});

// Crear el modelo 'Order' a partir del esquema
const Order = mongoose.model('Order', orderSchema);

// Exportar el modelo para usarlo en controladores
export default Order;