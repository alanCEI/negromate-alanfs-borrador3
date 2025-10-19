/**
 * ============================================
 * Controlador de Contenido
 * ============================================
 */

import Content from "../db/models/Content.model.js";
import { mockData } from "../db/data.mock.js";

// Obtener todo el contenido (Admin)
export const getAllContent = async (req, res, next) => {
  const ResponseAPI = {
    msg: "Contenido obtenido",
    data: [],
    status: "ok",
  };

  try {
    // Buscar todo el contenido
    const content = await Content.find({});
    ResponseAPI.data = content;
    res.status(200).json(ResponseAPI);
  } catch (error) {
    next(error);
  }
};

// Obtener contenido de una sección específica
export const getContentBySection = async (req, res, next) => {
  // Extraer nombre de la sección
  const { sectionName } = req.params;
  const ResponseAPI = {
    msg: "Contenido obtenido",
    data: null,
    status: "ok",
  };

  try {
    let content;
    // Galeria que viene de mockData
    if (sectionName.toLowerCase().includes("gallery")) {
      // Extraer la clave de la galería del nombre de sección
      const key = sectionName.split("-")[1];
      content = mockData.galleryImages[key] || [];
    } else {
      // Para secciones normales buscamos en la base de datos
      content = await Content.findOne({ section: sectionName });
    }
    // Verificar si se encontró contenido
    if (content) {
      ResponseAPI.data = content;
      res.status(200).json(ResponseAPI);
    } else {
      ResponseAPI.msg = `No se encontró contenido para la sección '${sectionName}'`;
      ResponseAPI.status = "error";
      res.status(404).json(ResponseAPI);
    }
  } catch (error) {
    next(error);
  }
};

// Crear nuevo contenido (Admin)
export const createContent = async (req, res, next) => {
  // Extraer campos
  const { section, title, body } = req.body;
  const ResponseAPI = {
    msg: "Contenido creado con éxito",
    data: null,
    status: "ok",
  };

  try {
    // Identificamos la sección
    if (!section) {
      ResponseAPI.msg = "El campo 'section' es obligatorio";
      ResponseAPI.status = "error";
      return res.status(400).json(ResponseAPI);
    }
    // Verificar que no exista contenido para esa sección
    const existingContent = await Content.findOne({ section });
    if (existingContent) {
      ResponseAPI.msg = `Ya existe contenido para la sección '${section}'`;
      ResponseAPI.status = "error";
      return res.status(400).json(ResponseAPI);
    }
    // Crear el nuevo contenido
    const newContent = await Content.create({
      section,
      title: title || "",
      body: body || "",
    });
    ResponseAPI.data = newContent;
    res.status(201).json(ResponseAPI);
  } catch (error) {
    next(error);
  }
};

// Actualizar contenido por ID (Admin)
export const updateContent = async (req, res, next) => {
  // Extraer ID del contenido
  const { id } = req.params;
  // Extraer campos
  const { section, title, body } = req.body;
  const ResponseAPI = {
    msg: "Contenido actualizado con éxito",
    data: null,
    status: "ok",
  };

  try {
    // Buscar el contenido
    const content = await Content.findById(id);
    if (!content) {
      ResponseAPI.msg = "Contenido no encontrado";
      ResponseAPI.status = "error";
      return res.status(404).json(ResponseAPI);
    }
    // Actualización, solo los campos proporcionados se modificaran
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

// Eliminar contenido por ID (Admin)
export const deleteContent = async (req, res, next) => {
  // Extraer ID del contenido
  const { id } = req.params;
  const ResponseAPI = {
    msg: "Contenido eliminado con éxito",
    data: null,
    status: "ok",
  };

  try {
    // Verificar que el contenido existe
    const content = await Content.findById(id);
    if (!content) {
      ResponseAPI.msg = "Contenido no encontrado";
      ResponseAPI.status = "error";
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
