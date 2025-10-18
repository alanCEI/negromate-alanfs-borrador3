/**
 * Controlador de Contenido
 *
 * Este controlador maneja contenido dinámico de la aplicación (textos, secciones, etc.).
 * Permite crear, obtener, actualizar y eliminar contenido de páginas como "About Us".
 * Integra tanto contenido de base de datos como datos mock para galerías de imágenes.
 * El contenido está organizado por secciones identificadas por nombres únicos.
 */

import Content from '../db/models/Content.model.js';
import { mockData } from '../db/data.mock.js';

/**
 * Obtener todo el contenido
 *
 * Ruta: GET /api/content
 * Autenticación: Requerida (Solo Admin)
 *
 * @param {Object} req - Objeto de petición Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} JSON con lista de todo el contenido del sistema
 *
 * Descripción: Obtiene todas las secciones de contenido almacenadas en la base de datos.
 * Solo accesible por administradores para gestión del contenido.
 */
export const getAllContent = async (req, res, next) => {
    const ResponseAPI = {
        msg: "Contenido obtenido",
        data: [],
        status: 'ok'
    };

    try {
        // Buscar todo el contenido en la base de datos
        const content = await Content.find({});
        ResponseAPI.data = content;
        res.status(200).json(ResponseAPI);
    } catch (error) {
        next(error);
    }
};


/**
 * Obtener contenido de una sección específica
 *
 * Ruta: GET /api/content/:sectionName
 * Autenticación: No requerida (Público)
 *
 * @param {Object} req - Objeto de petición Express
 * @param {string} req.params.sectionName - Nombre de la sección (ej: 'aboutUs', 'gallery-graphicDesign')
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} JSON con el contenido de la sección o error 404 si no existe
 *
 * Descripción: Obtiene contenido de una sección específica. Tiene lógica especial
 * para galerías: si el nombre incluye 'gallery', busca en mockData en lugar de BD.
 */
export const getContentBySection = async (req, res, next) => {
    // Extraer nombre de la sección desde los parámetros de la URL
    const { sectionName } = req.params;

    const ResponseAPI = {
        msg: "Contenido obtenido",
        data: null,
        status: 'ok'
    };

    try {
        let content;
        // Lógica especial para galerías que vienen de datos mock en lugar de BD
        if (sectionName.toLowerCase().includes('gallery')) {
            // Extraer la clave de la galería del nombre de sección
            // Ejemplo: 'gallery-graphicDesign' -> 'graphicDesign'
            const key = sectionName.split('-')[1];
            content = mockData.galleryImages[key] || [];
        } else {
            // Para secciones normales, buscar en la base de datos
             content = await Content.findOne({ section: sectionName });
        }

        // Verificar si se encontró contenido
        if (content) {
            ResponseAPI.data = content;
            res.status(200).json(ResponseAPI);
        } else {
            ResponseAPI.msg = `No se encontró contenido para la sección '${sectionName}'`;
            ResponseAPI.status = 'error';
            res.status(404).json(ResponseAPI);
        }
    } catch (error) {
        next(error);
    }
};


/**
 * Crear nuevo contenido
 *
 * Ruta: POST /api/content
 * Autenticación: Requerida (Solo Admin)
 *
 * @param {Object} req - Objeto de petición Express
 * @param {string} req.body.section - Nombre único de la sección (requerido)
 * @param {string} req.body.title - Título del contenido (opcional)
 * @param {string} req.body.body - Cuerpo/texto del contenido (opcional)
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} JSON con el contenido creado
 *
 * Descripción: Crea una nueva sección de contenido. Valida que no exista ya
 * una sección con el mismo nombre para evitar duplicados.
 */
export const createContent = async (req, res, next) => {
    // Extraer campos del cuerpo de la petición
    const { section, title, body } = req.body;

    const ResponseAPI = {
        msg: "Contenido creado con éxito",
        data: null,
        status: 'ok'
    };

    try {
        // Validación: el campo section es obligatorio (identifica la sección)
        if (!section) {
            ResponseAPI.msg = "El campo 'section' es obligatorio";
            ResponseAPI.status = 'error';
            return res.status(400).json(ResponseAPI);
        }

        // Verificar que no exista ya contenido para esa sección (nombres únicos)
        const existingContent = await Content.findOne({ section });
        if (existingContent) {
            ResponseAPI.msg = `Ya existe contenido para la sección '${section}'`;
            ResponseAPI.status = 'error';
            return res.status(400).json(ResponseAPI);
        }

        // Crear el nuevo contenido en la base de datos
        const newContent = await Content.create({
            section,
            title: title || '',
            body: body || ''
        });

        ResponseAPI.data = newContent;
        res.status(201).json(ResponseAPI); // 201: Created
    } catch (error) {
        next(error);
    }
};


/**
 * Actualizar contenido por ID
 *
 * Ruta: PUT /api/content/:id
 * Autenticación: Requerida (Solo Admin)
 *
 * @param {Object} req - Objeto de petición Express
 * @param {string} req.params.id - ID del contenido a actualizar
 * @param {string} req.body.section - Nuevo nombre de sección (opcional)
 * @param {string} req.body.title - Nuevo título (opcional)
 * @param {string} req.body.body - Nuevo cuerpo de texto (opcional)
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} JSON con el contenido actualizado
 *
 * Descripción: Actualiza parcialmente una sección de contenido existente.
 * Solo los campos proporcionados serán actualizados.
 */
export const updateContent = async (req, res, next) => {
    // Extraer ID del contenido desde los parámetros de la URL
    const { id } = req.params;
    // Extraer campos a actualizar del cuerpo de la petición
    const { section, title, body } = req.body;

    const ResponseAPI = {
        msg: "Contenido actualizado con éxito",
        data: null,
        status: 'ok'
    };

    try {
        // Buscar el contenido en la base de datos
        const content = await Content.findById(id);

        if (!content) {
            ResponseAPI.msg = "Contenido no encontrado";
            ResponseAPI.status = 'error';
            return res.status(404).json(ResponseAPI);
        }

        // Actualización parcial: solo los campos proporcionados se modifican
        if (section !== undefined) content.section = section;
        if (title !== undefined) content.title = title;
        if (body !== undefined) content.body = body;

        // Guardar los cambios en la base de datos
        const updatedContent = await content.save();
        ResponseAPI.data = updatedContent;
        res.status(200).json(ResponseAPI);
    } catch (error) {
        next(error);
    }
};


/**
 * Eliminar contenido por ID
 *
 * Ruta: DELETE /api/content/:id
 * Autenticación: Requerida (Solo Admin)
 *
 * @param {Object} req - Objeto de petición Express
 * @param {string} req.params.id - ID del contenido a eliminar
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} JSON con confirmación de eliminación
 *
 * Descripción: Elimina una sección de contenido de forma permanente de la base de datos.
 * Verifica que el contenido exista antes de eliminarlo.
 */
export const deleteContent = async (req, res, next) => {
    // Extraer ID del contenido a eliminar
    const { id } = req.params;

    const ResponseAPI = {
        msg: "Contenido eliminado con éxito",
        data: null,
        status: 'ok'
    };

    try {
        // Verificar que el contenido existe antes de intentar eliminarlo
        const content = await Content.findById(id);

        if (!content) {
            ResponseAPI.msg = "Contenido no encontrado";
            ResponseAPI.status = 'error';
            return res.status(404).json(ResponseAPI);
        }

        // Eliminar el contenido de la base de datos
        await Content.findByIdAndDelete(id);
        ResponseAPI.data = { _id: id };
        res.status(200).json(ResponseAPI);
    } catch (error) {
        next(error);
    }
};