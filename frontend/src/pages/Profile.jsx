/**
 *
 * Página de Profile (Login/Registro)
 *
 */

import { useState } from "react";
import Login from "@/components/Login";
import Register from "@/components/Register";
import "@/css/pages/Profile.css";

const Profile = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <section className="section profile-page">
      <div className="container profile-container">
        <div className="w-full max-w-md">
          {/* Botones para cambiar entre Login y Register */}
          <div className="profile-toggle-buttons">
            {/* Botón para mostrar Login cuando showLogin es true */}
            <button
              onClick={() => setShowLogin(true)}
              className={`toggle-button ${showLogin ? "active" : ""}`}
            >
              Iniciar Sesión
            </button>
            {/* Botón para mostrar Register cuando showLogin es false */}
            <button
              onClick={() => setShowLogin(false)}
              className={`toggle-button ${!showLogin ? "active" : ""}`}
            >
              Registrarse
            </button>
          </div>
          {/* Login o Register según el estado */}
          {showLogin ? <Login /> : <Register />}
        </div>
      </div>
    </section>
  );
};

export default Profile;
