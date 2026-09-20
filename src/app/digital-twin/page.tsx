'use client';

import dynamic from 'next/dynamic';
import { useSystemState } from '@/hooks/useSystemState';
import { NodeDetailPanel } from '@/components/graph';
import SkeletonLoader from '@/components/ui/SkeletonLoader';

const TwinGraph = dynamic(() => import('@/components/graph/TwinGraph'), { ssr: false });

export default function DigitalTwinPage() {
  const { state, selectNode } = useSystemState();
  const { nodes, edges, selectedNodeId, isLoading } = state;
  const selectedNode = selectedNodeId ? nodes.find(n => n.id === selectedNodeId) : null;

  if (isLoading) {
    return (
      <div>
        <div className="skeleton h-8 w-48 mb-2" />
        <div className="skeleton h-4 w-80 mb-6" />
        <SkeletonLoader type="chart" className="h-[calc(100vh-220px)]" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in h-full flex flex-col">
      {/* Header */}
      <div className="mb-4 shrink-0">
        <h1 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Digital Twin</h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
          Interactive neural graph — click a node to inspect, hover for quick stats
        </p>
      </div>

      {/* Graph + Panel */}
      <div className="flex-1 flex gap-0 min-h-0">
        {/* Graph Area */}
        <div
          className="flex-1 rounded-xl overflow-hidden relative"
          style={{
            backgroundColor: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
          }}
        >
          {/* Legend */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-4 px-3 py-2 rounded-lg glass-subtle">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--color-healthy)', boxShadow: '0 0 6px rgba(16,185,129,0.5)' }} />
              <span className="text-[10px] font-medium" style={{ color: 'var(--color-text-muted)' }}>Healthy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--color-warning)', boxShadow: '0 0 6px rgba(245,158,11,0.5)' }} />
              <span className="text-[10px] font-medium" style={{ color: 'var(--color-text-muted)' }}>Warning</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--color-critical)', boxShadow: '0 0 6px rgba(239,68,68,0.5)' }} />
              <span className="text-[10px] font-medium" style={{ color: 'var(--color-text-muted)' }}>Critical</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ border: '2px solid var(--color-prediction)', backgroundColor: 'transparent' }} />
              <span className="text-[10px] font-medium" style={{ color: 'var(--color-text-muted)' }}>Predicted Risk</span>
            </div>
          </div>

          <TwinGraph
            nodes={nodes}
            edges={edges}
            selectedNodeId={selectedNodeId}
            onNodeSelect={selectNode}
          />
        </div>

        {/* Detail Panel */}
        {selectedNode && (
          <NodeDetailPanel
            node={selectedNode}
            allNodes={nodes}
            onClose={() => selectNode(null)}
          />
        )}
      </div>
    </div>
  );
}
