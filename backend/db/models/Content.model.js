/**
 * Modelo de Contenido
 *
 * Define el esquema de la colección 'contents' en MongoDB.
 * Este modelo gestiona el contenido dinámico de las páginas del sitio
 * como "Sobre Nosotros", galerías de imágenes, información de artistas, etc.
 *
 * El esquema es flexible (strict: false) para permitir diferentes estructuras
 * de contenido según la sección.
 */

import mongoose from 'mongoose';

/**
 * Esquema de Contenido
 *
 * Campos principales:
 * - section: Identificador único de la sección (ej: 'aboutUs', 'gallery')
 *           Solo puede existir un documento por sección
 * - title: Título principal de la sección (obligatorio)
 * - mainParagraph: Párrafo principal de la sección (opcional)
 *
 * Campos específicos para sección "Sobre Nosotros":
 * - artists: Información sobre los artistas
 *   - title: Título de la sección de artistas
 *   - imageUrl: URL de la imagen de los artistas
 *   - instagram: Enlaces a las cuentas de Instagram de Adriana y Yoel
 *   - paragraphs: Array de párrafos con la historia de los artistas
 *
 * Campos específicos para galerías:
 * - galleryImages: Map de categorías con arrays de imágenes
 *   Cada imagen contiene: id, title, brand, imageUrl, description
 *
 * NOTA: El esquema es flexible (strict: false) lo que permite agregar
 * campos adicionales sin necesidad de modificar el modelo.
 */
const contentSchema = new mongoose.Schema({
    section: {
        type: String,
        required: true,
        unique: true, // Solo puede haber un documento por sección (ej. 'aboutUs')
        // Ejemplos: 'aboutUs', 'gallery', 'home'
    },
    title: {
        type: String,
        required: true,
        // Título principal mostrado en la página
    },
    mainParagraph: {
        type: String
        // Párrafo introductorio de la sección (opcional)
    },
    // Estructura para información de artistas (usado en "Sobre Nosotros")
    artists: {
        title: String, // Título de la sección de artistas
        imageUrl: String, // URL de la imagen de los artistas
        instagram: {
            adriana: String, // URL de Instagram de Adriana
            yoel: String // URL de Instagram de Yoel
        },
        paragraphs: [String] // Array de párrafos con la biografía
    },
    // Estructura para galerías de imágenes (usado en secciones de portafolio)
    galleryImages: {
        type: Map, // Map permite agrupar por categorías dinámicamente
        of: [{
            id: Number, // ID único de la imagen
            title: String, // Título de la imagen/proyecto
            brand: String, // Marca o cliente del proyecto
            imageUrl: String, // URL de la imagen
            description: String // Descripción del proyecto
        }]
        // Ejemplo de estructura: { "GraphicDesign": [...], "Murals": [...] }
    }
}, {
    strict: false // Permite campos no definidos en el esquema (flexibilidad para diferentes secciones)
});

// Crear el modelo 'Content' a partir del esquema
const Content = mongoose.model('Content', contentSchema);

// Exportar el modelo para usarlo en controladores
export default Content;