/**
 * ============================================
 * MongoDB
 * ============================================
 */

import mongoose from "mongoose";
import { DB_USER, DB_PASS, CLUSTER, DATABASE } from "../config/config.js";
import { mockData } from "./data.mock.js";
import Content from "./models/Content.model.js";
import Product from "./models/Product.model.js";

// Conecta la app a MongoDB
export const connectDB = async () => {
  // URL de conexión a MongoDB
  const url = `mongodb+srv://${DB_USER}:${DB_PASS}@${CLUSTER}/${DATABASE}?retryWrites=true&w=majority`;

  try {
    // Conectar a MongoDB
    await mongoose.connect(url);
    console.log("✅ Conectado a MongoDB Atlas");
    console.log(`DB: ${mongoose.connection.db.databaseName}`);
    await populateDatabase();
  } catch (error) {
    // Si hay un error en la conexión, error
    console.error(`❌ Error al conectar con MongoDB: ${error}`);
    process.exit(1);
  }
};

// Datos iniciales con mockData
const populateDatabase = async () => {
  try {
    // Verificar si ya existe contenido en Content
    const contentCount = await Content.countDocuments();
    if (contentCount === 0) {
      // Si no hay contenido, insertar los datos con mockData
      await Content.insertMany(mockData.content);
      console.log("📚 Contenido inicial insertado en la base de datos.");
    }
    // Verificar si ya existen productos en Product
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      // Si no hay productos, insertar los productos con mockData
      await Product.insertMany(mockData.products);
      console.log("🛍️ Productos iniciales insertados en la base de datos.");
    }
  } catch (error) {
    // Si hay un error al insertar info, error
    console.error("🔥 Error al poblar la base de datos:", error);
  }
};
