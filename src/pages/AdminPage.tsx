import { useState, useEffect } from 'react';
import { userService } from '../services/user.service';
import { noteService } from '../services/note.service';
import type { UserDTO } from '../types/user.types';
import type { NoteResponse } from '../types/note.types';
import { LoadingScreen } from '../components/ui/Spinner';
import { ErrorState } from '../components/ui/EmptyState';
import type { ApiError } from '../types/api.types';
import { formatDate } from '../utils/format';
import '../styles/components/admin.css';

type Tab = 'users' | 'notes';

export function AdminPage() {
  const [tab, setTab] = useState<Tab>('users');
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [notes, setNotes] = useState<NoteResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  useEffect(() => {
    if (tab === 'users') loadUsers();
    else loadNotes();
  }, [tab]);

  const loadUsers = async () => {
    setLoading(true); setError('');
    try { const res = await userService.getAllUsers(); setUsers(res.data); }
    catch (err) { setError((err as ApiError).message || 'Error'); }
    finally { setLoading(false); }
  };

  const loadNotes = async () => {
    setLoading(true); setError('');
    try { const res = await noteService.getMyNotes(); setNotes(res.data); }
    catch (err) { setError((err as ApiError).message || 'Error'); }
    finally { setLoading(false); }
  };

  const filtered = tab === 'users'
    ? users.filter(u => u.username.toLowerCase().includes(search.toLowerCase()) || u.role.toLowerCase().includes(search.toLowerCase()))
    : notes.filter(n => n.title.toLowerCase().includes(search.toLowerCase()) || n.username.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorState message={error} onRetry={tab === 'users' ? loadUsers : loadNotes} />;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div><h2 className="admin-title">Panel de Administración</h2><p className="admin-subtitle">Gestión del sistema Ergo Notes</p></div>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-value">{users.length}</div><div className="stat-label">Usuarios</div></div>
        <div className="stat-card"><div className="stat-value">{users.filter(u=>u.enabled).length}</div><div className="stat-label">Activos</div></div>
        <div className="stat-card"><div className="stat-value">{users.filter(u=>u.role==='ADMIN').length}</div><div className="stat-label">Admins</div></div>
        <div className="stat-card"><div className="stat-value">{notes.length}</div><div className="stat-label">Notas visibles</div></div>
      </div>

      <div className="admin-tabs" style={{ marginBottom: 'var(--space-lg)' }}>
        <button className={`admin-tab ${tab==='users'?'active':''}`} onClick={()=>setTab('users')}>Usuarios</button>
        <button className={`admin-tab ${tab==='notes'?'active':''}`} onClick={()=>setTab('notes')}>Notas</button>
      </div>

      <div className="admin-search">
        <input className="input" placeholder={tab==='users'?'Buscar usuarios...':'Buscar notas...'} value={search} onChange={e=>setSearch(e.target.value)} id="admin-search"/>
      </div>

      {tab === 'users' ? (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead><tr><th>Usuario</th><th>Rol</th><th>Estado</th><th>Metadata</th><th>Logins</th></tr></thead>
            <tbody>
              {(filtered as UserDTO[]).map(u=>(
                <tr key={u.id} onClick={()=>setExpandedUser(expandedUser===u.id?null:u.id)} style={{cursor:'pointer'}}>
                  <td><strong>{u.username}</strong><br/><span style={{fontSize:'var(--font-size-xs)',color:'var(--text-muted)',fontFamily:'var(--font-mono)'}}>{u.id}</span></td>
                  <td><span className={`badge ${u.role==='ADMIN'?'badge-danger':'badge-primary'}`}>{u.role}</span></td>
                  <td><div className="user-status"><span className={`status-dot ${u.enabled?'active':'inactive'}`}/>{u.enabled?'Activo':'Inactivo'}</div></td>
                  <td style={{fontSize:'var(--font-size-xs)',color:'var(--text-muted)',maxWidth:'200px',overflow:'hidden',textOverflow:'ellipsis'}}>{u.metadata||'—'}</td>
                  <td>
                    <span className="badge badge-accent">{u.logsInfo.length}</span>
                    {expandedUser===u.id && u.logsInfo.length>0 && (
                      <div className="admin-user-logs" onClick={e=>e.stopPropagation()}>
                        <div className="admin-user-logs-title">Historial de Login</div>
                        {u.logsInfo.slice(0,10).map((l,i)=>(<div key={i} className="admin-log-entry">{l.ip} — {formatDate(l.createdAt)}</div>))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(filtered as UserDTO[]).length===0 && <div style={{padding:'var(--space-xl)',textAlign:'center',color:'var(--text-muted)'}}>Sin resultados</div>}
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead><tr><th>Título</th><th>Autor</th><th>Importante</th><th>Compartida</th><th>Creada</th></tr></thead>
            <tbody>
              {(filtered as NoteResponse[]).map(n=>(
                <tr key={n.id}>
                  <td><strong>{n.title}</strong></td>
                  <td>{n.username}</td>
                  <td>{n.important?<span className="badge badge-danger">★ Sí</span>:<span style={{color:'var(--text-muted)'}}>No</span>}</td>
                  <td>{n.isShared?<span className="badge badge-accent">Sí</span>:<span style={{color:'var(--text-muted)'}}>No</span>}</td>
                  <td style={{fontSize:'var(--font-size-xs)',color:'var(--text-muted)'}}>{formatDate(n.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(filtered as NoteResponse[]).length===0 && <div style={{padding:'var(--space-xl)',textAlign:'center',color:'var(--text-muted)'}}>Sin resultados</div>}
        </div>
      )}
    </div>
  );
}
