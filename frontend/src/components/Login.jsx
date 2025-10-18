import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import '@/css/components/Form.css'; // Importa el archivo de estilos unificado

/**
 * Login - Componente de formulario de inicio de sesión
 *
 * Permite a los usuarios autenticarse en la aplicación mediante email y contraseña.
 * Utiliza el AuthContext para gestionar el estado de autenticación global.
 *
 * Características:
 * - Validación de campos requeridos (HTML5)
 * - Manejo de errores con mensajes descriptivos
 * - Estado de carga durante la petición al servidor
 * - Redirección automática al perfil tras login exitoso (manejada por AuthContext)
 * - Autocompletado de credenciales habilitado para mejor UX
 *
 * @component
 */
const Login = () => {
    // Estado para el campo de email del usuario
    const [email, setEmail] = useState('');

    // Estado para el campo de contraseña
    const [password, setPassword] = useState('');

    // Estado para mensajes de error que se muestran al usuario
    const [error, setError] = useState('');

    // Estado para controlar el indicador de carga durante la petición
    const [loading, setLoading] = useState(false);

    // Obtiene la función login desde el AuthContext para autenticar al usuario
    const { login } = useAuth();

    /**
     * Maneja el envío del formulario de login
     * - Previene el comportamiento por defecto del formulario
     * - Limpia errores previos
     * - Activa el estado de carga
     * - Intenta autenticar al usuario mediante AuthContext
     * - Captura y muestra errores si la autenticación falla
     *
     * @param {Event} e - Evento del formulario
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene la recarga de la página
        setError(''); // Limpia mensajes de error anteriores
        setLoading(true); // Activa el indicador de carga

        try {
            // Intenta iniciar sesión - si es exitoso, el AuthContext maneja la redirección
            await login(email, password);
        } catch (err) {
            // Captura errores y muestra mensaje descriptivo al usuario
            setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
        } finally {
            // Desactiva el indicador de carga sin importar el resultado
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Iniciar Sesión</h2>

            {/* Muestra mensaje de error solo si existe */}
            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSubmit} className="form">
                {/* Campo de email */}
                <div className="form-group">
                    <label htmlFor="login-email">Email</label>
                    <input
                        id="login-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required // Validación HTML5 - campo obligatorio
                        className="form-input"
                        autoComplete="email" // Permite autocompletado del navegador
                    />
                </div>

                {/* Campo de contraseña */}
                <div className="form-group">
                    <label htmlFor="login-password">Contraseña</label>
                    <input
                        id="login-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required // Validación HTML5 - campo obligatorio
                        className="form-input"
                        autoComplete="current-password" // Sugiere contraseñas guardadas
                    />
                </div>

                {/* Botón de envío - se deshabilita durante la carga para prevenir múltiples envíos */}
                <button
                    type="submit"
                    disabled={loading}
                    className="button"
                >
                    {/* Texto dinámico según el estado de carga */}
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
        </div>
    );
};

export default Login;
