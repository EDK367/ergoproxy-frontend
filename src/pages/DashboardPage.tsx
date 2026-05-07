import { useState, useEffect, useCallback } from 'react';
import { noteService } from '../services/note.service';
import type { NoteResponse, CreateNoteDTO, UpdateNoteDTO } from '../types/note.types';
import { useAuthStore } from '../store/auth.store';
import { useNotificationStore } from '../store/notification.store';
import { quoteService } from '../services/quote.service';
import { NoteCard } from '../components/notes/NoteCard';
import { NoteModal } from '../components/notes/NoteModal';
import { ShareModal } from '../components/notes/ShareModal';
import { LoadingScreen } from '../components/ui/Spinner';
import { EmptyState, ErrorState } from '../components/ui/EmptyState';
import type { ApiError } from '../types/api.types';
import '../styles/components/note-card.css';

type Filter = 'all' | 'mine' | 'shared' | 'important';

export function DashboardPage() {
  const [notes, setNotes] = useState<NoteResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [editNote, setEditNote] = useState<NoteResponse | null>(null);
  const [saving, setSaving] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareNote, setShareNote] = useState<NoteResponse | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<NoteResponse | null>(null);
  const name = useAuthStore((s) => s.name);
  const addToast = useNotificationStore((s) => s.addToast);
  const [quote, setQuote] = useState('');

  const fetchQuote = async () => {
    try {
      const res = await quoteService.getRandomQuote();
      setQuote(res.data.phrase);
    } catch (err) {
      addToast('error', 'Error al obtener la frase');
    }
  };

  const fetchNotes = useCallback(async () => {
    setLoading(true); setError('');
    try { const res = await noteService.getMyNotes(); setNotes(res.data); }
    catch (err) { setError((err as ApiError).message || 'Error al cargar notas'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const filteredNotes = notes.filter((n) => {
    if (filter === 'mine') return n.isOwner;
    if (filter === 'shared') return !n.isOwner;
    if (filter === 'important') return n.important;
    return true;
  });

  const handleSave = async (data: CreateNoteDTO | UpdateNoteDTO) => {
    setSaving(true);
    try {
      if (editNote) { await noteService.updateNote(editNote.id, data as UpdateNoteDTO); addToast('success', 'Nota actualizada'); }
      else { await noteService.createNote(data as CreateNoteDTO); addToast('success', 'Nota creada'); }
      setNoteModalOpen(false); fetchNotes();
    } catch (err) { addToast('error', (err as ApiError).message || 'Error agregaal guardar'); }
    finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try { await noteService.deleteNote(deleteConfirm.id); addToast('success', 'Nota eliminada'); setDeleteConfirm(null); fetchNotes(); }
    catch (err) { addToast('error', (err as ApiError).message || 'Error al eliminar'); }
  };

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorState message={error} onRetry={fetchNotes} />;

  const counts = { total: notes.length, own: notes.filter(n=>n.isOwner).length, shared: notes.filter(n=>!n.isOwner).length, important: notes.filter(n=>n.important).length };

  return (
    <div style={{ animation: 'fadeIn var(--transition-base) forwards' }}>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-value">{counts.total}</div><div className="stat-label">Total</div></div>
        <div className="stat-card"><div className="stat-value">{counts.own}</div><div className="stat-label">Mías</div></div>
        <div className="stat-card"><div className="stat-value">{counts.shared}</div><div className="stat-label">Compartidas</div></div>
        <div className="stat-card"><div className="stat-value">{counts.important}</div><div className="stat-label">Importantes</div></div>
      </div>
      <div className="dashboard-header">
        <div>
          <h2 className="dashboard-title">
            Hola, {name} 👋 <span style={{cursor:'pointer'}} onClick={fetchQuote} title="Obtener frase aleatoria" role="button">🎲</span>
          </h2>
          {quote ? (
            <p className="dashboard-subtitle" style={{ fontStyle: 'italic', maxWidth: '600px', lineHeight: '1.4' }}>"{quote}"</p>
          ) : (
            <p className="dashboard-subtitle">Gestiona tus notas</p>
          )}
        </div>
        <div className="flex gap-sm items-center">
          <div className="dashboard-filters">
            {(['all','mine','shared','important'] as Filter[]).map(f=>(
              <button key={f} className={`filter-btn ${filter===f?'active':''}`} onClick={()=>setFilter(f)}>
                {f==='all'?'Todas':f==='mine'?'Mías':f==='shared'?'Compartidas':'★ Importantes'}
              </button>
            ))}
          </div>
          <button className="btn btn-primary" onClick={()=>{setEditNote(null);setNoteModalOpen(true);}} id="btn-create-note">+ Nueva Nota</button>
        </div>
      </div>
      {filteredNotes.length===0 ? (
        <EmptyState icon="📝" title="Sin notas" text="Crea tu primera nota" action={<button className="btn btn-primary" onClick={()=>{setEditNote(null);setNoteModalOpen(true);}}>+ Crear nota</button>}/>
      ) : (
        <div className="note-grid">
          {filteredNotes.map((note,i)=>(
            <NoteCard key={note.id} note={note} index={i}
              onEdit={(n)=>{if(n.isOwner){setEditNote(n);setNoteModalOpen(true);}}}
              onDelete={setDeleteConfirm}
              onShare={(n)=>{setShareNote(n);setShareModalOpen(true);}}
            />
          ))}
        </div>
      )}
      <NoteModal isOpen={noteModalOpen} onClose={()=>setNoteModalOpen(false)} onSubmit={handleSave} note={editNote} loading={saving}/>
      <ShareModal isOpen={shareModalOpen} onClose={()=>setShareModalOpen(false)} note={shareNote}/>
      {deleteConfirm && (
        <div className="modal-backdrop" onClick={()=>setDeleteConfirm(null)}>
          <div className="modal" style={{maxWidth:'400px'}} onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><h3 className="modal-title">Eliminar Nota</h3><button className="modal-close" onClick={()=>setDeleteConfirm(null)}>✕</button></div>
            <div className="modal-body"><p style={{color:'var(--text-secondary)',fontSize:'var(--font-size-sm)'}}>¿Eliminar <strong>"{deleteConfirm.title}"</strong>? No se puede deshacer.</p></div>
            <div className="modal-footer"><button className="btn btn-ghost" onClick={()=>setDeleteConfirm(null)}>Cancelar</button><button className="btn btn-danger" onClick={confirmDelete}>Eliminar</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
