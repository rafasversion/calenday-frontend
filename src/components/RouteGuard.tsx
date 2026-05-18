import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth: boolean;
}

const RouteGuard = ({ children, requireAuth }: RouteGuardProps) => {
  const { isLogged, loading } = useContext(UserContext);

  if (loading) return null;

  if (requireAuth && !isLogged) {
    return <Navigate to="/" replace />;
  }

  if (!requireAuth && isLogged) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default RouteGuard;
