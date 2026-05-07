import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

export function NotFoundPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <div className="auth-page" style={{ flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <div style={{ fontSize: '6rem', opacity: 0.2 }}>404</div>
      <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>Página no disponible</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', maxWidth: '400px', textAlign: 'center' }}>
        La página que buscas no existe o ha sido movida.
      </p>
      <Link to={isAuthenticated ? '/dashboard' : '/login'} className="btn btn-primary">
        Volver al inicio
      </Link>
    </div>
  );
}
