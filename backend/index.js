/** 
 * ============================================
 * SERVIDOR PRINCIPAL DE NEGROMATE CREATIVES
 * ============================================
 */

import express from "express";
import cors from "cors";
import { PORT } from "./config/config.js";
import { connectDB } from "./db/mongoose.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import apiRoutes from "./routes/index.routes.js";

// Iniciar Express
const app = express();

/**
 * ============================================
 * CONFIGURACIÓN DE MIDDLEWARES
 * ============================================
 */
// Permite que el frontend pueda hacer peticiones a la API
app.use(cors());
// Parser de JSON
app.use(express.json());
// Parser de URL encoded
app.use(express.urlencoded({ extended: true }));
// Archivos estáticos
app.use(express.static("public"));

/**
 * ============================================
 * DEFINICIÓN DE RUTAS
 * ============================================
 */
// verificar que el servidor está funcionando correctamente
app.get("/", (req, res) => {
  res.json({ message: "API de Negromate Creatives funcionando correctamente" });
});
// Rutas de la API
app.use("/api", apiRoutes);

/**
 * ============================================
 * MIDDLEWARE DE MANEJO DE ERRORES
 * ============================================
 */
app.use(errorMiddleware);
// Función para iniciar el servidor
const startServer = async () => {
  // Conectar a MongoDB Atlas
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
};

startServer();
