/**
 * ============================================
 * SCRIPT DE HASH DE CONTRASEÑAS
 * ============================================
 *
 * Este script convierte una contraseña en texto plano a un hash bcrypt.
 * Es útil para crear contraseñas hasheadas que puedas insertar manualmente
 * en MongoDB Atlas o para probar el proceso de hashing.
 *
 * CÓMO USAR ESTE SCRIPT:
 * ----------------------
 * 1. Modifica la variable 'plainPassword' con la contraseña que quieres hashear
 * 2. Desde la carpeta 'backend', ejecuta en la terminal:
 *    node scripts/hashPassword.js
 * 3. El script mostrará tanto la contraseña original como el hash generado
 * 4. Copia el hash y úsalo en el campo 'password' de MongoDB
 *
 * CUÁNDO USAR ESTE SCRIPT:
 * ------------------------
 * - Cuando necesitas crear usuarios manualmente en MongoDB Atlas
 * - Para resetear contraseñas de usuarios existentes
 * - Para probar y entender cómo funciona bcrypt
 * - Cuando no puedes usar el endpoint de registro de la API
 *
 * NOTA IMPORTANTE:
 * ----------------
 * Este script NO guarda la contraseña en la base de datos.
 * Solo genera el hash que debes copiar y pegar manualmente.
 * Si quieres crear un usuario completo automáticamente, usa createAdmin.js
 *
 * ¿POR QUÉ USAR BCRYPT?
 * ---------------------
 * bcrypt es un algoritmo de hashing diseñado específicamente para contraseñas:
 * - Es lento intencionalmente para prevenir ataques de fuerza bruta
 * - Genera un "salt" único para cada contraseña
 * - Incluye el salt en el hash, permitiendo verificación sin almacenarlo por separado
 * - El número de rondas (10) determina la complejidad y tiempo de procesamiento
 *
 * @module scripts/hashPassword
 * @requires bcrypt - Librería de hashing de contraseñas
 */

import bcrypt from 'bcrypt';

// === CONFIGURACIÓN ===
// Cambia este valor por la contraseña que deseas hashear
const plainPassword = 'admin123';

/**
 * Función principal que hashea la contraseña
 * Es asíncrona porque bcrypt realiza operaciones que toman tiempo
 */
const hashPassword = async () => {
    // PASO 1: Generar el "salt"
    // El salt es una cadena aleatoria que se mezcla con la contraseña
    // El número 10 representa las "rondas" - mayor número = más seguro pero más lento
    // 10 rondas es el estándar recomendado (equilibrio entre seguridad y rendimiento)
    const salt = await bcrypt.genSalt(10);

    // PASO 2: Crear el hash combinando la contraseña con el salt
    // El resultado es una cadena de ~60 caracteres que incluye:
    // - El algoritmo usado ($2b$)
    // - El número de rondas (10)
    // - El salt
    // - El hash de la contraseña
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    // PASO 3: Mostrar resultados en consola
    console.log('=======================================');
    console.log('Contraseña en texto plano:', plainPassword);
    console.log('Contraseña hasheada:', hashedPassword);
    console.log('=======================================');
    console.log('\nUsa este valor en el campo "password" de MongoDB:');
    console.log(hashedPassword);
    console.log('\n💡 RECUERDA: Cada vez que ejecutes este script, el hash será diferente');
    console.log('   debido al salt aleatorio, pero todos los hashes serán válidos para');
    console.log('   la misma contraseña original.');
};

// Ejecutar la función de hashing
// Este código se ejecuta inmediatamente cuando se corre el archivo
hashPassword();
