import { useState, useEffect } from 'react';
import { userService } from '../services/user.service';
import type { UserProfile } from '../types/user.types';
import { useAuthStore } from '../store/auth.store';
import { useNotificationStore } from '../store/notification.store';
import { LoadingScreen } from '../components/ui/Spinner';
import { ErrorState } from '../components/ui/EmptyState';
import type { ApiError } from '../types/api.types';

export function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const addToast = useNotificationStore((s) => s.addToast);
  const role = useAuthStore((s) => s.role);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true); setError('');
    try { const res = await userService.getMyProfile(); setProfile(res.data); }
    catch (err) { setError((err as ApiError).message || 'Error al cargar perfil'); }
    finally { setLoading(false); }
  };

  const copyFriendCode = async () => {
    if (!profile) return;
    try {
      await navigator.clipboard.writeText(profile.id);
      setCopied(true);
      addToast('success', 'Código de amigo copiado');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast('error', 'No se pudo copiar');
    }
  };

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorState message={error} onRetry={loadProfile} />;
  if (!profile) return null;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', animation: 'fadeInUp var(--transition-slow) forwards' }}>
      <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: 'var(--space-xl)' }}>Mi Perfil</h2>

      <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'white',
          }}>
            {profile.name.charAt(0)}
          </div>
          <div>
            <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>{profile.name} {profile.lastname}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>@{profile.username}</p>
            <span className={`badge ${role === 'ADMIN' ? 'badge-danger' : 'badge-primary'}`} style={{ marginTop: '4px' }}>{profile.role}</span>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
          {[
            { label: 'Correo', value: profile.email, icon: '📧' },
            { label: 'Teléfono', value: profile.phoneNumber, icon: '📱' },
            { label: 'Usuario', value: profile.username, icon: '👤' },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>{item.icon} {item.label}</span>
              <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Friend Code */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.08), rgba(0, 212, 170, 0.05))', border: '1px solid rgba(108, 99, 255, 0.2)' }}>
        <h4 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, marginBottom: 'var(--space-sm)' }}>🔗 Código de Amigo</h4>
        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
          Comparte este código con tus amigos para que puedan compartir notas contigo
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
          <code style={{
            flex: 1, padding: '10px 14px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-primary)',
            border: '1px solid var(--border-default)', wordBreak: 'break-all',
          }}>
            {profile.id}
          </code>
          <button className="btn btn-primary btn-sm" onClick={copyFriendCode} id="btn-copy-friend-code">
            {copied ? '✓ Copiado' : 'Copiar'}
          </button>
        </div>
      </div>
    </div>
  );
}
