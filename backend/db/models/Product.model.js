/**
 * ============================================
 * Esquema de Producto
 * ============================================
 */

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["GraphicDesign", "CustomClothing", "Murals"],
    },
    price: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    details: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);
// Crear el modelo Product
const Product = mongoose.model("Product", productSchema);

export default Product;
