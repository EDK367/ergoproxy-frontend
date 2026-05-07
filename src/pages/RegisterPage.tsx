import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { useNotificationStore } from '../store/notification.store';
import { authService } from '../services/auth.service';
import {
  validateRequired,
  validateEmail,
  validatePassword,
  validatePhone,
  validateUsername,
} from '../utils/validators';
import type { ApiError } from '../types/api.types';
import '../styles/components/forms.css';

export function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    lastname: '',
    email: '',
    username: '',
    password: '',
    phoneNumber: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const setAuth = useAuthStore((s) => s.setAuth);
  const addToast = useNotificationStore((s) => s.addToast);
  const navigate = useNavigate();

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    const checks = [
      ['name', validateRequired(form.name, 'Nombre')],
      ['lastname', validateRequired(form.lastname, 'Apellido')],
      ['email', validateEmail(form.email)],
      ['username', validateUsername(form.username)],
      ['password', validatePassword(form.password)],
      ['phoneNumber', validatePhone(form.phoneNumber)],
    ] as const;

    for (const [field, result] of checks) {
      if (!result.valid && result.error) e[field] = result.error;
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setApiError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await authService.register(form);
      setAuth(res.data);
      addToast('success', '¡Cuenta creada exitosamente!');
      navigate('/dashboard');
    } catch (err) {
      const apiErr = err as ApiError;
      let msg = apiErr.message || 'Error al registrarse';
      
      if (msg === 'Username already exists') msg = 'El nombre de usuario ya está registrado';
      else if (msg === 'Email already exists') msg = 'El correo electrónico ya está registrado';
      else if (msg === 'Phone number already exists') msg = 'El teléfono ya está registrado';

      addToast('error', msg);
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'name', label: 'Nombre', type: 'text', placeholder: 'Tu nombre', autoComplete: 'given-name' },
    { key: 'lastname', label: 'Apellido', type: 'text', placeholder: 'Tu apellido', autoComplete: 'family-name' },
    { key: 'email', label: 'Correo electrónico', type: 'email', placeholder: 'tu@correo.com', autoComplete: 'email' },
    { key: 'username', label: 'Nombre de usuario', type: 'text', placeholder: 'usuario_123', autoComplete: 'username' },
    { key: 'phoneNumber', label: 'Teléfono', type: 'tel', placeholder: '+5201234567890', autoComplete: 'tel' },
  ];

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '480px' }}>
        <div className="auth-header">
          <div className="auth-logo">EN</div>
          <h1 className="auth-title">Crear Cuenta</h1>
          <p className="auth-subtitle">Regístrate en Ergo Notes</p>
        </div>

        {apiError && <div className="auth-error">{apiError}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {fields.map((f) => (
            <div className="input-group" key={f.key}>
              <label className="input-label" htmlFor={`reg-${f.key}`}>{f.label}</label>
              <input
                id={`reg-${f.key}`}
                className={`input ${errors[f.key] ? 'input-error' : ''}`}
                type={f.type}
                placeholder={f.placeholder}
                value={form[f.key as keyof typeof form]}
                onChange={(e) => update(f.key, e.target.value)}
                autoComplete={f.autoComplete}
              />
              <span className="input-error-text">{errors[f.key] || ''}</span>
            </div>
          ))}

          <div className="input-group">
            <label className="input-label" htmlFor="reg-password">Contraseña</label>
            <div className="input-wrapper">
              <input
                id="reg-password"
                className={`input ${errors.password ? 'input-error' : ''}`}
                type={showPassword ? 'text' : 'password'}
                placeholder="Mínimo 8 caracteres"
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar' : 'Mostrar'}
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
            id="btn-register"
          >
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <div className="auth-footer">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login">Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
}
