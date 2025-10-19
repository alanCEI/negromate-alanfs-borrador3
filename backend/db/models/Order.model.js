/**
 * ============================================
 * Esquema del Item de la Orden
 * ============================================
 */

import mongoose from "mongoose";

const { Schema } = mongoose;
const orderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});
/**
 * ============================================
 * Esquema del Orden
 * ============================================
 */
const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);
// Crear el modelo Order
const Order = mongoose.model("Order", orderSchema);

export default Order;
