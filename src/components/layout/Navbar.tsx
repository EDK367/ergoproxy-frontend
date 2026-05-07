import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { APP_CONFIG } from '../../config/api.config';
import '../../styles/components/navbar.css';

export function Navbar() {
  const { username, name, role, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;
  const initial = name ? name.charAt(0) : username ? username.charAt(0) : '?';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to={role === 'ADMIN' ? '/admin' : '/dashboard'} className="navbar-brand">
          <div className="navbar-brand-icon">EP</div>
          {APP_CONFIG.APP_NAME}
        </Link>

        <div className="navbar-nav">
          {role === 'ADMIN' ? (
            <>
              <Link
                to="/admin"
                className={`navbar-link ${isActive('/admin') ? 'active' : ''}`}
              >
                Panel Admin
              </Link>
              <Link
                to="/dashboard"
                className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                Mis Notas
              </Link>
            </>
          ) : (
            <Link
              to="/dashboard"
              className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`}
            >
              Mis Notas
            </Link>
          )}
          <Link
            to="/profile"
            className={`navbar-link ${isActive('/profile') ? 'active' : ''}`}
          >
            Perfil
          </Link>
        </div>

        <div className="navbar-user">
          <div className="navbar-avatar">{initial}</div>
          <div>
            <div className="navbar-username">{username}</div>
            <span className={`navbar-role ${role === 'ADMIN' ? 'navbar-role-admin' : 'navbar-role-user'}`}>
              {role}
            </span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout} id="btn-logout">
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
}
