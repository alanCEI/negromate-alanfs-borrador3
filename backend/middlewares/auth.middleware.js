/**
 * Middlewares de Autenticación y Autorización
 *
 * Este archivo contiene dos middlewares para proteger rutas:
 * 1. authMiddleware: Valida el token JWT y autentica al usuario
 * 2. adminMiddleware: Verifica que el usuario tenga rol de administrador
 *
 * Estos middlewares se utilizan en las rutas del backend para implementar
 * control de acceso basado en autenticación y roles.
 */

import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config.js';
import User from '../db/models/User.model.js';

/**
 * Middleware de Autenticación
 *
 * Valida que la petición incluya un token JWT válido en el header Authorization.
 * Si el token es válido, adjunta los datos del usuario en req.user y permite
 * continuar con la petición. Si no es válido, retorna error 401.
 *
 * Formato esperado del header: "Authorization: Bearer <token>"
 *
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @param {Function} next - Siguiente middleware en la cadena
 *
 * Uso en rutas: router.get('/perfil', authMiddleware, getProfile)
 */
export const authMiddleware = async (req, res, next) => {
    // Extraer el header de autorización de la petición
    const { authorization } = req.headers;

    // Verificar que el header exista y tenga el formato correcto "Bearer <token>"
    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'No autorizado, token no proporcionado o formato incorrecto.' });
    }

    // Extraer el token del header (eliminar la palabra "Bearer ")
    const token = authorization.split(' ')[1];

    try {
        // Verificar y decodificar el token JWT usando la clave secreta
        const decoded = jwt.verify(token, JWT_SECRET);
        // decoded contiene { id: userId, iat: timestamp, exp: timestamp }

        // Buscar el usuario en la base de datos usando el ID del token
        // .select('-password') excluye la contraseña del resultado
        req.user = await User.findById(decoded.id).select('-password');

        // Si el usuario no existe (fue eliminado después de generar el token)
        if (!req.user) {
            return res.status(401).json({ msg: 'No autorizado, usuario no encontrado.' });
        }

        // El usuario está autenticado, adjuntar sus datos a req.user y continuar
        next();
    } catch (error) {
        // El token es inválido, expiró, o está malformado
        console.error('Error de autenticación:', error);
        res.status(401).json({ msg: 'No autorizado, token inválido.' });
    }
};

/**
 * Middleware de Verificación de Rol Admin
 *
 * Verifica que el usuario autenticado tenga rol de 'admin'.
 * IMPORTANTE: Este middleware DEBE usarse DESPUÉS de authMiddleware,
 * ya que depende de que req.user esté definido.
 *
 * Si el usuario es admin, permite continuar. Si no, retorna error 403.
 *
 * @param {Object} req - Request de Express (debe tener req.user definido)
 * @param {Object} res - Response de Express
 * @param {Function} next - Siguiente middleware en la cadena
 *
 * Uso en rutas: router.delete('/usuarios/:id', authMiddleware, adminMiddleware, deleteUser)
 */
export const adminMiddleware = (req, res, next) => {
    // Verificar que req.user existe (authMiddleware se ejecutó antes) y que tiene rol 'admin'
    if (req.user && req.user.role === 'admin') {
        // El usuario es admin, permitir continuar
        next();
    } else {
        // El usuario no es admin (o no está autenticado), denegar acceso
        res.status(403).json({ msg: 'Acceso denegado, requiere rol de administrador.' });
    }
};