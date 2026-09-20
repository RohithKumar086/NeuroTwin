'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSystemState } from '@/hooks/useSystemState';
import { getGraph, GraphData } from '@/services/api';
import Badge from '@/components/ui/Badge';
import { Search, Filter } from 'lucide-react';

const TwinGraph = dynamic(() => import('@/components/graph/TwinGraph'), { ssr: false });

const nodeTypeFilters = [
  { value: '', label: 'All Nodes' },
  { value: 'machine', label: 'Machines' },
  { value: 'motor', label: 'Motors' },
  { value: 'pump', label: 'Pumps' },
  { value: 'compressor', label: 'Compressors' },
  { value: 'cooling', label: 'Cooling' },
  { value: 'power', label: 'Power' },
  { value: 'sensor', label: 'Sensors' },
  { value: 'production_line', label: 'Production' },
];

const statusFilters = [
  { value: '', label: 'All Status' },
  { value: 'healthy', label: 'Healthy' },
  { value: 'warning', label: 'Warning' },
  { value: 'critical', label: 'Critical' },
  { value: 'offline', label: 'Offline' },
];

export default function GraphPage() {
  const { state, selectNode } = useSystemState();
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [highlightId, setHighlightId] = useState<string | null>(null);

  useEffect(() => {
    getGraph().then(setGraphData);
  }, []);

  const filteredTypeArr = typeFilter ? [typeFilter] : undefined;
  const filteredStatusArr = statusFilter ? [statusFilter] : undefined;

  const searchResults = search
    ? state.nodes.filter(n => n.name.toLowerCase().includes(search.toLowerCase()))
    : [];

  return (
    <div className="animate-fade-in h-full flex flex-col">
      {/* Header */}
      <div className="mb-4 shrink-0">
        <h1 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>System Graph</h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
          Graph-level analysis — filter, search, and explore component dependencies
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mb-4 shrink-0 flex-wrap">
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            placeholder="Search nodes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-9 pr-3 rounded-lg text-xs outline-none w-56"
            style={{
              backgroundColor: 'var(--color-bg-tertiary)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          />
          {search && searchResults.length > 0 && (
            <div className="absolute top-full mt-1 left-0 w-full rounded-lg overflow-hidden z-30" style={{
              backgroundColor: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
            }}>
              {searchResults.slice(0, 6).map(n => (
                <button key={n.id}
                  onClick={() => { setHighlightId(n.id); setSearch(''); }}
                  className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 transition-colors cursor-pointer"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  <Badge status={n.status} size="sm" />
                  {n.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-1.5">
          <Filter size={12} style={{ color: 'var(--color-text-muted)' }} />
          <div className="flex gap-1">
            {nodeTypeFilters.map(f => (
              <button key={f.value}
                onClick={() => setTypeFilter(f.value === typeFilter ? '' : f.value)}
                className="px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                style={{
                  backgroundColor: typeFilter === f.value ? 'var(--color-accent-dim)' : 'var(--color-bg-tertiary)',
                  color: typeFilter === f.value ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  border: `1px solid ${typeFilter === f.value ? 'rgba(6,182,212,0.3)' : 'var(--color-border)'}`,
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex gap-1">
          {statusFilters.slice(1).map(f => (
            <button key={f.value}
              onClick={() => setStatusFilter(f.value === statusFilter ? '' : f.value)}
              className="px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
              style={{
                backgroundColor: statusFilter === f.value ? 'var(--color-bg-hover)' : 'var(--color-bg-tertiary)',
                color: statusFilter === f.value ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                border: `1px solid ${statusFilter === f.value ? 'var(--color-border-light)' : 'var(--color-border)'}`,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Graph + Stats */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Graph */}
        <div className="flex-1 rounded-xl overflow-hidden" style={{
          backgroundColor: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
        }}>
          <TwinGraph
            nodes={state.nodes}
            edges={state.edges}
            selectedNodeId={state.selectedNodeId}
            onNodeSelect={selectNode}
            filterTypes={filteredTypeArr}
            filterStatus={filteredStatusArr}
            highlightNodeId={highlightId}
          />
        </div>

        {/* Graph Statistics */}
        {graphData && (
          <div className="w-64 shrink-0 rounded-xl p-4 overflow-y-auto" style={{
            backgroundColor: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
          }}>
            <h3 className="text-xs font-semibold uppercase mb-4" style={{ color: 'var(--color-text-muted)' }}>Graph Statistics</h3>
            <div className="space-y-3">
              {[
                { label: 'Total Nodes', value: graphData.statistics.totalNodes },
                { label: 'Total Edges', value: graphData.statistics.totalEdges },
                { label: 'Average Degree', value: graphData.statistics.averageDegree },
                { label: 'Connected Components', value: graphData.statistics.connectedComponents },
                { label: 'Density', value: graphData.statistics.density },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>{s.label}</span>
                  <span className="text-sm font-bold font-mono" style={{ color: 'var(--color-text-primary)' }}>{s.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-6" style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
              <h4 className="text-[10px] font-semibold uppercase mb-3" style={{ color: 'var(--color-text-muted)' }}>Status Breakdown</h4>
              <div className="space-y-2">
                <StatusBar label="Healthy" count={graphData.statistics.healthyNodes} total={graphData.statistics.totalNodes} color="var(--color-healthy)" />
                <StatusBar label="Warning" count={graphData.statistics.warningNodes} total={graphData.statistics.totalNodes} color="var(--color-warning)" />
                <StatusBar label="Critical" count={graphData.statistics.criticalNodes} total={graphData.statistics.totalNodes} color="var(--color-critical)" />
                <StatusBar label="Offline" count={graphData.statistics.offlineNodes} total={graphData.statistics.totalNodes} color="var(--color-inactive)" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
        <span className="text-[11px] font-mono font-semibold" style={{ color }}>{count}</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-bg-hover)' }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}
