'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  status?: 'healthy' | 'warning' | 'critical' | 'info' | 'neutral';
  icon?: React.ReactNode;
}

const statusStyles: Record<string, { accent: string; bg: string }> = {
  healthy: { accent: 'var(--color-healthy)', bg: 'var(--color-healthy-dim)' },
  warning: { accent: 'var(--color-warning)', bg: 'var(--color-warning-dim)' },
  critical: { accent: 'var(--color-critical)', bg: 'var(--color-critical-dim)' },
  info: { accent: 'var(--color-info)', bg: 'var(--color-info-dim)' },
  neutral: { accent: 'var(--color-text-secondary)', bg: 'var(--color-bg-tertiary)' },
};

export default function KPICard({ label, value, unit, trend, trendValue, status = 'neutral', icon }: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const styles = statusStyles[status];

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up'
    ? (status === 'critical' || status === 'warning' ? 'var(--color-critical)' : 'var(--color-healthy)')
    : trend === 'down'
    ? (status === 'healthy' ? 'var(--color-critical)' : 'var(--color-healthy)')
    : 'var(--color-text-muted)';

  return (
    <div
      className="rounded-xl p-5 transition-all duration-300 hover:scale-[1.02] group"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
          {label}
        </span>
        {icon && (
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: styles.bg, color: styles.accent }}
          >
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-1.5 mb-2 animate-count-up">
        <span className="text-2xl font-bold tabular-nums" style={{ color: styles.accent }}>
          {displayValue}
        </span>
        {unit && (
          <span className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
            {unit}
          </span>
        )}
      </div>
      {trend && trendValue && (
        <div className="flex items-center gap-1.5">
          <TrendIcon size={12} style={{ color: trendColor }} />
          <span className="text-[11px] font-medium" style={{ color: trendColor }}>
            {trendValue}
          </span>
        </div>
      )}
    </div>
  );
}
