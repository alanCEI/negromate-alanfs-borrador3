/** -------------------------------------------------------------------
 * ==================================================================
 * Componente de protección de rutas para usuarios no autenticados
 * ==================================================================
 */

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const GuestRoute = () => {
  const { user, loading } = useAuth();
  // Mensaje de carga
  if (loading) {
    return <div className="u-loadingMessage">Cargando...</div>;
  }
  // Si el usuario está autenticado lo redirigimos al carrito de compras, si no está autenticado (invitado)
  return user ? <Navigate to="/cart" replace /> : <Outlet />;
};

export default GuestRoute;
