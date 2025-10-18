/**
 * ============================================
 * SCRIPT DE CREACIÓN DE USUARIO ADMINISTRADOR
 * ============================================
 *
 * Este script crea un usuario con privilegios de administrador en la base de datos.
 * Es útil para configurar el sistema por primera vez o recuperar acceso administrativo.
 *
 * CÓMO USAR ESTE SCRIPT:
 * ----------------------
 * 1. Asegúrate de tener configuradas las variables de entorno en el archivo .env
 * 2. Desde la carpeta 'backend', ejecuta en la terminal:
 *    node scripts/createAdmin.js
 * 3. El script se conectará a MongoDB y creará el usuario admin
 * 4. Si el usuario ya existe, te lo informará sin crear duplicados
 * 5. Guarda las credenciales mostradas en consola
 *
 * IMPORTANTE - SEGURIDAD:
 * -----------------------
 * - Cambia la contraseña predeterminada 'admin123' antes de usar en producción
 * - Modifica el email admin@negromate.com por uno real
 * - Después del primer login, cambia la contraseña desde el perfil de usuario
 * - No compartas las credenciales del admin públicamente
 *
 * QUÉ HACE EL SCRIPT:
 * -------------------
 * 1. Conecta a MongoDB Atlas usando las credenciales del archivo .env
 * 2. Verifica si ya existe un usuario admin con el email especificado
 * 3. Si no existe, hashea la contraseña usando bcrypt (10 rondas de salt)
 * 4. Crea el usuario en la colección 'users' con role: 'admin'
 * 5. Muestra las credenciales de acceso en consola
 * 6. Cierra la conexión y termina el proceso
 *
 * @module scripts/createAdmin
 * @requires mongoose - Cliente de MongoDB para Node.js
 * @requires bcrypt - Librería de hashing de contraseñas
 * @requires ../db/models/User.model - Modelo de datos de usuarios
 * @requires ../config/config - Variables de entorno
 */

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../db/models/User.model.js';
import { DB_USER, DB_PASS, CLUSTER, DATABASE } from '../config/config.js';

/**
 * Función principal que crea el usuario administrador
 * Es asíncrona porque realiza operaciones de base de datos
 */
const createAdminUser = async () => {
    // Construir la URL de conexión a MongoDB Atlas
    // Formato: mongodb+srv://usuario:contraseña@cluster/basededatos?opciones
    const url = `mongodb+srv://${DB_USER}:${DB_PASS}@${CLUSTER}/${DATABASE}?retryWrites=true&w=majority`;

    try {
        // === PASO 1: CONECTAR A MONGODB ATLAS ===
        await mongoose.connect(url);
        console.log("✅ Conectado a MongoDB Atlas");

        // === PASO 2: DEFINIR DATOS DEL USUARIO ADMIN ===
        // IMPORTANTE: Cambia estos valores antes de ejecutar en producción
        const adminData = {
            username: 'admin',                      // Nombre de usuario para login
            email: 'admin@negromate.com',          // Email del administrador
            password: 'admin123',                   // Contraseña en texto plano (será hasheada)
            role: 'admin'                          // Rol que otorga privilegios administrativos
        };

        // === PASO 3: VERIFICAR SI EL ADMIN YA EXISTE ===
        // Buscar en la base de datos si ya hay un usuario con este email
        // Esto previene la creación de admins duplicados
        const adminExists = await User.findOne({ email: adminData.email });

        if (adminExists) {
            // Si existe, mostrar información y salir sin crear nada
            console.log("⚠️ El usuario admin ya existe en la base de datos.");
            console.log(`Email: ${adminExists.email}`);
            console.log(`Role: ${adminExists.role}`);
            process.exit(0); // Salir con código 0 (éxito)
        }

        // === PASO 4: ENCRIPTAR LA CONTRASEÑA ===
        // Nunca almacenar contraseñas en texto plano en la base de datos
        // bcrypt.genSalt(10) genera un "salt" aleatorio con 10 rondas de complejidad
        const salt = await bcrypt.genSalt(10);
        // bcrypt.hash() combina la contraseña con el salt para crear el hash final
        const hashedPassword = await bcrypt.hash(adminData.password, salt);

        // === PASO 5: CREAR EL USUARIO ADMIN EN LA BASE DE DATOS ===
        // User.create() es un método de Mongoose que inserta un nuevo documento
        const adminUser = await User.create({
            username: adminData.username,
            email: adminData.email,
            password: hashedPassword,              // Guardar la contraseña hasheada
            role: 'admin'
        });

        // === PASO 6: MOSTRAR CONFIRMACIÓN Y CREDENCIALES ===
        console.log("✅ Usuario admin creado exitosamente!");
        console.log("=======================================");
        console.log(`ID: ${adminUser._id}`);              // MongoDB ObjectId del usuario
        console.log(`Username: ${adminUser.username}`);
        console.log(`Email: ${adminUser.email}`);
        console.log(`Role: ${adminUser.role}`);
        console.log("=======================================");
        console.log("\n🔐 Credenciales de acceso:");
        console.log(`Email: ${adminData.email}`);
        console.log(`Password: ${adminData.password}`);   // Mostrar contraseña original (no hasheada)
        console.log("\n⚠️ IMPORTANTE: Cambia la contraseña después del primer login");

        // Salir del proceso con código 0 (éxito)
        process.exit(0);

    } catch (error) {
        // Si algo sale mal (error de conexión, validación, etc.), mostrarlo en consola
        console.error("❌ Error al crear usuario admin:", error);
        process.exit(1); // Salir con código 1 (error)
    }
};

// Ejecutar la función principal del script
// Este código se ejecuta inmediatamente cuando se corre el archivo
createAdminUser();
