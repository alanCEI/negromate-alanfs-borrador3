/**
 * ============================================
 * Página de Profile (Login/Registro)
 * ============================================
 */

import { useState } from "react";
import Login from "@/components/Login";
import Register from "@/components/Register";
import "@/css/pages/Profile.css";

const Profile = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <section className="section ProfilePage">
      <div className="container ProfilePage-container">
        <div className="w-full max-w-md">
          {/* Botones para cambiar entre Login y Register */}
          <div className="ProfilePage-toggleButtons">
            {/* Botón para mostrar Login cuando showLogin es true */}
            <button
              onClick={() => setShowLogin(true)}
              className={`ToggleButton flex-1 py-3 text-lg font-bold transition text-sub ${showLogin ? "is-active" : ""}`}
            >
              Iniciar Sesión
            </button>
            {/* Botón para mostrar Register cuando showLogin es false */}
            <button
              onClick={() => setShowLogin(false)}
              className={`ToggleButton flex-1 py-3 text-lg font-bold transition text-sub ${!showLogin ? "is-active" : ""}`}
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
