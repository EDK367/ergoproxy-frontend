import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Spinner } from '../ui/Spinner';
import type { NoteResponse, SharedNoteResponse } from '../../types/note.types';
import { noteService } from '../../services/note.service';
import { useNotificationStore } from '../../store/notification.store';
import { validateUUID } from '../../utils/validators';
import { formatDate } from '../../utils/format';
import type { ApiError } from '../../types/api.types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: NoteResponse | null;
}

export function ShareModal({ isOpen, onClose, note }: ShareModalProps) {
  const [friendCode, setFriendCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shares, setShares] = useState<SharedNoteResponse[]>([]);
  const [loadingShares, setLoadingShares] = useState(false);
  const addToast = useNotificationStore((s) => s.addToast);

  useEffect(() => {
    if (isOpen && note) {
      setFriendCode('');
      setError('');
      loadShares();
    }
  }, [isOpen, note]);

  const loadShares = async () => {
    if (!note) return;
    setLoadingShares(true);
    try {
      const res = await noteService.getNoteShares(note.id);
      setShares(res.data.filter((s) => s.enabled));
    } catch {
      // silently fail - shares are supplementary info
    } finally {
      setLoadingShares(false);
    }
  };

  const handleShare = async () => {
    const validation = validateUUID(friendCode);
    if (!validation.valid) {
      setError(validation.error || 'Código inválido');
      return;
    }
    if (!note) return;

    setLoading(true);
    setError('');
    try {
      await noteService.shareNote(note.id, { idFriend: friendCode.trim() });
      addToast('success', 'Nota compartida exitosamente');
      setFriendCode('');
      loadShares();
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.message || 'Error al compartir');
    } finally {
      setLoading(false);
    }
  };

  const handleUnshare = async (idFriend: string) => {
    if (!note) return;
    try {
      await noteService.unshareNote(note.id, idFriend);
      addToast('success', 'Se dejó de compartir la nota');
      loadShares();
    } catch (err) {
      const apiErr = err as ApiError;
      addToast('error', apiErr.message || 'Error al dejar de compartir');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Compartir: ${note?.title || ''}`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <div className="input-group">
          <label className="input-label">Código de Amigo</label>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <input
              className={`input ${error ? 'input-error' : ''}`}
              type="text"
              placeholder="Pega el código de amigo aquí..."
              value={friendCode}
              onChange={(e) => {
                setFriendCode(e.target.value);
                setError('');
              }}
              id="input-friend-code"
            />
            <button
              className="btn btn-accent"
              onClick={handleShare}
              disabled={loading || !friendCode.trim()}
              id="btn-share-note"
            >
              {loading ? '...' : 'Compartir'}
            </button>
          </div>
          {error && <span className="input-error-text">{error}</span>}
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: '4px' }}>
            Pide a tu amigo su "Código de Amigo" desde su perfil
          </p>
        </div>

        {loadingShares ? (
          <div className="flex justify-center" style={{ padding: 'var(--space-md)' }}>
            <Spinner size="sm" />
          </div>
        ) : shares.length > 0 ? (
          <div>
            <h4 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-sm)', fontWeight: 600 }}>
              Compartido con:
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {shares.map((share) => (
                <div
                  key={share.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    background: 'var(--bg-primary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div>
                    <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
                      {share.userSharedUsername}
                    </span>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginLeft: '8px' }}>
                      {formatDate(share.createdAt)}
                    </span>
                  </div>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleUnshare(share.userSharedIdFriend)}
                    style={{ color: 'var(--color-danger)', fontSize: 'var(--font-size-xs)' }}
                  >
                    Quitar
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
