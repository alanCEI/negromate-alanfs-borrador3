/**
 * Middleware Global de Manejo de Errores
 *
 * Este middleware centraliza el manejo de errores de toda la aplicación.
 * Se ejecuta cuando cualquier controlador o middleware llama a next(error).
 *
 * Características:
 * - Captura todos los errores no manejados en rutas y controladores
 * - Registra el error en la consola del servidor para debugging
 * - Retorna una respuesta JSON estructurada con información del error
 * - Usa código de estado HTTP apropiado (del error o 500 por defecto)
 *
 * IMPORTANTE: Este middleware debe ser el ÚLTIMO en registrarse en app.use()
 */

/**
 * Middleware de manejo de errores
 *
 * @param {Error} err - Objeto de error (puede tener propiedades statusCode y message)
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @param {Function} next - Siguiente middleware (no se usa en middleware de error)
 *
 * Estructura de respuesta:
 * {
 *   status: 'error',
 *   statusCode: número (400, 404, 500, etc.),
 *   message: string descriptivo del error
 * }
 */
const errorMiddleware = (err, req, res, next) => {
    // Registrar el stack trace completo del error en la consola del servidor
    // Útil para debugging y logs
    console.error(err.stack);

    // Determinar el código de estado HTTP del error
    // Si el error tiene statusCode, usarlo; si no, usar 500 (Internal Server Error)
    const statusCode = err.statusCode || 500;

    // Determinar el mensaje de error
    // Si el error tiene mensaje, usarlo; si no, usar mensaje genérico
    const message = err.message || 'Ha ocurrido un error interno en el servidor.';

    // Enviar respuesta JSON con formato estándar de error
    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
    });
};

export default errorMiddleware;