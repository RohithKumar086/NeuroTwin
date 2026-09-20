import { AlertTriangle, RefreshCw, WifiOff, Clock, Cpu } from 'lucide-react';

interface EmptyStateProps {
  icon?: 'alert' | 'wifi' | 'clock' | 'cpu' | 'none';
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const icons = {
  alert: AlertTriangle,
  wifi: WifiOff,
  clock: Clock,
  cpu: Cpu,
  none: null,
};

export default function EmptyState({ icon = 'none', title, description, action }: EmptyStateProps) {
  const Icon = icons[icon];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {Icon && (
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
          style={{
            backgroundColor: 'var(--color-bg-tertiary)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-muted)',
          }}
        >
          <Icon size={24} />
        </div>
      )}
      <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
        {title}
      </h3>
      {description && (
        <p className="text-xs max-w-xs" style={{ color: 'var(--color-text-muted)' }}>
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          style={{
            backgroundColor: 'var(--color-bg-tertiary)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-accent)',
          }}
        >
          <RefreshCw size={12} />
          {action.label}
        </button>
      )}
    </div>
  );
}
