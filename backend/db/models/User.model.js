/**
 * Modelo de Usuario
 *
 * Define el esquema de la colección 'users' en MongoDB.
 * Este modelo gestiona la información de los usuarios de la aplicación,
 * incluyendo sus credenciales y roles de acceso.
 */

import mongoose from 'mongoose';

/**
 * Esquema de Usuario
 *
 * Campos:
 * - username: Nombre de usuario (obligatorio, sin espacios al inicio/fin)
 * - email: Correo electrónico (obligatorio, único, formato validado, convertido a minúsculas)
 * - password: Contraseña hasheada con bcrypt (obligatorio)
 * - role: Rol del usuario ('user' o 'admin'), por defecto 'user'
 * - timestamps: Añade automáticamente createdAt (fecha de creación) y updatedAt (última actualización)
 */
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'El nombre de usuario es obligatorio'],
        trim: true // Elimina espacios en blanco al inicio y final
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true, // No pueden existir dos usuarios con el mismo email
        trim: true, // Elimina espacios en blanco al inicio y final
        lowercase: true, // Convierte el email a minúsculas antes de guardar
        match: [/\S+@\S+\.\S+/, 'Por favor, introduce un email válido'] // Validación de formato de email
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        // NOTA: La contraseña debe ser hasheada antes de guardarla (usando bcrypt en el controlador)
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Solo puede ser 'user' o 'admin'
        default: 'user' // Por defecto, todos los usuarios son 'user'
    }
}, {
    timestamps: true // Añade automáticamente createdAt y updatedAt
});

// Crear el modelo 'User' a partir del esquema
const User = mongoose.model('User', userSchema);

// Exportar el modelo para usarlo en controladores
export default User;