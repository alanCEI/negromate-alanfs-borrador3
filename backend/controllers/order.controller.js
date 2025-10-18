/**
 * Controlador de Órdenes
 *
 * Este controlador maneja todas las operaciones relacionadas con órdenes de compra.
 * Incluye funciones para crear, consultar, actualizar estado y eliminar órdenes.
 * Implementa lógica de seguridad para cálculo de precios en el servidor y control
 * de acceso basado en roles (usuarios solo pueden ver sus propias órdenes, admins ven todas).
 */

import Order from '../db/models/Order.model.js';
import Product from '../db/models/Product.model.js';

/**
 * Obtener todas las órdenes
 *
 * Ruta: GET /api/orders
 * Autenticación: Requerida (Solo Admin)
 *
 * @param {Object} req - Objeto de petición Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} JSON con lista de todas las órdenes con información de usuario y productos
 *
 * Descripción: Obtiene todas las órdenes del sistema con populate de información
 * relacionada (usuario y productos). Solo accesible por administradores.
 */
export const getAllOrders = async (req, res, next) => {
    const ResponseAPI = {
        msg: "Lista de órdenes obtenida",
        data: [],
        status: 'ok'
    };

    try {
        // Buscar todas las órdenes en la base de datos
        // .populate() trae información relacionada de otras colecciones
        const orders = await Order.find({})
            .populate('user', 'username email') // Traer username y email del usuario
            .populate('items.product', 'name imageUrl'); // Traer nombre e imagen de cada producto
        ResponseAPI.data = orders;
        res.status(200).json(ResponseAPI);
    } catch (error) {
        next(error);
    }
};


/**
 * Obtener las órdenes del usuario logueado
 *
 * Ruta: GET /api/orders/my-orders
 * Autenticación: Requerida (Usuario autenticado)
 *
 * @param {Object} req - Objeto de petición Express
 * @param {Object} req.user - Usuario autenticado (inyectado por authMiddleware)
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} JSON con lista de órdenes del usuario autenticado
 *
 * Descripción: Obtiene solo las órdenes que pertenecen al usuario actual.
 * Cada usuario solo puede ver sus propias órdenes.
 */
export const getUserOrders = async (req, res, next) => {
    const ResponseAPI = {
        msg: "Órdenes del usuario obtenidas",
        data: [],
        status: 'ok'
    };

    try {
        // Filtrar órdenes solo del usuario autenticado usando su ID
        const orders = await Order.find({ user: req.user._id })
            .populate('items.product', 'name imageUrl'); // Traer info de productos
        ResponseAPI.data = orders;
        res.status(200).json(ResponseAPI);
    } catch (error) {
        next(error);
    }
};


/**
 * Obtener una orden por su ID
 *
 * Ruta: GET /api/orders/:id
 * Autenticación: Requerida (Usuario autenticado o Admin)
 *
 * @param {Object} req - Objeto de petición Express
 * @param {string} req.params.id - ID de la orden a buscar
 * @param {Object} req.user - Usuario autenticado (inyectado por authMiddleware)
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} JSON con los datos de la orden o error 403/404
 *
 * Descripción: Obtiene una orden específica por ID. Implementa control de acceso:
 * los usuarios solo pueden ver sus propias órdenes, los admins pueden ver cualquiera.
 */
export const getOrderById = async (req, res, next) => {
    // Extraer ID de la orden desde los parámetros de la URL
    const { id } = req.params;

    const ResponseAPI = {
        msg: "Orden encontrada",
        data: null,
        status: 'ok'
    };

    try {
        // Buscar la orden por ID y popular datos relacionados
        const order = await Order.findById(id)
            .populate('user', 'username email') // Información del usuario
            .populate('items.product', 'name imageUrl'); // Información de productos

        if (!order) {
            ResponseAPI.msg = "Orden no encontrada";
            ResponseAPI.status = 'error';
            return res.status(404).json(ResponseAPI);
        }

        // Control de acceso: verificar que el usuario solo pueda ver sus propias órdenes,
        // a menos que sea administrador
        if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
            ResponseAPI.msg = "No tienes permiso para ver esta orden";
            ResponseAPI.status = 'error';
            return res.status(403).json(ResponseAPI);
        }

        ResponseAPI.data = order;
        res.status(200).json(ResponseAPI);
    } catch (error) {
        next(error);
    }
};


/**
 * Crear una nueva orden
 *
 * Ruta: POST /api/orders
 * Autenticación: Requerida (Usuario autenticado)
 *
 * @param {Object} req - Objeto de petición Express
 * @param {Array} req.body.orderItems - Array de items [{product: id, quantity: number}]
 * @param {Object} req.user - Usuario autenticado (inyectado por authMiddleware)
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} JSON con la orden creada
 *
 * Descripción: Crea una nueva orden de compra. Por seguridad, los precios se
 * calculan en el servidor consultando la base de datos, no se confía en los
 * precios enviados por el cliente. Valida que todos los productos existan.
 */
export const createOrder = async (req, res, next) => {
    // Extraer items del carrito enviados por el frontend
    const { orderItems } = req.body;

    const ResponseAPI = {
        msg: "Orden creada con éxito",
        data: null,
        status: 'ok'
    };

    // Validación: verificar que haya al menos un item en la orden
    if (!orderItems || orderItems.length === 0) {
        ResponseAPI.msg = "No hay artículos en la orden";
        ResponseAPI.status = 'error';
        return res.status(400).json(ResponseAPI);
    }

    try {
        // SEGURIDAD: Calcular el monto total en el backend, no confiar en el cliente
        // Obtener todos los productos involucrados en la orden desde la base de datos
        const itemsFromDB = await Product.find({
            _id: { $in: orderItems.map(item => item.product) }
        });

        let totalAmount = 0;
        // Procesar cada item: validar existencia y calcular precio real desde la BD
        const processedItems = orderItems.map(item => {
            const dbProduct = itemsFromDB.find(p => p._id.toString() === item.product);
            if (!dbProduct) {
                // Si algún producto no existe, lanzar error
                throw new Error(`Producto con id ${item.product} no encontrado.`);
            }
            // Calcular subtotal: precio de BD (no del cliente) × cantidad
            totalAmount += dbProduct.price * item.quantity;
            return {
                product: item.product,
                quantity: item.quantity,
                price: dbProduct.price // Precio desde la base de datos
            };
        });

        // Crear la orden con el usuario autenticado
        const order = new Order({
            user: req.user._id, // El usuario viene del authMiddleware
            items: processedItems,
            totalAmount: totalAmount // Total calculado en el servidor
        });

        // Guardar la orden en la base de datos
        const createdOrder = await order.save();
        ResponseAPI.data = createdOrder;
        res.status(201).json(ResponseAPI); // 201: Created

    } catch (error) {
        next(error);
    }
};


/**
 * Actualizar el estado de una orden
 *
 * Ruta: PUT /api/orders/:id
 * Autenticación: Requerida (Solo Admin)
 *
 * @param {Object} req - Objeto de petición Express
 * @param {string} req.params.id - ID de la orden a actualizar
 * @param {string} req.body.status - Nuevo estado: 'pending', 'completed' o 'cancelled'
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} JSON con la orden actualizada
 *
 * Descripción: Permite a administradores cambiar el estado de una orden.
 * Valida que el estado sea uno de los valores permitidos.
 */
export const updateOrderStatus = async (req, res, next) => {
    // Extraer ID de la orden y nuevo estado
    const { id } = req.params;
    const { status } = req.body;

    const ResponseAPI = {
        msg: "Estado de la orden actualizado",
        data: null,
        status: 'ok'
    };

    try {
        // Buscar la orden en la base de datos
        const order = await Order.findById(id);

        if (!order) {
            ResponseAPI.msg = "Orden no encontrada";
            ResponseAPI.status = 'error';
            return res.status(404).json(ResponseAPI);
        }

        // Validación: verificar que el estado proporcionado sea uno de los valores permitidos
        const validStatuses = ['pending', 'completed', 'cancelled'];
        if (status && !validStatuses.includes(status)) {
            ResponseAPI.msg = "Estado inválido. Debe ser: pending, completed o cancelled";
            ResponseAPI.status = 'error';
            return res.status(400).json(ResponseAPI);
        }

        // Actualizar el estado si se proporciona
        if (status !== undefined) order.status = status;

        // Guardar los cambios en la base de datos
        const updatedOrder = await order.save();
        ResponseAPI.data = updatedOrder;
        res.status(200).json(ResponseAPI);
    } catch (error) {
        next(error);
    }
};


/**
 * Eliminar una orden
 *
 * Ruta: DELETE /api/orders/:id
 * Autenticación: Requerida (Solo Admin)
 *
 * @param {Object} req - Objeto de petición Express
 * @param {string} req.params.id - ID de la orden a eliminar
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} JSON con confirmación de eliminación
 *
 * Descripción: Elimina una orden de forma permanente de la base de datos.
 * Solo accesible por administradores.
 */
export const deleteOrder = async (req, res, next) => {
    // Extraer ID de la orden a eliminar
    const { id } = req.params;

    const ResponseAPI = {
        msg: "Orden eliminada con éxito",
        data: null,
        status: 'ok'
    };

    try {
        // Verificar que la orden existe antes de intentar eliminarla
        const order = await Order.findById(id);

        if (!order) {
            ResponseAPI.msg = "Orden no encontrada";
            ResponseAPI.status = 'error';
            return res.status(404).json(ResponseAPI);
        }

        // Eliminar la orden de la base de datos
        await Order.findByIdAndDelete(id);
        ResponseAPI.data = { _id: id };
        res.status(200).json(ResponseAPI);
    } catch (error) {
        next(error);
    }
};