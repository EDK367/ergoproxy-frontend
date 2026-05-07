import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

export function RestrictedPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const role = useAuthStore((s) => s.role);

  // aca esta lo correcto
  return (
    <div className="auth-page" style={{ flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <div style={{ fontSize: '5rem', opacity: 0.2 }}>🔒</div>
      <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>Acceso Restringido</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', maxWidth: '400px', textAlign: 'center' }}>
        No tienes permisos para acceder a esta sección. Contacta al administrador si crees que es un error.
      </p>
      <Link
        to={isAuthenticated ? (role === 'ADMIN' ? '/admin' : '/dashboard') : '/login'}
        className="btn btn-primary"
      >
        {isAuthenticated ? 'Ir al inicio' : 'Iniciar sesión'}
      </Link>
    </div>
  );
}
