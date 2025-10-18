/**
 * Profile - Página de autenticación (Login/Registro)
 *
 * @description
 * Página que permite a los usuarios acceder o crear una cuenta en la aplicación.
 * Alterna entre dos componentes (Login y Register) mediante un toggle, permitiendo
 * al usuario cambiar entre iniciar sesión y registrarse sin navegar a otra página.
 *
 * @component
 * Características principales:
 * - Toggle entre Login y Register en una sola vista
 * - Botones de alternancia con estado activo visual
 * - Renderizado condicional del componente según la opción seleccionada
 * - Diseño centrado y responsive
 *
 * Nota: Esta página solo es accesible para usuarios no autenticados (GuestRoute).
 * Los usuarios autenticados son redirigidos automáticamente.
 *
 * @returns {JSX.Element} Página de perfil con Login o Register
 */

import { useState } from 'react';
import Login from '@/components/Login';
import Register from '@/components/Register';
import '@/css/pages/Profile.css';

const Profile = () => {
    /**
     * Estado para controlar qué componente mostrar
     *
     * - true: Muestra el componente Login
     * - false: Muestra el componente Register
     */
    const [showLogin, setShowLogin] = useState(true);

    return (
        <section className="section profile-page">
            <div className="container profile-container">
                <div className="w-full max-w-md">
                    {/* Botones de toggle para alternar entre Login y Register */}
                    <div className="profile-toggle-buttons">
                        {/* Botón para mostrar Login - Activo cuando showLogin es true */}
                        <button
                            onClick={() => setShowLogin(true)}
                            className={`toggle-button ${showLogin ? 'active' : ''}`}
                        >
                            Iniciar Sesión
                        </button>

                        {/* Botón para mostrar Register - Activo cuando showLogin es false */}
                         <button
                            onClick={() => setShowLogin(false)}
                            className={`toggle-button ${!showLogin ? 'active' : ''}`}
                        >
                            Registrarse
                        </button>
                    </div>

                    {/* Renderizado condicional: Login o Register según el estado */}
                    {showLogin ? <Login /> : <Register />}
                </div>
            </div>
        </section>
    );
};

export default Profile;
