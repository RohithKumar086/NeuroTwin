'use client';

import { useSystemState } from '@/hooks/useSystemState';
import KPICard from '@/components/dashboard/KPICard';
import Badge from '@/components/ui/Badge';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import {
  Heart, Cpu, Radio, AlertTriangle, ShieldAlert, Zap, Brain, Clock,
  Activity, ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export default function OverviewPage() {
  const { state } = useSystemState();
  const { twinState, alerts, isLoading, nodes } = state;

  if (isLoading || !twinState) {
    return (
      <div>
        <div className="mb-8">
          <div className="skeleton h-8 w-64 mb-2" />
          <div className="skeleton h-4 w-96" />
        </div>
        <div className="grid grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonLoader key={i} type="card" />
          ))}
        </div>
      </div>
    );
  }

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const warningNodes = nodes.filter(n => n.status === 'warning');
  const criticalNodes = nodes.filter(n => n.status === 'critical');

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
          Neural Digital Twin
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Real-time neural representation of the physical system
        </p>
      </div>

      {/* System Status Banner */}
      <div
        className="rounded-xl p-4 mb-6 flex items-center justify-between"
        style={{
          backgroundColor: twinState.systemStatus === 'operational' ? 'var(--color-healthy-dim)' : 'var(--color-warning-dim)',
          border: `1px solid ${twinState.systemStatus === 'operational' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
        }}
      >
        <div className="flex items-center gap-3">
          <div className={`status-dot status-dot-${twinState.systemStatus === 'operational' ? 'healthy' : twinState.systemStatus}`}
            style={{ width: 12, height: 12 }} />
          <div>
            <span className="text-sm font-semibold" style={{
              color: twinState.systemStatus === 'operational' ? 'var(--color-healthy)' : 'var(--color-warning)'
            }}>
              SYSTEM STATUS
            </span>
            <span className="text-sm font-medium ml-2 capitalize" style={{ color: 'var(--color-text-primary)' }}>
              {twinState.systemStatus}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          <span>Model: v0.4.2</span>
          <span>•</span>
          <span className="font-mono">{twinState.dataFreshness}s latency</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <KPICard
          label="Overall Health"
          value={twinState.overallHealth}
          unit="%"
          status={twinState.overallHealth > 90 ? 'healthy' : twinState.overallHealth > 75 ? 'warning' : 'critical'}
          trend="down"
          trendValue="-0.8% from 1h ago"
          icon={<Heart size={16} />}
        />
        <KPICard
          label="Active Machines"
          value={`${twinState.activeMachines}/14`}
          status="healthy"
          trend="stable"
          trendValue="No change"
          icon={<Cpu size={16} />}
        />
        <KPICard
          label="Active Sensors"
          value={`${twinState.activeSensors}/8`}
          status="healthy"
          trend="stable"
          trendValue="All reporting"
          icon={<Radio size={16} />}
        />
        <KPICard
          label="Anomalies Detected"
          value={twinState.anomaliesDetected}
          status={twinState.anomaliesDetected > 0 ? 'warning' : 'healthy'}
          trend="up"
          trendValue="+1 in last 2h"
          icon={<AlertTriangle size={16} />}
        />
        <KPICard
          label="Failure Risk"
          value={twinState.failureRisk}
          unit="%"
          status={twinState.failureRisk > 15 ? 'critical' : twinState.failureRisk > 8 ? 'warning' : 'healthy'}
          trend="up"
          trendValue="+2.4% trending"
          icon={<ShieldAlert size={16} />}
        />
        <KPICard
          label="Energy Consumption"
          value={twinState.energyConsumption}
          unit="kW"
          status="info"
          trend="stable"
          trendValue="Within normal"
          icon={<Zap size={16} />}
        />
        <KPICard
          label="Model Confidence"
          value={twinState.modelConfidence}
          unit="%"
          status="info"
          trend="stable"
          trendValue="Stable"
          icon={<Brain size={16} />}
        />
        <KPICard
          label="Data Freshness"
          value={twinState.dataFreshness}
          unit="sec ago"
          status={twinState.dataFreshness < 5 ? 'healthy' : 'warning'}
          trend="stable"
          trendValue="Real-time"
          icon={<Clock size={16} />}
        />
      </div>

      {/* Bottom Section: Alerts + Quick Links */}
      <div className="grid grid-cols-3 gap-6">
        {/* Recent Alerts */}
        <div className="col-span-2 rounded-xl p-5" style={{
          backgroundColor: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
        }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Recent Alerts</h3>
            <Link href="/events" className="text-[11px] font-medium flex items-center gap-1" style={{ color: 'var(--color-accent)' }}>
              View All <ArrowRight size={10} />
            </Link>
          </div>
          <div className="space-y-3">
            {activeAlerts.length === 0 ? (
              <p className="text-xs py-6 text-center" style={{ color: 'var(--color-text-muted)' }}>No active alerts</p>
            ) : (
              activeAlerts.slice(0, 4).map(alert => (
                <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg" style={{
                  backgroundColor: 'var(--color-bg-tertiary)',
                  border: '1px solid var(--color-border)',
                }}>
                  <div className="mt-0.5">
                    <Badge status={alert.severity} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
                      {alert.event}
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                      {alert.componentName} · {new Date(alert.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
                    {alert.confidence}%
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* System Summary */}
        <div className="rounded-xl p-5" style={{
          backgroundColor: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
        }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>System Summary</h3>
          
          <div className="space-y-4">
            {/* Warning components */}
            {warningNodes.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Activity size={12} style={{ color: 'var(--color-warning)' }} />
                  <span className="text-[11px] font-semibold uppercase" style={{ color: 'var(--color-warning)' }}>Warning</span>
                </div>
                {warningNodes.map(n => (
                  <div key={n.id} className="text-xs py-1.5 flex items-center justify-between" style={{ color: 'var(--color-text-secondary)' }}>
                    <span>{n.name}</span>
                    <span className="font-mono text-[11px]">{n.healthScore}%</span>
                  </div>
                ))}
              </div>
            )}

            {/* Critical components */}
            {criticalNodes.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={12} style={{ color: 'var(--color-critical)' }} />
                  <span className="text-[11px] font-semibold uppercase" style={{ color: 'var(--color-critical)' }}>Critical</span>
                </div>
                {criticalNodes.map(n => (
                  <div key={n.id} className="text-xs py-1.5 flex items-center justify-between" style={{ color: 'var(--color-text-secondary)' }}>
                    <span>{n.name}</span>
                    <span className="font-mono text-[11px]">{n.healthScore}%</span>
                  </div>
                ))}
              </div>
            )}

            {/* Quick actions */}
            <div className="pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
              <span className="text-[11px] font-semibold uppercase mb-2 block" style={{ color: 'var(--color-text-muted)' }}>
                Quick Actions
              </span>
              <div className="space-y-2">
                <Link href="/digital-twin" className="flex items-center gap-2 text-xs font-medium p-2 rounded-lg transition-colors"
                  style={{ color: 'var(--color-accent)', backgroundColor: 'var(--color-bg-tertiary)' }}>
                  <ArrowRight size={12} /> Open Digital Twin
                </Link>
                <Link href="/predictions" className="flex items-center gap-2 text-xs font-medium p-2 rounded-lg transition-colors"
                  style={{ color: 'var(--color-prediction)', backgroundColor: 'var(--color-bg-tertiary)' }}>
                  <ArrowRight size={12} /> View Predictions
                </Link>
                <Link href="/simulation" className="flex items-center gap-2 text-xs font-medium p-2 rounded-lg transition-colors"
                  style={{ color: 'var(--color-info)', backgroundColor: 'var(--color-bg-tertiary)' }}>
                  <ArrowRight size={12} /> Run Simulation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
