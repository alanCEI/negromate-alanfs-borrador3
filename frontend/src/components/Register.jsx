/** -------------------------------------------------------------------
 * ============================================
 * Componente del formulario de registro
 * ============================================
 */

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import "@/css/components/Form.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  // Envío del formulario de registro
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // Validación de la contraseña
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setLoading(true);

    try {
      // Intentamos registrar al usuario
      await register(username, email, password);
    } catch (err) {
      // Captura errores y muesta mensaje
      setError(err.message || "Error al registrarse. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="FormContainer">
      <h2>Crear Cuenta</h2>
      {/* Mensaje de error si existe */}
      {error && <p className="u-errorMessage">{error}</p>}
      {/* Formulario */}
      <form onSubmit={handleSubmit} className="Form">
        {/* Campo de nombre de usuario */}
        <div className="Form-group">
          <label htmlFor="register-username">Nombre de Usuario</label>
          <input
            id="register-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="Form-input"
            autoComplete="username"
          />
        </div>
        {/* Campo de email */}
        <div className="Form-group">
          <label htmlFor="register-email">Email</label>
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="Form-input"
            autoComplete="email"
          />
        </div>
        {/* Campo de contraseña */}
        <div className="Form-group">
          <label htmlFor="register-password">
            Contraseña (mín. 6 caracteres)
          </label>
          <input
            id="register-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="Form-input"
            autoComplete="new-password"
          />
        </div>
        {/* Botón de envío */}
        <button type="submit" disabled={loading} className="Button">
          {/* Estado de carga */}
          {loading ? "Creando cuenta..." : "Registrarse"}
        </button>
      </form>
    </div>
  );
};

export default Register;
