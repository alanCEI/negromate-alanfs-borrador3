/**
 * Controlador de Usuarios
 *
 * Este controlador maneja todas las operaciones CRUD relacionadas con usuarios.
 * Incluye funciones para obtener, actualizar y eliminar usuarios del sistema.
 * Algunas operaciones están restringidas a administradores únicamente.
 */

import User from '../db/models/User.model.js';
import bcrypt from 'bcrypt';

/**
 * Obtener todos los usuarios
 *
 * Ruta: GET /api/users
 * Autenticación: Requerida (Solo Admin)
 *
 * @param {Object} req - Objeto de petición Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} JSON con la lista de todos los usuarios (sin contraseñas)
 *
 * Descripción: Recupera todos los usuarios de la base de datos, excluyendo
 * las contraseñas por seguridad. Solo accesible por administradores.
 */
export const getAllUsers = async (req, res, next) => {
    // Estructura estándar de respuesta de la API
    const ResponseAPI = {
        msg: "Lista de usuarios obtenida",
        data: [],
        status: 'ok'
    };
    try {
        // Buscar todos los usuarios en la base de datos
        // .select('-password') excluye el campo password de los resultados por seguridad
        const users = await User.find({}).select('-password');
        ResponseAPI.data = users;
        res.status(200).json(ResponseAPI);
    } catch (error) {
        // Pasar cualquier error al middleware de manejo de errores
        next(error);
    }
};


/**
 * Obtener un usuario por su ID
 *
 * Ruta: GET /api/users/:id
 * Autenticación: Requerida (Solo Admin)
 *
 * @param {Object} req - Objeto de petición Express
 * @param {string} req.params.id - ID del usuario a buscar
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} JSON con los datos del usuario o error 404 si no existe
 *
 * Descripción: Busca un usuario específico por su ID en MongoDB.
 * Excluye la contraseña de la respuesta por seguridad.
 */
export const getUserById = async (req, res, next) => {
    // Extraer el ID del usuario desde los parámetros de la URL
    const { id } = req.params;

    const ResponseAPI = {
        msg: "Usuario encontrado",
        data: null,
        status: 'ok'
    };

    try {
        // Buscar usuario por ID, excluyendo el campo password
        const user = await User.findById(id).select('-password');
        if (user) {
            ResponseAPI.data = user;
            res.status(200).json(ResponseAPI);
        } else {
            // Si no se encuentra el usuario, retornar error 404
            ResponseAPI.msg = "Usuario no encontrado";
            ResponseAPI.status = 'error';
            res.status(404).json(ResponseAPI);
        }
    } catch (error) {
        next(error);
    }
};


/**
 * Actualizar un usuario por su ID
 *
 * Ruta: PUT /api/users/:id
 * Autenticación: Requerida (Solo Admin o el propio usuario)
 *
 * @param {Object} req - Objeto de petición Express
 * @param {string} req.params.id - ID del usuario a actualizar
 * @param {string} req.body.username - Nuevo nombre de usuario (opcional)
 * @param {string} req.body.email - Nuevo email (opcional)
 * @param {string} req.body.password - Nueva contraseña (opcional)
 * @param {string} req.body.role - Nuevo rol (opcional, solo admin puede cambiar)
 * @param {Object} req.user - Usuario autenticado (inyectado por authMiddleware)
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} JSON con el usuario actualizado (sin contraseña)
 *
 * Descripción: Permite actualizar los datos de un usuario. Un usuario puede
 * actualizar sus propios datos, pero solo un administrador puede modificar
 * otros usuarios o cambiar roles.
 */
export const updateUser = async (req, res, next) => {
    // Extraer ID del usuario desde los parámetros de la URL
    const { id } = req.params;
    // Extraer campos a actualizar del cuerpo de la petición
    const { username, email, password, role } = req.body;

    const ResponseAPI = {
        msg: "Usuario actualizado con éxito",
        data: null,
        status: 'ok'
    };

    try {
        // Buscar el usuario en la base de datos
        const user = await User.findById(id);

        if (!user) {
            ResponseAPI.msg = "Usuario no encontrado";
            ResponseAPI.status = 'error';
            return res.status(404).json(ResponseAPI);
        }

        // Control de acceso: verificar que el usuario solo pueda modificarse a sí mismo,
        // a menos que tenga rol de administrador
        if (req.user.role !== 'admin' && req.user._id.toString() !== id) {
            ResponseAPI.msg = "No tienes permiso para modificar este usuario";
            ResponseAPI.status = 'error';
            return res.status(403).json(ResponseAPI);
        }

        // Actualizar solo los campos proporcionados (actualización parcial)
        if (username !== undefined) user.username = username;
        if (email !== undefined) user.email = email;

        // Si se proporciona una nueva contraseña, hashearla antes de guardar
        if (password !== undefined && password.trim() !== '') {
            const salt = await bcrypt.genSalt(10); // Generar salt para el hash
            user.password = await bcrypt.hash(password, salt); // Hashear la contraseña
        }

        // Restricción de seguridad: solo admin puede cambiar roles de usuarios
        if (role !== undefined && req.user.role === 'admin') {
            user.role = role;
        }

        // Guardar los cambios en la base de datos
        const updatedUser = await user.save();

        // Excluir la contraseña de la respuesta por seguridad
        const userResponse = updatedUser.toObject();
        delete userResponse.password;

        ResponseAPI.data = userResponse;
        res.status(200).json(ResponseAPI);
    } catch (error) {
        next(error);
    }
};


/**
 * Eliminar un usuario por su ID
 *
 * Ruta: DELETE /api/users/:id
 * Autenticación: Requerida (Solo Admin)
 *
 * @param {Object} req - Objeto de petición Express
 * @param {string} req.params.id - ID del usuario a eliminar
 * @param {Object} req.user - Usuario autenticado (inyectado por authMiddleware)
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Object} JSON con confirmación de eliminación
 *
 * Descripción: Elimina un usuario de la base de datos. Incluye validación
 * para prevenir que un administrador se elimine a sí mismo.
 */
export const deleteUser = async (req, res, next) => {
    // Extraer ID del usuario a eliminar
    const { id } = req.params;

    const ResponseAPI = {
        msg: "Usuario eliminado con éxito",
        data: null,
        status: 'ok'
    };

    try {
        // Buscar el usuario en la base de datos
        const user = await User.findById(id);

        if (!user) {
            ResponseAPI.msg = "Usuario no encontrado";
            ResponseAPI.status = 'error';
            return res.status(404).json(ResponseAPI);
        }

        // Validación de seguridad: prevenir que el admin se elimine a sí mismo
        // Esto evita quedar sin usuarios administradores en el sistema
        if (req.user._id.toString() === id) {
            ResponseAPI.msg = "No puedes eliminar tu propia cuenta";
            ResponseAPI.status = 'error';
            return res.status(400).json(ResponseAPI);
        }

        // Eliminar el usuario de la base de datos
        await User.findByIdAndDelete(id);
        ResponseAPI.data = { _id: id };
        res.status(200).json(ResponseAPI);
    } catch (error) {
        next(error);
    }
};