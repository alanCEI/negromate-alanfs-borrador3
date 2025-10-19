/**
 * ============================================
 * Middlewares de Autenticación y Autorización
 * ============================================
 */

import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js";
import User from "../db/models/User.model.js";

// Middleware de Autenticación
export const authMiddleware = async (req, res, next) => {
  // Extraer el header de autorización
  const { authorization } = req.headers;
  // Verificar que el header exista con Bearer token
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({
        msg: "No autorizado, token no proporcionado o formato incorrecto.",
      });
  }
  // Extraer el token del header
  const token = authorization.split(" ")[1];

  try {
    // Verificar el token JWT con la clave secreta
    const decoded = jwt.verify(token, JWT_SECRET);
    // Buscar el usuario con el ID del token
    req.user = await User.findById(decoded.id).select("-password");
    // Si el usuario no existe
    if (!req.user) {
      return res
        .status(401)
        .json({ msg: "No autorizado, usuario no encontrado." });
    }
    // El usuario está autenticado, continuar
    next();
  } catch (error) {
    // El token es inválido
    console.error("Error de autenticación:", error);
    res.status(401).json({ msg: "No autorizado, token inválido." });
  }
};

// Middleware de Verificación de Admin
export const adminMiddleware = (req, res, next) => {
  // Verificar que existe y que tiene rol admin
  if (req.user && req.user.role === "admin") {
    // Es admin, continuar
    next();
  } else {
    // No es admin, denegar
    res
      .status(403)
      .json({ msg: "Acceso denegado, requiere rol de administrador." });
  }
};
