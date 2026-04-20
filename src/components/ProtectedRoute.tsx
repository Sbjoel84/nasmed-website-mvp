import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingScreen } from './ui/loading-spinner';

interface ProtectedRouteProps {
  requireAdmin?: boolean;
}

export function ProtectedRoute({ requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <LoadingScreen message="Checking your session..." size="medium" />;
  }

  if (!user) {
    return <Navigate to="/member-login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/member-dashboard" replace />;
  }

  return <Outlet />;
}

export function PublicRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen message="Checking your session..." size="medium" />;
  }

  if (user) {
    return <Navigate to="/member-dashboard" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;