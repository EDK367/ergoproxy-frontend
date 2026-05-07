import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

interface Props {
  children: React.ReactNode;
}

export function AdminRoute({ children }: Props) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const role = useAuthStore((s) => s.role);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role !== 'ADMIN') {
    return <Navigate to="/restricted" replace />;
  }

  return <>{children}</>;
}
