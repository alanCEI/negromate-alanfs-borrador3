/**
 * ============================================
 * Middleware Global de Manejo de Errores
 * ============================================
 */

// Middleware de manejo de errores
const errorMiddleware = (err, req, res, next) => {
  // Error en la consola
  console.error(err.stack);
  // Código de estado del error
  const statusCode = err.statusCode || 500;
  // Mensaje de error
  const message = err.message || "Ha ocurrido un error interno en el servidor.";
  // Enviar respuesta JSON
  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
  });
};

export default errorMiddleware;
