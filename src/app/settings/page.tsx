'use client';

import { useSystemState } from '@/hooks/useSystemState';
import { Play, Pause, RotateCcw, Monitor, Bell, Palette, Database, Shield } from 'lucide-react';

export default function SettingsPage() {
  const { state, toggleLive, refreshData } = useSystemState();

  return (
    <div className="animate-fade-in max-w-3xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Settings</h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
          System configuration and preferences
        </p>
      </div>

      <div className="space-y-4">
        {/* Simulation Controls */}
        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-2 mb-4">
            <Monitor size={16} style={{ color: 'var(--color-accent)' }} />
            <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Simulation Controls</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium block" style={{ color: 'var(--color-text-primary)' }}>Live Simulation</span>
                <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>Enable real-time sensor data simulation</span>
              </div>
              <button onClick={toggleLive}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer"
                style={{
                  backgroundColor: state.isLive ? 'var(--color-healthy-dim)' : 'var(--color-bg-tertiary)',
                  color: state.isLive ? 'var(--color-healthy)' : 'var(--color-text-muted)',
                  border: `1px solid ${state.isLive ? 'rgba(16,185,129,0.3)' : 'var(--color-border)'}`,
                }}>
                {state.isLive ? <Pause size={12} /> : <Play size={12} />}
                {state.isLive ? 'Pause' : 'Resume'}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium block" style={{ color: 'var(--color-text-primary)' }}>Reset Simulation</span>
                <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>Reload all data to initial state</span>
              </div>
              <button onClick={refreshData}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium cursor-pointer"
                style={{ backgroundColor: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>
                <RotateCcw size={12} /> Reset
              </button>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-2 mb-4">
            <Bell size={16} style={{ color: 'var(--color-warning)' }} />
            <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Notifications</h3>
          </div>
          <div className="space-y-3">
            {['Critical Alerts', 'Warning Alerts', 'Anomaly Detections', 'Prediction Updates'].map((item, i) => (
              <div key={item} className="flex items-center justify-between py-2">
                <span className="text-xs" style={{ color: 'var(--color-text-primary)' }}>{item}</span>
                <div className="w-10 h-5 rounded-full relative cursor-pointer"
                  style={{
                    backgroundColor: i < 3 ? 'var(--color-accent)' : 'var(--color-bg-hover)',
                  }}>
                  <div className="w-4 h-4 rounded-full absolute top-0.5 transition-all" style={{
                    backgroundColor: '#fff',
                    left: i < 3 ? 22 : 2,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Info */}
        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-2 mb-4">
            <Database size={16} style={{ color: 'var(--color-info)' }} />
            <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>System Information</h3>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Application', value: 'Neural Digital Twin' },
              { label: 'Version', value: 'v0.4.2 (Prototype)' },
              { label: 'Model', value: 'GATv2 + GRU' },
              { label: 'Data Source', value: 'Mock / Simulated' },
              { label: 'Backend', value: 'Not connected (Frontend only)' },
              { label: 'Last Build', value: new Date().toLocaleDateString() },
            ].map(item => (
              <div key={item.label} className="flex justify-between text-xs py-1.5">
                <span style={{ color: 'var(--color-text-muted)' }}>{item.label}</span>
                <span className="font-mono" style={{ color: 'var(--color-text-primary)' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
