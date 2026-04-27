import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingScreen } from './ui/loading-spinner';

interface ProtectedRouteProps {
  requireAdmin?: boolean;
}

export function ProtectedRoute({ requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading, isAdmin, mustChangePassword } = useAuth();

  if (loading) {
    return <LoadingScreen message="Checking your session..." size="medium" />;
  }

  if (!user) {
    return <Navigate to="/member-login" replace />;
  }

  // Force password change before accessing any protected page
  if (mustChangePassword) {
    return <Navigate to="/member-login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/member-dashboard" replace />;
  }

  return <Outlet />;
}

export function PublicRoute() {
  const { user, loading, mustChangePassword } = useAuth();

  if (loading) {
    return <LoadingScreen message="Checking your session..." size="medium" />;
  }

  // Allow user to stay on login page if they must change their password
  if (user && mustChangePassword) {
    return <Outlet />;
  }

  if (user) {
    return <Navigate to="/member-dashboard" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
