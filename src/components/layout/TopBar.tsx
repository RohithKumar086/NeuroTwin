'use client';

import { useState } from 'react';
import { Search, Bell, User, Play, Pause, ChevronDown, Wifi, WifiOff } from 'lucide-react';
import { useSystemState } from '@/hooks/useSystemState';

export default function TopBar() {
  const { state, toggleLive } = useSystemState();
  const [searchOpen, setSearchOpen] = useState(false);

  const timeSinceUpdate = Math.round((Date.now() - state.lastUpdate) / 1000);
  const statusLabel = state.twinState?.systemStatus || 'loading';
  const statusColor =
    statusLabel === 'operational' ? 'var(--color-healthy)' :
    statusLabel === 'degraded' ? 'var(--color-warning)' :
    statusLabel === 'critical' ? 'var(--color-critical)' :
    'var(--color-inactive)';

  const alertCount = state.alerts.filter(a => a.status === 'active').length;

  return (
    <header
      className="h-14 flex items-center justify-between px-6 z-30 shrink-0"
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      {/* Left: System selector + status */}
      <div className="flex items-center gap-5">
        {/* System Selector */}
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          style={{ 
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-primary)',
            backgroundColor: 'var(--color-bg-tertiary)',
          }}
        >
          <span className="text-xs font-semibold">Manufacturing Plant Alpha</span>
          <ChevronDown size={12} style={{ color: 'var(--color-text-muted)' }} />
        </button>

        {/* System Status */}
        <div className="flex items-center gap-2">
          <span className={`status-dot status-dot-${statusLabel === 'operational' ? 'healthy' : statusLabel}`} />
          <span className="text-xs font-medium capitalize" style={{ color: statusColor }}>
            {statusLabel}
          </span>
        </div>

        {/* Last Sync */}
        <div className="flex items-center gap-1.5" style={{ color: 'var(--color-text-muted)' }}>
          {state.isLive ? <Wifi size={12} /> : <WifiOff size={12} />}
          <span className="text-[11px] font-mono">
            {timeSinceUpdate < 5 ? 'Just now' : `${timeSinceUpdate}s ago`}
          </span>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-3">
        {/* Live Toggle */}
        <button
          onClick={toggleLive}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
          style={{
            backgroundColor: state.isLive ? 'var(--color-healthy-dim)' : 'var(--color-bg-tertiary)',
            color: state.isLive ? 'var(--color-healthy)' : 'var(--color-text-muted)',
            border: `1px solid ${state.isLive ? 'rgba(16, 185, 129, 0.3)' : 'var(--color-border)'}`,
          }}
        >
          {state.isLive ? <Play size={12} /> : <Pause size={12} />}
          {state.isLive ? 'LIVE' : 'PAUSED'}
        </button>

        {/* Search */}
        <div className="relative">
          {searchOpen ? (
            <input
              type="text"
              placeholder="Search components..."
              className="w-48 h-8 px-3 text-xs rounded-lg outline-none transition-all"
              style={{
                backgroundColor: 'var(--color-bg-tertiary)',
                border: '1px solid var(--color-border-light)',
                color: 'var(--color-text-primary)',
              }}
              autoFocus
              onBlur={() => setSearchOpen(false)}
            />
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
              style={{
                backgroundColor: 'var(--color-bg-tertiary)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-muted)',
              }}
            >
              <Search size={14} />
            </button>
          )}
        </div>

        {/* Notifications */}
        <button
          className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
          style={{
            backgroundColor: 'var(--color-bg-tertiary)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-muted)',
          }}
        >
          <Bell size={14} />
          {alertCount > 0 && (
            <span
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
              style={{ backgroundColor: 'var(--color-critical)', color: '#fff' }}
            >
              {alertCount}
            </span>
          )}
        </button>

        {/* User */}
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, var(--color-accent-dim), var(--color-prediction-dim))',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-primary)',
          }}
        >
          <User size={14} />
        </button>
      </div>
    </header>
  );
}
