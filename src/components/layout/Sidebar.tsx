'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Network, GitBranch, TrendingUp, FlaskConical,
  AlertTriangle, Radio, Brain, Bell, Settings, ChevronLeft, ChevronRight,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/digital-twin', label: 'Digital Twin', icon: Network },
  { href: '/graph', label: 'System Graph', icon: GitBranch },
  { href: '/predictions', label: 'Predictions', icon: TrendingUp },
  { href: '/simulation', label: 'Simulation', icon: FlaskConical },
  { href: '/anomalies', label: 'Anomalies', icon: AlertTriangle },
  { href: '/sensors', label: 'Sensors', icon: Radio },
  { href: '/model', label: 'Model', icon: Brain },
  { href: '/events', label: 'Events / Alerts', icon: Bell },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed left-0 top-0 h-screen z-40 flex flex-col transition-all duration-300 ${
        collapsed ? 'w-[68px]' : 'w-[240px]'
      }`}
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        borderRight: '1px solid var(--color-border)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 gap-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-prediction))' }}>
          <Network size={18} color="#fff" />
        </div>
        {!collapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>Neural Twin</span>
            <span className="text-[10px] font-medium" style={{ color: 'var(--color-text-muted)' }}>v0.4.2 · Prototype</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-all duration-200 group ${
                collapsed ? 'justify-center' : ''
              }`}
              style={{
                backgroundColor: isActive ? 'var(--color-bg-hover)' : 'transparent',
                color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                borderLeft: isActive ? '2px solid var(--color-accent)' : '2px solid transparent',
              }}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} className="shrink-0" style={{
                color: isActive ? 'var(--color-accent)' : undefined,
              }} />
              {!collapsed && (
                <span className="text-[13px] font-medium truncate">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 transition-colors hover:opacity-80 cursor-pointer"
        style={{
          borderTop: '1px solid var(--color-border)',
          color: 'var(--color-text-muted)',
        }}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
}
