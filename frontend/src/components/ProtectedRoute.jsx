/**
 * =================================================================
 * Componente de protección de rutas para usuarios autenticados
 * =================================================================
 */

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  // Mensaje de carga
  if (loading) {
    return <div className="loading-message">Cargando...</div>;
  }
  // Si hay un usuario autenticado renderiza Outlet, si no hay usuario redirige a la página de login
  return user ? <Outlet /> : <Navigate to="/profile" replace />;
};

export default ProtectedRoute;
