/**
 * ============================================
 * Controlador de Usuarios
 * ============================================
 */

import User from "../db/models/User.model.js";
import bcrypt from "bcrypt";

// Obtener todos los usuarios (Admin)
export const getAllUsers = async (req, res, next) => {
  // Respuesta de la API
  const ResponseAPI = {
    msg: "Lista de usuarios obtenida",
    data: [],
    status: "ok",
  };
  try {
    // Buscar todos los usuarios en la base de datos
    const users = await User.find({}).select("-password");
    ResponseAPI.data = users;
    res.status(200).json(ResponseAPI);
  } catch (error) {
    // Pasar cualquier error al middleware de manejo de errores
    next(error);
  }
};

// Obtener un usuario por su ID (Admin)
export const getUserById = async (req, res, next) => {
  // Extraer el ID del usuario
  const { id } = req.params;
  const ResponseAPI = {
    msg: "Usuario encontrado",
    data: null,
    status: "ok",
  };

  try {
    // Buscar usuario por ID
    const user = await User.findById(id).select("-password");
    if (user) {
      ResponseAPI.data = user;
      res.status(200).json(ResponseAPI);
    } else {
      // Si no se encuentra el usuario, error
      ResponseAPI.msg = "Usuario no encontrado";
      ResponseAPI.status = "error";
      res.status(404).json(ResponseAPI);
    }
  } catch (error) {
    next(error);
  }
};

// Actualizar un usuario por su ID
export const updateUser = async (req, res, next) => {
  // Extraer ID del usuario
  const { id } = req.params;
  // Extraer campos a actualizar
  const { username, email, password, role } = req.body;
  const ResponseAPI = {
    msg: "Usuario actualizado con éxito",
    data: null,
    status: "ok",
  };

  try {
    // Buscar el usuario
    const user = await User.findById(id);
    if (!user) {
      ResponseAPI.msg = "Usuario no encontrado";
      ResponseAPI.status = "error";
      return res.status(404).json(ResponseAPI);
    }
    // Verificar que el usuario solo pueda modificarse a sí mismo, a menos que sea admin
    if (req.user.role !== "admin" && req.user._id.toString() !== id) {
      ResponseAPI.msg = "No tienes permiso para modificar este usuario";
      ResponseAPI.status = "error";
      return res.status(403).json(ResponseAPI);
    }
    // Actualizar solo los campos proporcionados
    if (username !== undefined) user.username = username;
    if (email !== undefined) user.email = email;
    // Si se proporciona una nueva contraseña, hashearla
    if (password !== undefined && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10); // Generar salt para el hash
      user.password = await bcrypt.hash(password, salt); // Hashear la contraseña
    }
    // Solo admin puede cambiar roles de usuarios
    if (role !== undefined && req.user.role === "admin") {
      user.role = role;
    }
    // Guardar los cambios en la base de datos
    const updatedUser = await user.save();
    // Excluir la contraseña por seguridad
    const userResponse = updatedUser.toObject();
    delete userResponse.password;
    ResponseAPI.data = userResponse;
    res.status(200).json(ResponseAPI);
  } catch (error) {
    next(error);
  }
};

// Eliminar un usuario por su ID (Admin)
export const deleteUser = async (req, res, next) => {
  // Extraer ID del usuario
  const { id } = req.params;
  const ResponseAPI = {
    msg: "Usuario eliminado con éxito",
    data: null,
    status: "ok",
  };

  try {
    // Buscar el usuario
    const user = await User.findById(id);
    if (!user) {
      ResponseAPI.msg = "Usuario no encontrado";
      ResponseAPI.status = "error";
      return res.status(404).json(ResponseAPI);
    }
    // Prevenir que el admin se autoelimine
    if (req.user._id.toString() === id) {
      ResponseAPI.msg = "No puedes eliminar tu propia cuenta";
      ResponseAPI.status = "error";
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
