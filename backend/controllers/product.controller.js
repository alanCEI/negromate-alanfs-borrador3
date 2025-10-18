/**
 * Controlador de Productos
 *
 * Este controlador maneja todas las operaciones CRUD relacionadas con productos.
 * Incluye funciones para obtener, crear, actualizar y eliminar productos,
 * así como funcionalidades especiales para integrar galerías de imágenes por categoría.
 * Los productos están organizados en tres categorías: GraphicDesign, CustomClothing y Murals.
 */

import Product from '../db/models/Product.model.js';
import { mockData } from '../db/data.mock.js';

/**
 * Obtener productos y galería por categoría (endpoint consolidado)
 *
 * Ruta: GET /api/products/category/:category
 * Autenticación: No requerida (Público)
 *
 * @param {Object} req - Objeto de petición Express
 * @param {string} req.params.category - Categoría de productos (GraphicDesign, CustomClothing, Murals)
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} JSON con productos y galería de la categoría especificada
 *
 * Descripción: Endpoint consolidado que retorna tanto los productos de una categoría
 * como las imágenes de galería asociadas. Útil para páginas de categoría que necesitan
 * ambos tipos de información en una sola petición.
 */
export const getProductsWithGallery = async (req, res, next) => {
    // Extraer categoría desde los parámetros de la URL
    const { category } = req.params;

    const ResponseAPI = {
        msg: "Datos obtenidos correctamente",
        data: {
            products: [],
            gallery: []
        },
        status: 'ok'
    };

    try {
        // Obtener productos de la categoría desde la base de datos
        const products = await Product.find({ category });

        // Obtener imágenes de galería según la categoría
        let gallery = [];
        // Mapeo entre nombres de categoría en la URL y claves en mockData
        const galleryMap = {
            'GraphicDesign': 'graphicDesign',
            'CustomClothing': 'customClothing',
            'Murals': 'murals'
        };

        // Buscar la galería correspondiente en los datos mock
        const galleryKey = galleryMap[category];
        if (galleryKey && mockData.galleryImages[galleryKey]) {
            gallery = mockData.galleryImages[galleryKey];
        }

        // Consolidar productos y galería en la respuesta
        ResponseAPI.data = {
            products,
            gallery
        };

        // Mensaje informativo si no hay datos disponibles
        if (products.length === 0 && gallery.length === 0) {
            ResponseAPI.msg = `No se encontraron datos para la categoría '${category}'`;
        }

        res.status(200).json(ResponseAPI);
    } catch (error) {
        next(error);
    }
};

/**
 * Obtener todos los productos o filtrados por categoría
 *
 * Ruta: GET /api/products
 * Query params: ?category=GraphicDesign (opcional)
 * Autenticación: No requerida (Público)
 *
 * @param {Object} req - Objeto de petición Express
 * @param {string} req.query.category - Categoría opcional para filtrar (GraphicDesign, CustomClothing, Murals)
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} JSON con lista de productos (todos o filtrados por categoría)
 *
 * Descripción: Obtiene productos de la base de datos. Si se proporciona el parámetro
 * query 'category', filtra solo los productos de esa categoría. Si no, retorna todos.
 */
export const getProducts = async (req, res, next) => {
    // Extraer parámetro de query opcional para filtrar por categoría
    const { category } = req.query;
    // Construir filtro para la consulta: si hay categoría, filtrar; si no, objeto vacío (todos)
    const filter = category ? { category } : {};

    const ResponseAPI = {
        msg: "Productos obtenidos correctamente",
        data: [],
        status: 'ok'
    };

    try {
        // Buscar productos aplicando el filtro (puede ser vacío para todos los productos)
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


/**
 * Obtener un solo producto por su ID
 *
 * Ruta: GET /api/products/:id
 * Autenticación: No requerida (Público)
 *
 * @param {Object} req - Objeto de petición Express
 * @param {string} req.params.id - ID del producto a buscar
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} JSON con los datos del producto o error 404 si no existe
 *
 * Descripción: Busca un producto específico por su ID en MongoDB.
 * Útil para páginas de detalle de producto.
 */
export const getProductById = async (req, res, next) => {
    // Extraer ID del producto desde los parámetros de la URL
    const { id } = req.params;

    const ResponseAPI = {
        msg: "Producto encontrado",
        data: null,
        status: 'ok'
    };

    try {
        // Buscar producto por ID en la base de datos
        const product = await Product.findById(id);
        if (product) {
            ResponseAPI.data = product;
            res.status(200).json(ResponseAPI);
        } else {
            // Si no existe, retornar error 404
            ResponseAPI.msg = "Producto no encontrado";
            ResponseAPI.status = 'error';
            res.status(404).json(ResponseAPI);
        }
    } catch (error) {
        next(error);
    }
};


/**
 * Crear un nuevo producto
 *
 * Ruta: POST /api/products
 * Autenticación: Requerida (Solo Admin)
 *
 * @param {Object} req - Objeto de petición Express
 * @param {string} req.body.name - Nombre del producto (requerido)
 * @param {string} req.body.category - Categoría del producto: GraphicDesign, CustomClothing o Murals (requerido)
 * @param {number} req.body.price - Precio del producto (requerido)
 * @param {string} req.body.imageUrl - URL de la imagen del producto (opcional)
 * @param {string} req.body.description - Descripción del producto (opcional)
 * @param {Array} req.body.details - Array de detalles adicionales del producto (opcional)
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} JSON con el producto creado
 *
 * Descripción: Crea un nuevo producto en la base de datos. Valida que los campos
 * obligatorios estén presentes antes de crear el registro.
 */
export const createProduct = async (req, res, next) => {
    // Extraer campos del cuerpo de la petición
    const { name, category, price, imageUrl, description, details } = req.body;

    const ResponseAPI = {
        msg: "Producto creado con éxito",
        data: null,
        status: 'ok'
    };

    try {
        // Validación de campos obligatorios
        if (!name || !category || !price) {
            ResponseAPI.msg = "Los campos name, category y price son obligatorios";
            ResponseAPI.status = 'error';
            return res.status(400).json(ResponseAPI);
        }

        // Crear nuevo producto en la base de datos
        // Los campos opcionales se inicializan con valores por defecto si no se proporcionan
        const newProduct = await Product.create({
            name,
            category,
            price,
            imageUrl: imageUrl || '',
            description: description || '',
            details: details || []
        });

        ResponseAPI.data = newProduct;
        res.status(201).json(ResponseAPI); // 201: Created
    } catch (error) {
        next(error);
    }
};


/**
 * Actualizar un producto por su ID
 *
 * Ruta: PUT /api/products/:id
 * Autenticación: Requerida (Solo Admin)
 *
 * @param {Object} req - Objeto de petición Express
 * @param {string} req.params.id - ID del producto a actualizar
 * @param {string} req.body.name - Nuevo nombre del producto (opcional)
 * @param {string} req.body.category - Nueva categoría del producto (opcional)
 * @param {number} req.body.price - Nuevo precio del producto (opcional)
 * @param {string} req.body.imageUrl - Nueva URL de imagen (opcional)
 * @param {string} req.body.description - Nueva descripción (opcional)
 * @param {Array} req.body.details - Nuevos detalles (opcional)
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} JSON con el producto actualizado
 *
 * Descripción: Actualiza parcialmente un producto existente. Solo los campos
 * proporcionados en el cuerpo de la petición serán actualizados.
 */
export const updateProduct = async (req, res, next) => {
    // Extraer ID del producto desde los parámetros de la URL
    const { id } = req.params;
    // Extraer campos a actualizar del cuerpo de la petición
    const { name, category, price, imageUrl, description, details } = req.body;

    const ResponseAPI = {
        msg: "Producto actualizado con éxito",
        data: null,
        status: 'ok'
    };

    try {
        // Buscar el producto en la base de datos
        const product = await Product.findById(id);

        if (!product) {
            ResponseAPI.msg = "Producto no encontrado";
            ResponseAPI.status = 'error';
            return res.status(404).json(ResponseAPI);
        }

        // Actualización parcial: solo los campos proporcionados se modifican
        // Se verifica que el campo esté presente en el body (undefined check)
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


/**
 * Eliminar un producto por su ID
 *
 * Ruta: DELETE /api/products/:id
 * Autenticación: Requerida (Solo Admin)
 *
 * @param {Object} req - Objeto de petición Express
 * @param {string} req.params.id - ID del producto a eliminar
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} JSON con confirmación de eliminación
 *
 * Descripción: Elimina un producto de la base de datos de forma permanente.
 * Verifica que el producto exista antes de eliminarlo.
 */
export const deleteProduct = async (req, res, next) => {
    // Extraer ID del producto a eliminar
    const { id } = req.params;

    const ResponseAPI = {
        msg: "Producto eliminado con éxito",
        data: null,
        status: 'ok'
    };

    try {
        // Verificar que el producto existe antes de intentar eliminarlo
        const product = await Product.findById(id);

        if (!product) {
            ResponseAPI.msg = "Producto no encontrado";
            ResponseAPI.status = 'error';
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