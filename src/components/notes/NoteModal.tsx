import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import type { NoteResponse, CreateNoteDTO, UpdateNoteDTO } from '../../types/note.types';
import { validateNoteTitle, validateNoteContent } from '../../utils/validators';
import { APP_CONFIG } from '../../config/api.config';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateNoteDTO | UpdateNoteDTO) => Promise<void>;
  note?: NoteResponse | null;
  loading?: boolean;
}

export function NoteModal({ isOpen, onClose, onSubmit, note, loading }: NoteModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [important, setImportant] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content || '');
      setImportant(note.important);
    } else {
      setTitle('');
      setContent('');
      setImportant(false);
    }
    setErrors({});
  }, [note, isOpen]);

  const validate = (): boolean => {
    const newErrors: { title?: string; content?: string } = {};
    const titleResult = validateNoteTitle(title);
    if (!titleResult.valid) newErrors.title = titleResult.error;
    const contentResult = validateNoteContent(content);
    if (!contentResult.valid) newErrors.content = contentResult.error;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({ title, content, important });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={note ? 'Editar Nota' : 'Nueva Nota'}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading}
            id="btn-save-note"
          >
            {loading ? 'Guardando...' : note ? 'Actualizar' : 'Crear'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="input-group">
          <label className="input-label" htmlFor="note-title">Título *</label>
          <input
            id="note-title"
            className={`input ${errors.title ? 'input-error' : ''}`}
            type="text"
            placeholder="Título de la nota..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={APP_CONFIG.MAX_TITLE_LENGTH}
            autoFocus
          />
          <span className="input-error-text">{errors.title || ''}</span>
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="note-content">
            Contenido
            <span style={{ float: 'right', color: 'var(--text-muted)' }}>
              {content.length}/{APP_CONFIG.MAX_CONTENT_LENGTH}
            </span>
          </label>
          <textarea
            id="note-content"
            className={`input ${errors.content ? 'input-error' : ''}`}
            placeholder="Escribe tu nota aquí..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={APP_CONFIG.MAX_CONTENT_LENGTH}
            rows={5}
          />
          <span className="input-error-text">{errors.content || ''}</span>
        </div>

        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
            cursor: 'pointer',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--text-secondary)',
          }}
        >
          <input
            type="checkbox"
            checked={important}
            onChange={(e) => setImportant(e.target.checked)}
            style={{ accentColor: 'var(--color-danger)' }}
          />
          <span>★ Marcar como importante</span>
        </label>
      </form>
    </Modal>
  );
}
