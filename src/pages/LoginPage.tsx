import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { useNotificationStore } from '../store/notification.store';
import { authService } from '../services/auth.service';
import { validateRequired, validatePassword } from '../utils/validators';
import type   { ApiError } from '../types/api.types';
import '../styles/components/forms.css';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const setAuth = useAuthStore((s) => s.setAuth);
  const addToast = useNotificationStore((s) => s.addToast);
  const navigate = useNavigate();

  const validate = (): boolean => {
    const e: typeof errors = {};
    const uRes = validateRequired(username, 'Usuario');
    if (!uRes.valid) e.username = uRes.error;
    const pRes = validatePassword(password);
    if (!pRes.valid) e.password = pRes.error;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await authService.login({ username, password });
      setAuth(res.data);
      addToast('success', `Bienvenido, ${res.data.name}!`);
      if (res.data.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const apiErr = err as ApiError;
      setApiError(apiErr.message || 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">EN</div>
          <h1 className="auth-title">Bienvenido</h1>
          <p className="auth-subtitle">Inicia sesión en Ergo Notes</p>
        </div>

        {apiError && <div className="auth-error">{apiError}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label className="input-label" htmlFor="login-username">Usuario</label>
            <input
              id="login-username"
              className={`input ${errors.username ? 'input-error' : ''}`}
              type="text"
              placeholder="Tu nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
            />
            <span className="input-error-text">{errors.username || ''}</span>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="login-password">Contraseña</label>
            <div className="input-wrapper">
              <input
                id="login-password"
                className={`input ${errors.password ? 'input-error' : ''}`}
                type={showPassword ? 'text' : 'password'}
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
            <span className="input-error-text">{errors.password || ''}</span>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
            id="btn-login"
          >
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="auth-footer">
          ¿No tienes cuenta?{' '}
          <Link to="/register">Regístrate aquí</Link>
        </div>
      </div>
    </div>
  );
}
