import { NodeStatus } from '@/types/node';
import { AlertSeverity } from '@/types/alert';

interface BadgeProps {
  status: NodeStatus | AlertSeverity | 'active' | 'investigating' | 'resolved' | 'dismissed' | 'info' | 'prediction' | 'offline';
  label?: string;
  size?: 'sm' | 'md';
  pulse?: boolean;
}

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  healthy: { bg: 'var(--color-healthy-dim)', text: 'var(--color-healthy)', border: 'rgba(16, 185, 129, 0.3)' },
  active: { bg: 'var(--color-healthy-dim)', text: 'var(--color-healthy)', border: 'rgba(16, 185, 129, 0.3)' },
  warning: { bg: 'var(--color-warning-dim)', text: 'var(--color-warning)', border: 'rgba(245, 158, 11, 0.3)' },
  investigating: { bg: 'var(--color-warning-dim)', text: 'var(--color-warning)', border: 'rgba(245, 158, 11, 0.3)' },
  critical: { bg: 'var(--color-critical-dim)', text: 'var(--color-critical)', border: 'rgba(239, 68, 68, 0.3)' },
  info: { bg: 'var(--color-info-dim)', text: 'var(--color-info)', border: 'rgba(59, 130, 246, 0.3)' },
  prediction: { bg: 'var(--color-prediction-dim)', text: 'var(--color-prediction)', border: 'rgba(139, 92, 246, 0.3)' },
  offline: { bg: 'rgba(107, 114, 128, 0.15)', text: 'var(--color-inactive)', border: 'rgba(107, 114, 128, 0.3)' },
  resolved: { bg: 'rgba(107, 114, 128, 0.15)', text: 'var(--color-inactive)', border: 'rgba(107, 114, 128, 0.3)' },
  dismissed: { bg: 'rgba(107, 114, 128, 0.15)', text: 'var(--color-inactive)', border: 'rgba(107, 114, 128, 0.3)' },
};

export default function Badge({ status, label, size = 'sm', pulse }: BadgeProps) {
  const colors = colorMap[status] || colorMap.offline;
  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold uppercase tracking-wider ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-[11px]'
      } ${pulse ? 'animate-pulse-subtle' : ''}`}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: colors.text }}
      />
      {displayLabel}
    </span>
  );
}
