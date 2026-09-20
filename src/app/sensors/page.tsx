'use client';

import { useState, useEffect, useMemo } from 'react';
import { getSensors } from '@/services/api';
import { Sensor, SENSOR_TYPE_LABELS } from '@/types/sensor';
import Badge from '@/components/ui/Badge';
import { Search, ArrowUpDown, Radio } from 'lucide-react';

export default function SensorsPage() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortBy, setSortBy] = useState<'id' | 'value' | 'status'>('id');

  useEffect(() => {
    getSensors().then(s => { setSensors(s); setLoading(false); });
  }, []);

  const filtered = useMemo(() => {
    let result = sensors;
    if (search) {
      result = result.filter(s =>
        s.id.toLowerCase().includes(search.toLowerCase()) ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.componentName.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (typeFilter) {
      result = result.filter(s => s.type === typeFilter);
    }
    if (sortBy === 'value') result = [...result].sort((a, b) => b.value - a.value);
    else if (sortBy === 'status') result = [...result].sort((a, b) => {
      const order = { critical: 0, warning: 1, active: 2, inactive: 3, error: 4 };
      return (order[a.status] ?? 5) - (order[b.status] ?? 5);
    });
    return result;
  }, [sensors, search, typeFilter, sortBy]);

  const sensorTypes = useMemo(() => [...new Set(sensors.map(s => s.type))], [sensors]);

  if (loading) {
    return (
      <div>
        <div className="skeleton h-8 w-48 mb-2" />
        <div className="skeleton h-4 w-80 mb-6" />
        <div className="skeleton h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Sensor Monitoring</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
            {sensors.length} sensors reporting across all components
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Radio size={14} style={{ color: 'var(--color-healthy)' }} />
          <span className="text-xs font-medium" style={{ color: 'var(--color-healthy)' }}>
            {sensors.filter(s => s.status === 'active' || s.status === 'warning').length} Active
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
          <input
            type="text" placeholder="Search sensors..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg text-xs outline-none"
            style={{ backgroundColor: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
          />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
          className="h-9 px-3 rounded-lg text-xs outline-none cursor-pointer"
          style={{ backgroundColor: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
          <option value="">All Types</option>
          {sensorTypes.map(t => <option key={t} value={t}>{SENSOR_TYPE_LABELS[t]}</option>)}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'id' | 'value' | 'status')}
          className="h-9 px-3 rounded-lg text-xs outline-none cursor-pointer"
          style={{ backgroundColor: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
          <option value="id">Sort by ID</option>
          <option value="value">Sort by Value</option>
          <option value="status">Sort by Status</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              {['Sensor ID', 'Component', 'Type', 'Value', 'Unit', 'Status', 'Last Update'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold uppercase" style={{ color: 'var(--color-text-muted)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(sensor => (
              <tr key={sensor.id} className="transition-colors" style={{ borderBottom: '1px solid var(--color-border)' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
                <td className="px-4 py-3">
                  <span className="text-xs font-mono font-semibold" style={{ color: 'var(--color-accent)' }}>{sensor.id}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs" style={{ color: 'var(--color-text-primary)' }}>{sensor.componentName}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{SENSOR_TYPE_LABELS[sensor.type]}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs font-mono font-bold" style={{
                    color: sensor.status === 'warning' ? 'var(--color-warning)' : sensor.status === 'critical' ? 'var(--color-critical)' : 'var(--color-text-primary)',
                  }}>
                    {sensor.value}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{sensor.unit}</span>
                </td>
                <td className="px-4 py-3">
                  <Badge status={sensor.status === 'active' ? 'healthy' : sensor.status as 'warning' | 'critical'} label={sensor.status} />
                </td>
                <td className="px-4 py-3">
                  <span className="text-[11px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
                    {new Date(sensor.lastUpdate).toLocaleTimeString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
