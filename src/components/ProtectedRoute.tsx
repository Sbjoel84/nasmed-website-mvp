import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  requireAdmin?: boolean;
}

export function ProtectedRoute({ requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nasmed-off-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-nasmed-green border-t-transparent rounded-full animate-spin"></div>
          <p className="text-nasmed-text-muted">Loading...</p>
        </div>
      </div>
    );
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-nasmed-off-white">
        <div className="w-12 h-12 border-4 border-nasmed-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/member-dashboard" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;