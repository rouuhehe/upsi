import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "../../auth/hooks/useAuthContext";

export function PublicRoute() {
  const authContext = useAuthContext();
  const location = useLocation();

  if (authContext.session)
    return <Navigate to={`/welcome?from=${location.pathname}`} replace />;

  return <Outlet />;
}
