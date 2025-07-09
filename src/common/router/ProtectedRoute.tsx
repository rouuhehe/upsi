import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "../../auth/hooks/useAuthContext";

export function ProtectedRoute() {
  const authContext = useAuthContext();
  const location = useLocation();

  if (!authContext.session) {
    if (location.pathname === "/welcome") {
      return <Navigate to="/home" replace />;
    }
    return <Navigate to={`/auth/register?from=${location.pathname}`} replace />;
  }

  return <Outlet />;
}
