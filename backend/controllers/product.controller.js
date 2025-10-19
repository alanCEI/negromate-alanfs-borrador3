/**
 * ============================================
 * Controlador de Productos
 * ============================================
 */

import Product from "../db/models/Product.model.js";
import { mockData } from "../db/data.mock.js";

// Obtener productos y galería por categoría
export const getProductsWithGallery = async (req, res, next) => {
  // Extraer categoría
  const { category } = req.params;
  const ResponseAPI = {
    msg: "Datos obtenidos correctamente",
    data: {
      products: [],
      gallery: [],
    },
    status: "ok",
  };

  try {
    // Obtener productos de la categoría
    const products = await Product.find({ category });
    // Obtener imágenes de galería según la categoría
    let gallery = [];
    // Mapeo entre nombres de categoría y mockData
    const galleryMap = {
      GraphicDesign: "graphicDesign",
      CustomClothing: "customClothing",
      Murals: "murals",
    };
    // Buscar la galería en mockData
    const galleryKey = galleryMap[category];
    if (galleryKey && mockData.galleryImages[galleryKey]) {
      gallery = mockData.galleryImages[galleryKey];
    }
    // Productos y galería en la respuesta
    ResponseAPI.data = {
      products,
      gallery,
    };
    // Si no hay datos disponibles
    if (products.length === 0 && gallery.length === 0) {
      ResponseAPI.msg = `No se encontraron datos para la categoría '${category}'`;
    }
    res.status(200).json(ResponseAPI);
  } catch (error) {
    next(error);
  }
};

// Obtener todos los productos o filtrados por categoría
export const getProducts = async (req, res, next) => {
  // Extraer parámetro
  const { category } = req.query;
  // Filtro para la consulta si hay filtra, si no todos
  const filter = category ? { category } : {};
  const ResponseAPI = {
    msg: "Productos obtenidos correctamente",
    data: [],
    status: "ok",
  };

  try {
    // Buscar productos con el filtro o todos
    const products = await Product.find(filter);
    if (products.length === 0) {
      ResponseAPI.msg = "No se encontraron productos para esta categoría";
    } else {
      ResponseAPI.data = products;
    }
    res.status(200).json(ResponseAPI);
  } catch (error) {
    next(error);
  }
};

// Obtener un producto por su ID
export const getProductById = async (req, res, next) => {
  // Extraer ID del producto
  const { id } = req.params;
  const ResponseAPI = {
    msg: "Producto encontrado",
    data: null,
    status: "ok",
  };

  try {
    // Buscar producto por ID
    const product = await Product.findById(id);
    if (product) {
      ResponseAPI.data = product;
      res.status(200).json(ResponseAPI);
    } else {
      // Si no existe, error
      ResponseAPI.msg = "Producto no encontrado";
      ResponseAPI.status = "error";
      res.status(404).json(ResponseAPI);
    }
  } catch (error) {
    next(error);
  }
};

// Crear un nuevo producto
export const createProduct = async (req, res, next) => {
  // Extraer campos
  const { name, category, price, imageUrl, description, details } = req.body;
  const ResponseAPI = {
    msg: "Producto creado con éxito",
    data: null,
    status: "ok",
  };

  try {
    // Validación de campos obligatorios
    if (!name || !category || !price) {
      ResponseAPI.msg = "Los campos name, category y price son obligatorios";
      ResponseAPI.status = "error";
      return res.status(400).json(ResponseAPI);
    }
    // Crear nuevo producto en la base de datos
    const newProduct = await Product.create({
      name,
      category,
      price,
      imageUrl: imageUrl || "",
      description: description || "",
      details: details || [],
    });
    ResponseAPI.data = newProduct;
    res.status(201).json(ResponseAPI);
  } catch (error) {
    next(error);
  }
};

// Actualizar producto por su ID
export const updateProduct = async (req, res, next) => {
  // Extraer ID del producto
  const { id } = req.params;
  // Extraer campos
  const { name, category, price, imageUrl, description, details } = req.body;
  const ResponseAPI = {
    msg: "Producto actualizado con éxito",
    data: null,
    status: "ok",
  };

  try {
    // Buscar el producto
    const product = await Product.findById(id);
    if (!product) {
      ResponseAPI.msg = "Producto no encontrado";
      ResponseAPI.status = "error";
      return res.status(404).json(ResponseAPI);
    }
    // Actualización, solo los campos proporcionados se modificaran
    if (name !== undefined) product.name = name;
    if (category !== undefined) product.category = category;
    if (price !== undefined) product.price = price;
    if (imageUrl !== undefined) product.imageUrl = imageUrl;
    if (description !== undefined) product.description = description;
    if (details !== undefined) product.details = details;
    // Guardar los cambios en la base de datos
    const updatedProduct = await product.save();
    ResponseAPI.data = updatedProduct;
    res.status(200).json(ResponseAPI);
  } catch (error) {
    next(error);
  }
};

// Eliminar producto por su ID
export const deleteProduct = async (req, res, next) => {
  // Extraer ID del producto
  const { id } = req.params;
  const ResponseAPI = {
    msg: "Producto eliminado con éxito",
    data: null,
    status: "ok",
  };

  try {
    // Verificar que el producto existe
    const product = await Product.findById(id);
    if (!product) {
      ResponseAPI.msg = "Producto no encontrado";
      ResponseAPI.status = "error";
      return res.status(404).json(ResponseAPI);
    }
    // Eliminar el producto de la base de datos
    await Product.findByIdAndDelete(id);
    ResponseAPI.data = { _id: id };
    res.status(200).json(ResponseAPI);
  } catch (error) {
    next(error);
  }
};
