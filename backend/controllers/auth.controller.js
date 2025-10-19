/**
 * ============================================
 * Controlador de Autenticación
 * ============================================
 */

import User from "../db/models/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js";

// Función auxiliar para generar un token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: "90d", // expira en 90 días
  });
};

// Registro de un nuevo usuario
export const registerUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  // Respuesta de la API
  const ResponseAPI = {
    msg: "Usuario registrado con éxito",
    data: null,
    status: "ok",
  };

  try {
    // Validar que esten todos los campos requeridos
    if (!username || !email || !password) {
      ResponseAPI.msg = "Todos los campos son obligatorios";
      ResponseAPI.status = "error";
      return res.status(400).json(ResponseAPI);
    }
    // Verificar si el email ya está registrado
    const userExists = await User.findOne({ email });
    if (userExists) {
      ResponseAPI.msg = "El email ya está registrado";
      ResponseAPI.status = "error";
      return res.status(400).json(ResponseAPI);
    }
    // Encriptar la contraseña usando bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Crear el nuevo usuario en la base de datos
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    // Si el usuario se creó exitosamente
    if (newUser) {
      // Generar un token JWT para que el usuario quede autenticado
      const token = generateToken(newUser._id);
      ResponseAPI.data = {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        token: token,
      };
      res.status(201).json(ResponseAPI);
    } else {
      ResponseAPI.msg = "Datos de usuario inválidos";
      ResponseAPI.status = "error";
      res.status(400).json(ResponseAPI);
    }
  } catch (error) {
    // Pasar el error al middleware de manejo de errores
    next(error);
  }
};

// Inicio de sesión de un usuario
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  // Respuesta de la API
  const ResponseAPI = {
    msg: "Inicio de sesión exitoso",
    data: null,
    status: "ok",
  };

  try {
    // Buscar usuario por email
    const user = await User.findOne({ email });
    // Verificar que el usuario existe y que la contraseña es correcta
    if (user && (await bcrypt.compare(password, user.password))) {
      // Generar un nuevo token JWT
      const token = generateToken(user._id);
      ResponseAPI.data = {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: token,
      };
      res.status(200).json(ResponseAPI);
    } else {
      // Si el usuario no existe o la contraseña es incorrecta
      ResponseAPI.msg = "Credenciales inválidas";
      ResponseAPI.status = "error";
      res.status(401).json(ResponseAPI);
    }
  } catch (error) {
    // Pasar el error al middleware de manejo de errores
    next(error);
  }
};

// Obtener perfil del usuario autenticado
export const getUserProfile = async (req, res, next) => {
  const ResponseAPI = {
    msg: "Perfil de usuario obtenido",
    data: req.user,
    status: "ok",
  };
  res.status(200).json(ResponseAPI);
};
