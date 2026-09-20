'use client';

import { SystemNode, NODE_TYPE_LABELS } from '@/types/node';
import Badge from '@/components/ui/Badge';
import { X, ArrowUpRight, ArrowDownRight, Activity, Thermometer, Gauge, Zap, Settings, FlaskConical } from 'lucide-react';
import Link from 'next/link';

interface NodeDetailPanelProps {
  node: SystemNode;
  allNodes: SystemNode[];
  onClose: () => void;
}

export default function NodeDetailPanel({ node, allNodes, onClose }: NodeDetailPanelProps) {
  const upstream = allNodes.filter(n => node.upstreamIds.includes(n.id));
  const downstream = allNodes.filter(n => node.downstreamIds.includes(n.id));

  const metrics = [
    { label: 'Temperature', value: `${node.temperature}°C`, icon: <Thermometer size={12} />, warn: node.temperature > node.thresholds.temperature.warning },
    { label: 'Pressure', value: `${node.pressure} bar`, icon: <Gauge size={12} />, warn: node.pressure > node.thresholds.pressure.warning },
    { label: 'Vibration', value: `${node.vibration} mm/s`, icon: <Activity size={12} />, warn: node.vibration > node.thresholds.vibration.warning },
    { label: 'Energy', value: `${node.energyConsumption} kW`, icon: <Zap size={12} />, warn: false },
    { label: 'Load', value: `${node.load}%`, icon: <Settings size={12} />, warn: node.load > node.thresholds.load.warning },
    { label: 'RPM', value: `${node.rpm}`, icon: <Activity size={12} />, warn: false },
  ];

  return (
    <div
      className="w-[360px] shrink-0 overflow-y-auto animate-slide-in-right ml-4 rounded-xl"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        maxHeight: 'calc(100vh - 180px)',
      }}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 p-4 flex items-start justify-between" style={{
        backgroundColor: 'var(--color-bg-card)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div>
          <h2 className="text-base font-bold" style={{ color: 'var(--color-text-primary)' }}>{node.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge status={node.status} />
            <span className="text-[10px] font-medium" style={{ color: 'var(--color-text-muted)' }}>
              {NODE_TYPE_LABELS[node.type]}
            </span>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg transition-colors cursor-pointer"
          style={{ color: 'var(--color-text-muted)', backgroundColor: 'var(--color-bg-tertiary)' }}>
          <X size={14} />
        </button>
      </div>

      <div className="p-4 space-y-5">
        {/* Health & Failure */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)' }}>
            <span className="text-[10px] font-semibold uppercase" style={{ color: 'var(--color-text-muted)' }}>Health Score</span>
            <div className="text-xl font-bold mt-1" style={{
              color: node.healthScore > 85 ? 'var(--color-healthy)' : node.healthScore > 65 ? 'var(--color-warning)' : 'var(--color-critical)'
            }}>
              {node.healthScore}%
            </div>
          </div>
          <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)' }}>
            <span className="text-[10px] font-semibold uppercase" style={{ color: 'var(--color-text-muted)' }}>Failure Prob.</span>
            <div className="text-xl font-bold mt-1" style={{
              color: node.failureProbability > 15 ? 'var(--color-critical)' : node.failureProbability > 5 ? 'var(--color-warning)' : 'var(--color-healthy)'
            }}>
              {node.failureProbability}%
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div>
          <h3 className="text-[11px] font-semibold uppercase mb-2" style={{ color: 'var(--color-text-muted)' }}>Current Metrics</h3>
          <div className="space-y-2">
            {metrics.map(m => (
              <div key={m.label} className="flex items-center justify-between py-1.5 px-3 rounded-lg" style={{
                backgroundColor: 'var(--color-bg-tertiary)',
              }}>
                <div className="flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                  {m.icon}
                  <span className="text-xs">{m.label}</span>
                </div>
                <span className="text-xs font-mono font-semibold" style={{
                  color: m.warn ? 'var(--color-warning)' : 'var(--color-text-primary)',
                }}>
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Operating Info */}
        <div>
          <h3 className="text-[11px] font-semibold uppercase mb-2" style={{ color: 'var(--color-text-muted)' }}>Operating Info</h3>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between" style={{ color: 'var(--color-text-secondary)' }}>
              <span>Operating State</span>
              <span className="capitalize font-medium" style={{ color: 'var(--color-text-primary)' }}>{node.operatingState.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between" style={{ color: 'var(--color-text-secondary)' }}>
              <span>Operating Hours</span>
              <span className="font-mono" style={{ color: 'var(--color-text-primary)' }}>{node.operatingHours.toLocaleString()}h</span>
            </div>
            <div className="flex justify-between" style={{ color: 'var(--color-text-secondary)' }}>
              <span>Last Maintenance</span>
              <span style={{ color: 'var(--color-text-primary)' }}>{new Date(node.lastMaintenance).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between" style={{ color: 'var(--color-text-secondary)' }}>
              <span>Next Maintenance</span>
              <span style={{ color: 'var(--color-text-primary)' }}>{new Date(node.nextMaintenance).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between" style={{ color: 'var(--color-text-secondary)' }}>
              <span>Manufacturer</span>
              <span style={{ color: 'var(--color-text-primary)' }}>{node.manufacturer}</span>
            </div>
            <div className="flex justify-between" style={{ color: 'var(--color-text-secondary)' }}>
              <span>Model</span>
              <span className="font-mono text-[11px]" style={{ color: 'var(--color-text-primary)' }}>{node.model}</span>
            </div>
          </div>
        </div>

        {/* Dependencies */}
        <div>
          <h3 className="text-[11px] font-semibold uppercase mb-2" style={{ color: 'var(--color-text-muted)' }}>Dependencies</h3>
          {upstream.length > 0 && (
            <div className="mb-3">
              <span className="text-[10px] font-medium flex items-center gap-1 mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                <ArrowDownRight size={10} /> Upstream
              </span>
              <div className="flex flex-wrap gap-1.5">
                {upstream.map(n => (
                  <span key={n.id} className="text-[10px] px-2 py-1 rounded-md font-medium" style={{
                    backgroundColor: 'var(--color-bg-hover)',
                    color: 'var(--color-text-primary)',
                    border: '1px solid var(--color-border)',
                  }}>
                    {n.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          {downstream.length > 0 && (
            <div>
              <span className="text-[10px] font-medium flex items-center gap-1 mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                <ArrowUpRight size={10} /> Downstream
              </span>
              <div className="flex flex-wrap gap-1.5">
                {downstream.map(n => (
                  <span key={n.id} className="text-[10px] px-2 py-1 rounded-md font-medium" style={{
                    backgroundColor: 'var(--color-bg-hover)',
                    color: 'var(--color-text-primary)',
                    border: '1px solid var(--color-border)',
                  }}>
                    {n.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Model Explanation */}
        {node.failureProbability > 5 && (
          <div className="rounded-lg p-3" style={{
            backgroundColor: 'var(--color-prediction-dim)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
          }}>
            <div className="flex items-center gap-1.5 mb-2">
              <Activity size={12} style={{ color: 'var(--color-prediction)' }} />
              <span className="text-[10px] font-semibold uppercase" style={{ color: 'var(--color-prediction)' }}>Model Explanation</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              Failure probability increased by {(node.failureProbability * 0.45).toFixed(1)}% because of
              {node.vibration > node.thresholds.vibration.warning ? ' rising vibration' : ''}
              {node.temperature > node.thresholds.temperature.warning ? ' and elevated temperature' : ''}.
              GNN model identifies correlation with historical degradation patterns.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link href={`/predictions`} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            style={{
              backgroundColor: 'var(--color-bg-tertiary)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-accent)',
            }}>
            <Activity size={12} /> View Predictions
          </Link>
          <Link href={`/simulation`} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            style={{
              backgroundColor: 'var(--color-prediction-dim)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              color: 'var(--color-prediction)',
            }}>
            <FlaskConical size={12} /> Run What-if
          </Link>
        </div>
      </div>
    </div>
  );
}
