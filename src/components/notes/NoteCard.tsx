import type { NoteResponse } from '../../types/note.types';
import { formatRelativeDate, truncateText } from '../../utils/format';
import '../../styles/components/note-card.css';

interface NoteCardProps {
  note: NoteResponse;
  index: number;
  onEdit: (note: NoteResponse) => void;
  onDelete: (note: NoteResponse) => void;
  onShare: (note: NoteResponse) => void;
}

const ROTATIONS = [-2, 1, -1, 2, 0, -1.5, 1.5, -0.5, 0.5, -2.5];

export function NoteCard({ note, index, onEdit, onDelete, onShare }: NoteCardProps) {
  const rotation = ROTATIONS[index % ROTATIONS.length];
  const cardClass = note.isShared && !note.isOwner
    ? 'note-card-shared'
    : note.important
      ? 'note-card-important'
      : 'note-card-normal';

  return (
    <div
      className={`note-card ${cardClass}`}
      style={{
        '--note-rotate': `${rotation}deg`,
        '--stagger-delay': `${index * 60}ms`,
      } as React.CSSProperties}
      onClick={() => onEdit(note)}
      id={`note-${note.id}`}
    >
      <div className="note-card-header">
        <h4 className="note-card-title">{truncateText(note.title, 60)}</h4>
        <div className="note-card-badges">
          {note.important && <span className="badge badge-danger">★</span>}
          {note.isShared && !note.isOwner && <span className="badge badge-primary">Compartida</span>}
          {note.isOwner && note.isShared && <span className="badge badge-accent">Compartida</span>}
        </div>
      </div>

      <div className="note-card-content">
        {note.content || 'Sin contenido'}
      </div>

      <div className="note-card-footer">
        <div className="note-card-meta">
          {!note.isOwner && <span>De: {note.username} · </span>}
          {formatRelativeDate(note.createdAt)}
        </div>

        {note.isOwner && (
          <div className="note-card-actions">
            <button
              className="note-card-action action-share"
              onClick={(e) => { e.stopPropagation(); onShare(note); }}
              title="Compartir"
              aria-label="Compartir nota"
            >
              🔗
            </button>
            <button
              className="note-card-action action-delete"
              onClick={(e) => { e.stopPropagation(); onDelete(note); }}
              title="Eliminar"
              aria-label="Eliminar nota"
            >
              🗑
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
