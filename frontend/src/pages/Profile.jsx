/** -------------------------------------------------------------------
 * ============================================
 * Página de "Profile" (Login/Registro)
 * ============================================
 */

import { useState } from "react";
import Login from "@/components/Login";
import Register from "@/components/Register";
import "@/css/pages/Profile.css";

const Profile = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <section className="u-section Profile">
      <div className="u-container Profile-container">
        {/* Botones para cambiar entre Login y Register */}
        <div className="Profile-toggleButtons">
            {/* Botón para mostrar Login cuando showLogin es true */}
            <button
              onClick={() => setShowLogin(true)}
              className={`ToggleButton ${showLogin ? "ToggleButton--active" : ""}`}
            >
              Iniciar Sesión
            </button>
            {/* Botón para mostrar Register cuando showLogin es false */}
            <button
              onClick={() => setShowLogin(false)}
              className={`ToggleButton ${!showLogin ? "ToggleButton--active" : ""}`}
            >
              Registrarse
            </button>
        </div>
        {/* Login o Register según el estado */}
        {showLogin ? <Login /> : <Register />}
      </div>
    </section>
  );
};

export default Profile;
