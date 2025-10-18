/**
 * Controlador de Autenticación
 *
 * Maneja el registro, inicio de sesión y obtención de perfil de usuarios.
 * Implementa autenticación basada en JWT (JSON Web Tokens).
 */

import User from '../db/models/User.model.js';
import bcrypt from 'bcrypt'; // Librería para hashear contraseñas
import jwt from 'jsonwebtoken'; // Librería para generar tokens JWT
import { JWT_SECRET } from '../config/config.js';

/**
 * Función auxiliar para generar un token JWT
 *
 * @param {string} id - ID del usuario (ObjectId de MongoDB)
 * @returns {string} Token JWT firmado que expira en 90 días
 *
 * El token contiene el ID del usuario codificado y es usado para
 * autenticar peticiones posteriores sin necesidad de enviar usuario/contraseña.
 */
const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: '90d', // El token expira en 90 días
    });
};

/**
 * Registro de un nuevo usuario
 *
 * POST /api/auth/register
 *
 * Proceso:
 * 1. Valida que se proporcionen username, email y password
 * 2. Verifica que el email no esté ya registrado
 * 3. Hashea la contraseña usando bcrypt (10 rondas de salt)
 * 4. Crea el nuevo usuario en la base de datos
 * 5. Genera un token JWT para autenticación automática
 * 6. Retorna los datos del usuario (sin la contraseña) y el token
 *
 * @param {Object} req.body - { username, email, password }
 * @returns {Object} ResponseAPI con datos del usuario y token JWT
 */
export const registerUser = async (req, res, next) => {
    const { username, email, password } = req.body;

    // Estructura estándar de respuesta de la API
    const ResponseAPI = {
        msg: "Usuario registrado con éxito",
        data: null,
        status: 'ok'
    };

    try {
        // Validar que todos los campos requeridos estén presentes
        if (!username || !email || !password) {
            ResponseAPI.msg = "Todos los campos son obligatorios";
            ResponseAPI.status = 'error';
            return res.status(400).json(ResponseAPI);
        }

        // Verificar si el email ya está registrado en la base de datos
        const userExists = await User.findOne({ email });
        if (userExists) {
            ResponseAPI.msg = "El email ya está registrado";
            ResponseAPI.status = 'error';
            return res.status(400).json(ResponseAPI);
        }

        // Encriptar la contraseña usando bcrypt
        // genSalt(10) genera un salt con 10 rondas de complejidad
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear el nuevo usuario en la base de datos
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword, // Guardar la contraseña hasheada, NUNCA en texto plano
        });

        // Si el usuario se creó exitosamente
        if (newUser) {
            // Generar un token JWT para que el usuario quede autenticado inmediatamente
            const token = generateToken(newUser._id);

            // Preparar los datos del usuario para la respuesta (sin la contraseña)
            ResponseAPI.data = {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role, // Por defecto será 'user'
                token: token, // Token JWT para futuras peticiones
            };
            res.status(201).json(ResponseAPI);
        } else {
            ResponseAPI.msg = "Datos de usuario inválidos";
            ResponseAPI.status = 'error';
            res.status(400).json(ResponseAPI);
        }
    } catch (error) {
        // Pasar el error al middleware de manejo de errores
        next(error);
    }
};


/**
 * Inicio de sesión de un usuario
 *
 * POST /api/auth/login
 *
 * Proceso:
 * 1. Busca el usuario por email en la base de datos
 * 2. Compara la contraseña proporcionada con el hash almacenado usando bcrypt
 * 3. Si las credenciales son correctas, genera un token JWT
 * 4. Retorna los datos del usuario y el token para mantener la sesión
 *
 * @param {Object} req.body - { email, password }
 * @returns {Object} ResponseAPI con datos del usuario y token JWT
 */
export const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    // Estructura estándar de respuesta de la API
    const ResponseAPI = {
        msg: "Inicio de sesión exitoso",
        data: null,
        status: 'ok'
    };

    try {
        // Buscar usuario por email en la base de datos
        const user = await User.findOne({ email });

        // Verificar que el usuario existe y que la contraseña es correcta
        // bcrypt.compare() compara la contraseña en texto plano con el hash almacenado
        if (user && (await bcrypt.compare(password, user.password))) {
            // Generar un nuevo token JWT para esta sesión
            const token = generateToken(user._id);

            // Preparar los datos del usuario para la respuesta (sin la contraseña)
            ResponseAPI.data = {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: token, // Token JWT para autenticar futuras peticiones
            };
            res.status(200).json(ResponseAPI);
        } else {
            // Si el usuario no existe o la contraseña es incorrecta
            ResponseAPI.msg = "Credenciales inválidas";
            ResponseAPI.status = 'error';
            res.status(401).json(ResponseAPI); // 401 Unauthorized
        }
    } catch (error) {
        // Pasar el error al middleware de manejo de errores
        next(error);
    }
};


/**
 * Obtener perfil del usuario autenticado
 *
 * GET /api/auth/profile
 *
 * Ruta protegida que requiere autenticación (token JWT en el header).
 * El authMiddleware valida el token y adjunta los datos del usuario en req.user.
 * Esta función simplemente retorna esos datos.
 *
 * @param {Object} req.user - Datos del usuario adjuntados por authMiddleware
 * @returns {Object} ResponseAPI con los datos del usuario
 */
export const getUserProfile = async (req, res, next) => {
     const ResponseAPI = {
        msg: "Perfil de usuario obtenido",
        data: req.user, // req.user es adjuntado por el authMiddleware (contiene: _id, username, email, role)
        status: 'ok'
    };
    res.status(200).json(ResponseAPI);
};