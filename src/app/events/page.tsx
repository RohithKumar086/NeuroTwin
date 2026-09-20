'use client';

import { useState, useEffect } from 'react';
import { getAlerts } from '@/services/api';
import { Alert, AlertSeverity } from '@/types/alert';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { Bell, AlertTriangle, Info, CheckCircle, Eye } from 'lucide-react';

type TabFilter = 'all' | AlertSeverity | 'resolved';

export default function EventsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabFilter>('all');

  useEffect(() => {
    getAlerts().then(a => { setAlerts(a); setLoading(false); });
  }, []);

  const filtered = tab === 'all'
    ? alerts
    : tab === 'resolved'
    ? alerts.filter(a => a.status === 'resolved')
    : alerts.filter(a => a.severity === tab && a.status !== 'resolved');

  const tabs: { value: TabFilter; label: string; count: number; color: string }[] = [
    { value: 'all', label: 'All', count: alerts.length, color: 'var(--color-text-primary)' },
    { value: 'critical', label: 'Critical', count: alerts.filter(a => a.severity === 'critical').length, color: 'var(--color-critical)' },
    { value: 'warning', label: 'Warning', count: alerts.filter(a => a.severity === 'warning').length, color: 'var(--color-warning)' },
    { value: 'info', label: 'Info', count: alerts.filter(a => a.severity === 'info').length, color: 'var(--color-info)' },
    { value: 'resolved', label: 'Resolved', count: alerts.filter(a => a.status === 'resolved').length, color: 'var(--color-healthy)' },
  ];

  if (loading) {
    return (
      <div>
        <div className="skeleton h-8 w-48 mb-6" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Events & Alerts</h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
          System event log with neural model detections
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-lg w-fit" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
        {tabs.map(t => (
          <button key={t.value}
            onClick={() => setTab(t.value)}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer"
            style={{
              backgroundColor: tab === t.value ? 'var(--color-bg-hover)' : 'transparent',
              color: tab === t.value ? t.color : 'var(--color-text-muted)',
              border: tab === t.value ? '1px solid var(--color-border)' : '1px solid transparent',
            }}>
            {t.label}
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{
              backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-muted)',
            }}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* Alert List */}
      {filtered.length === 0 ? (
        <EmptyState icon="alert" title="No events in this category" description="Check back later or switch to a different filter." />
      ) : (
        <div className="space-y-3">
          {filtered.map(alert => (
            <div key={alert.id} className="rounded-xl p-4 flex items-start gap-4 transition-colors"
              style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
              <div className="mt-1">
                {alert.severity === 'critical' ? <AlertTriangle size={16} style={{ color: 'var(--color-critical)' }} /> :
                 alert.severity === 'warning' ? <Bell size={16} style={{ color: 'var(--color-warning)' }} /> :
                 <Info size={16} style={{ color: 'var(--color-info)' }} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge status={alert.severity} />
                  <Badge status={alert.status as 'active' | 'resolved'} />
                </div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>{alert.event}</h3>
                <p className="text-xs mb-2 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{alert.description}</p>
                <div className="flex items-center gap-4 text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                  <span>{alert.componentName}</span>
                  <span>·</span>
                  <span>{new Date(alert.timestamp).toLocaleString()}</span>
                  <span>·</span>
                  <span>Confidence: <span className="font-mono">{alert.confidence}%</span></span>
                </div>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium shrink-0 cursor-pointer" style={{
                backgroundColor: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', color: 'var(--color-accent)',
              }}>
                <Eye size={12} /> Investigate
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
