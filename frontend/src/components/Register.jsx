import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import '@/css/components/Form.css'; // Importa el archivo de estilos unificado

/**
 * Register - Componente de formulario de registro de nuevos usuarios
 *
 * Permite crear nuevas cuentas de usuario en la aplicación.
 * Utiliza el AuthContext para gestionar el registro y autenticación automática posterior.
 *
 * Características:
 * - Validación de longitud mínima de contraseña (6 caracteres)
 * - Validación de campos requeridos (HTML5)
 * - Manejo de errores con mensajes descriptivos
 * - Estado de carga durante la petición al servidor
 * - Redirección automática al perfil tras registro exitoso (manejada por AuthContext)
 * - Autocompletado habilitado para mejor experiencia de usuario
 *
 * @component
 */
const Register = () => {
    // Estado para el campo de nombre de usuario
    const [username, setUsername] = useState('');

    // Estado para el campo de email
    const [email, setEmail] = useState('');

    // Estado para el campo de contraseña
    const [password, setPassword] = useState('');

    // Estado para mensajes de error que se muestran al usuario
    const [error, setError] = useState('');

    // Estado para controlar el indicador de carga durante la petición
    const [loading, setLoading] = useState(false);

    // Obtiene la función register desde el AuthContext para crear la cuenta
    const { register } = useAuth();

    /**
     * Maneja el envío del formulario de registro
     * - Previene el comportamiento por defecto del formulario
     * - Limpia errores previos
     * - Valida la longitud mínima de la contraseña (6 caracteres)
     * - Activa el estado de carga
     * - Intenta registrar al usuario mediante AuthContext
     * - Captura y muestra errores si el registro falla
     *
     * @param {Event} e - Evento del formulario
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene la recarga de la página
        setError(''); // Limpia mensajes de error anteriores

        // Validación de contraseña antes de enviar al servidor
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return; // Detiene el proceso si la validación falla
        }

        setLoading(true); // Activa el indicador de carga

        try {
            // Intenta registrar al usuario - si es exitoso, el AuthContext maneja login y redirección
            await register(username, email, password);
        } catch (err) {
            // Captura errores (ej: email ya registrado) y muestra mensaje al usuario
            setError(err.message || 'Error al registrarse. Inténtalo de nuevo.');
        } finally {
            // Desactiva el indicador de carga sin importar el resultado
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Crear Cuenta</h2>

            {/* Muestra mensaje de error solo si existe */}
             {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSubmit} className="form">
                {/* Campo de nombre de usuario */}
                 <div className="form-group">
                    <label htmlFor="register-username">Nombre de Usuario</label>
                    <input
                        id="register-username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required // Validación HTML5 - campo obligatorio
                        className="form-input"
                        autoComplete="username" // Permite autocompletado del navegador
                    />
                </div>

                {/* Campo de email */}
                <div className="form-group">
                    <label htmlFor="register-email">Email</label>
                    <input
                        id="register-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required // Validación HTML5 - campo obligatorio y formato de email
                        className="form-input"
                        autoComplete="email" // Permite autocompletado del navegador
                    />
                </div>

                {/* Campo de contraseña con indicación de requisito mínimo */}
                <div className="form-group">
                    <label htmlFor="register-password">Contraseña (mín. 6 caracteres)</label>
                    <input
                        id="register-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required // Validación HTML5 - campo obligatorio
                        className="form-input"
                        autoComplete="new-password" // Indica al navegador que es una nueva contraseña
                    />
                </div>

                {/* Botón de envío - se deshabilita durante la carga para prevenir múltiples envíos */}
                <button
                    type="submit"
                    disabled={loading}
                    className="button"
                >
                    {/* Texto dinámico según el estado de carga */}
                    {loading ? 'Creando cuenta...' : 'Registrarse'}
                </button>
            </form>
        </div>
    );
};

export default Register;
