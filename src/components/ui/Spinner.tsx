interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  const sizeClass = size === 'sm' ? 'spinner-sm' : size === 'lg' ? 'spinner-lg' : '';
  return <div className={`spinner ${sizeClass} ${className}`} role="status" aria-label="Cargando" />;
}

export function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center" style={{ minHeight: '60vh', gap: 'var(--space-md)' }}>
      <Spinner size="lg" />
      <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>Cargando...</p>
    </div>
  );
}
