'use client';

import { useState, useEffect } from 'react';
import { getAnomalies, getAlertSummary } from '@/services/api';
import { Anomaly, AlertSummary } from '@/types/alert';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { AlertTriangle, Search, Activity, ShieldCheck, Eye, FlaskConical, CheckCircle } from 'lucide-react';

export default function AnomaliesPage() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [summary, setSummary] = useState<AlertSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAnomalies(), getAlertSummary()]).then(([a, s]) => {
      setAnomalies(a);
      setSummary(s);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div>
        <div className="skeleton h-8 w-48 mb-2" />
        <div className="skeleton h-4 w-80 mb-6" />
        <div className="grid grid-cols-5 gap-4 mb-6">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Anomaly Detection</h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
          Neural model anomaly monitoring — deviations from learned baseline
        </p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-5 gap-4 mb-6">
          {[
            { label: 'Total Anomalies', value: summary.total, color: 'var(--color-text-primary)' },
            { label: 'Critical', value: summary.critical, color: 'var(--color-critical)' },
            { label: 'Warning', value: summary.warning, color: 'var(--color-warning)' },
            { label: 'Resolved', value: summary.resolved, color: 'var(--color-healthy)' },
            { label: 'False Positive Rate', value: `${summary.falsePositiveRate}%`, color: 'var(--color-text-secondary)' },
          ].map(c => (
            <div key={c.label} className="rounded-xl p-4" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
              <span className="text-[10px] font-semibold uppercase" style={{ color: 'var(--color-text-muted)' }}>{c.label}</span>
              <div className="text-xl font-bold mt-1 font-mono" style={{ color: c.color }}>{c.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Anomaly List */}
      {anomalies.length === 0 ? (
        <EmptyState icon="alert" title="No anomalies detected" description="The system is operating within normal parameters." />
      ) : (
        <div className="space-y-4">
          {anomalies.map(anomaly => (
            <div key={anomaly.id} className="rounded-xl p-5" style={{
              backgroundColor: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
            }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Badge status={anomaly.severity} size="md" pulse={anomaly.status === 'active'} />
                  <div>
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{anomaly.event}</h3>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                      <span>{anomaly.componentName}</span>
                      <span>·</span>
                      <span>Detected {new Date(anomaly.timestamp).toLocaleTimeString()}</span>
                      <span>·</span>
                      <span>Confidence: <span className="font-mono font-semibold" style={{ color: 'var(--color-text-secondary)' }}>{anomaly.confidence}%</span></span>
                    </div>
                  </div>
                </div>
                <Badge status={anomaly.status as 'active' | 'investigating' | 'resolved'} />
              </div>

              <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                {anomaly.description}
              </p>

              {/* Metric comparison */}
              <div className="flex items-center gap-4 mb-3 py-2.5 px-3 rounded-lg" style={{
                backgroundColor: 'var(--color-bg-tertiary)',
              }}>
                <div className="text-xs">
                  <span style={{ color: 'var(--color-text-muted)' }}>Expected: </span>
                  <span className="font-mono font-semibold" style={{ color: 'var(--color-text-primary)' }}>{anomaly.expectedValue} {anomaly.unit}</span>
                </div>
                <span style={{ color: 'var(--color-text-muted)' }}>→</span>
                <div className="text-xs">
                  <span style={{ color: 'var(--color-text-muted)' }}>Actual: </span>
                  <span className="font-mono font-semibold" style={{ color: 'var(--color-critical)' }}>{anomaly.actualValue} {anomaly.unit}</span>
                </div>
                <div className="text-xs">
                  <span style={{ color: 'var(--color-text-muted)' }}>Deviation: </span>
                  <span className="font-mono font-semibold" style={{ color: 'var(--color-warning)' }}>{anomaly.deviation}σ</span>
                </div>
              </div>

              {/* Possible Cause */}
              <div className="mb-3">
                <span className="text-[10px] font-semibold uppercase" style={{ color: 'var(--color-text-muted)' }}>Possible Cause</span>
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>{anomaly.possibleCause}</p>
              </div>

              {/* Affected Dependencies */}
              {anomaly.affectedDependencies.length > 0 && (
                <div className="mb-4">
                  <span className="text-[10px] font-semibold uppercase" style={{ color: 'var(--color-text-muted)' }}>Affected Dependencies</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {anomaly.affectedDependencies.map(id => (
                      <span key={id} className="text-[10px] px-2 py-1 rounded-md" style={{
                        backgroundColor: 'var(--color-bg-hover)',
                        color: 'var(--color-text-primary)',
                        border: '1px solid var(--color-border)',
                      }}>{id}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer" style={{
                  backgroundColor: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', color: 'var(--color-accent)',
                }}>
                  <Eye size={12} /> Investigate
                </button>
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer" style={{
                  backgroundColor: 'var(--color-prediction-dim)', border: '1px solid rgba(139,92,246,0.3)', color: 'var(--color-prediction)',
                }}>
                  <FlaskConical size={12} /> Simulate Impact
                </button>
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer" style={{
                  backgroundColor: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', color: 'var(--color-healthy)',
                }}>
                  <CheckCircle size={12} /> Mark Resolved
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
