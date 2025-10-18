import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

/**
 * GuestRoute - Componente de protección de rutas para usuarios NO autenticados
 *
 * Este componente envuelve rutas que solo deben ser accesibles para usuarios que NO
 * están autenticados (invitados). Si un usuario ya está autenticado e intenta acceder
 * a estas rutas, es redirigido automáticamente al carrito de compras.
 *
 * Lógica de protección:
 * 1. Obtiene el estado de autenticación del AuthContext (user y loading)
 * 2. Mientras está cargando, muestra un mensaje de "Cargando..."
 * 3. Si el usuario está autenticado (user existe), redirige a "/cart"
 * 4. Si el usuario NO está autenticado, renderiza las rutas hijas con <Outlet />
 *
 * Integración con contextos:
 * - AuthContext: Proporciona el estado del usuario autenticado y el estado de carga
 *
 * Uso típico en App.jsx:
 * <Route element={<GuestRoute />}>
 *   <Route path="/profile" element={<Profile />} />
 * </Route>
 *
 * Esto previene que usuarios autenticados accedan a páginas como login/register,
 * mejorando la experiencia de usuario al redirigirlos a una página relevante.
 *
 * @returns {JSX.Element} Navigate al carrito si está autenticado, Outlet si es invitado
 */
const GuestRoute = () => {
    // Obtiene el usuario actual y el estado de carga desde el AuthContext
    const { user, loading } = useAuth();

    // Mientras se verifica la autenticación, muestra un mensaje de carga
    if (loading) {
        return (
             <div className="loading-message">Cargando...</div>
        );
    }

    // Si el usuario está autenticado, lo redirigimos al carrito de compras
    // Si no está autenticado (es invitado), renderiza las rutas hijas (Outlet)
    // replace: true evita que el usuario pueda volver atrás con el botón del navegador
    return user ? <Navigate to="/cart" replace /> : <Outlet />;
};

export default GuestRoute;
