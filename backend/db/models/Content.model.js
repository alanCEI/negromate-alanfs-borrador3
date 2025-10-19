/**
 * ============================================
 * Esquema de Contenido
 * ============================================
 */

import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    mainParagraph: {
      type: String,
    },
    // Estructura para información de artistas
    artists: {
      title: String,
      imageUrl: String,
      instagram: {
        adriana: String,
        yoel: String,
      },
      paragraphs: [String],
    },
    // Estructura para galerías de imágenes
    galleryImages: {
      type: Map,
      of: [
        {
          id: Number,
          title: String,
          brand: String,
          imageUrl: String,
          description: String,
        },
      ],
    },
  },
  {
    strict: false,
  }
);
// Crear el modelo Content
const Content = mongoose.model("Content", contentSchema);

export default Content;
