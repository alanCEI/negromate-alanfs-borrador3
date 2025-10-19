/**
 * ============================================ 
 * HASH DE CONTRASEÑAS
 * ============================================
 */

import bcrypt from "bcrypt";

// Configuración
const plainPassword = "admin123";
const hashPassword = async () => {
  // Generar el salt
  const salt = await bcrypt.genSalt(10);
  // Crear el hash combinando la contraseña con el salt
  const hashedPassword = await bcrypt.hash(plainPassword, salt);
  // Resultados en consola
  console.log("=======================================");
  console.log("Contraseña en texto plano:", plainPassword);
  console.log("Contraseña hasheada:", hashedPassword);
  console.log("=======================================");
  console.log('\nUsa este valor en el campo "password" de MongoDB:');
  console.log(hashedPassword);
  console.log(
    "\n💡 RECUERDA: Cada vez que ejecutes este script, el hash será diferente"
  );
  console.log(
    "   debido al salt aleatorio, pero todos los hashes serán válidos para"
  );
  console.log("   la misma contraseña original.");
};

hashPassword();
