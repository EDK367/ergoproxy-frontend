import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

export function RateLimitPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <div className="auth-page" style={{ flexDirection: 'column', gap: 'var(--space-lg)', textAlign: 'center' }}>
      <div style={{ fontSize: '6rem' }}>🤖</div>
      <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        ¿Eres un bot?
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-md)', maxWidth: '500px', lineHeight: 1.5 }}>
        Hemos detectado demasiadas solicitudes seguidas (Límite excedido). <br/>
        Por favor, tómate un pequeño respiro y vuelve a intentarlo en unos instantes.
      </p>
      <Link to={isAuthenticated ? '/dashboard' : '/login'} className="btn btn-primary" style={{ marginTop: 'var(--space-md)' }}>
        Volver al inicio
      </Link>
    </div>
  );
}
