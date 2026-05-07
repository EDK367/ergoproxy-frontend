import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

interface Props {
  children: React.ReactNode;
}

export function GuestRoute({ children }: Props) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const role = useAuthStore((s) => s.role);

  if (isAuthenticated) {
    if (role === 'ADMIN') return <Navigate to="/admin" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
