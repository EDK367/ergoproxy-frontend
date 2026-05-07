interface EmptyStateProps {
  icon?: string;
  title: string;
  text?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon = '📝', title, text, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      {text && <p className="empty-state-text">{text}</p>}
      {action}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ title = 'Algo salió mal', message, onRetry }: ErrorStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">⚠️</div>
      <h3 className="empty-state-title">{title}</h3>
      {message && <p className="empty-state-text">{message}</p>}
      {onRetry && (
        <button className="btn btn-primary" onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  );
}
