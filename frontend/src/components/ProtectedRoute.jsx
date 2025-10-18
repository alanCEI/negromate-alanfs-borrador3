import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

/**
 * ProtectedRoute - Componente de protección de rutas para usuarios autenticados
 *
 * Este componente envuelve rutas que requieren autenticación. Verifica si el usuario
 * está autenticado antes de permitir el acceso a las rutas hijas. Si el usuario no
 * está autenticado, lo redirige a la página de perfil/login.
 *
 * Lógica de protección:
 * 1. Obtiene el estado de autenticación del AuthContext (user y loading)
 * 2. Mientras está cargando, muestra un mensaje de "Cargando..."
 * 3. Si el usuario está autenticado (user existe), renderiza las rutas hijas con <Outlet />
 * 4. Si el usuario NO está autenticado, redirige a "/profile" (página de login)
 *
 * Integración con contextos:
 * - AuthContext: Proporciona el estado del usuario autenticado y el estado de carga
 *
 * Uso típico en App.jsx:
 * <Route element={<ProtectedRoute />}>
 *   <Route path="/cart" element={<ShoppingCart />} />
 * </Route>
 *
 * @returns {JSX.Element} Outlet para rutas hijas si está autenticado, Navigate si no lo está
 */
const ProtectedRoute = () => {
    // Obtiene el usuario actual y el estado de carga desde el AuthContext
    const { user, loading } = useAuth();

    // Mientras se verifica la autenticación, muestra un mensaje de carga
    if (loading) {
        return (
            <div className="loading-message">Cargando...</div>
        );
    }

    // Si hay un usuario autenticado, renderiza las rutas hijas (Outlet)
    // Si no hay usuario, redirige a la página de perfil/login
    // replace: true evita que el usuario pueda volver atrás con el botón del navegador
    return user ? <Outlet /> : <Navigate to="/profile" replace />;
};

export default ProtectedRoute;
