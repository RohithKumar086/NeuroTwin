'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import cytoscape, { Core, EventObject } from 'cytoscape';
import { SystemNode, NODE_TYPE_ICONS } from '@/types/node';
import { GraphEdge, EDGE_TYPE_COLORS } from '@/types/graph';

interface TwinGraphProps {
  nodes: SystemNode[];
  edges: GraphEdge[];
  selectedNodeId: string | null;
  onNodeSelect: (id: string | null) => void;
  filterTypes?: string[];
  filterStatus?: string[];
  highlightNodeId?: string | null;
}

const statusColors: Record<string, string> = {
  healthy: '#10b981',
  warning: '#f59e0b',
  critical: '#ef4444',
  offline: '#6b7280',
};

const statusGlow: Record<string, string> = {
  healthy: 'rgba(16, 185, 129, 0.4)',
  warning: 'rgba(245, 158, 11, 0.4)',
  critical: 'rgba(239, 68, 68, 0.5)',
  offline: 'rgba(107, 114, 128, 0.2)',
};

interface TooltipData {
  node: SystemNode;
  x: number;
  y: number;
}

export default function TwinGraph({ nodes, edges, selectedNodeId, onNodeSelect, filterTypes, filterStatus, highlightNodeId }: TwinGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const getNodeSize = (node: SystemNode) => {
    switch (node.type) {
      case 'production_line': return 55;
      case 'machine': return 45;
      case 'motor': return 40;
      case 'pump': case 'compressor': case 'cooling': case 'power': return 38;
      case 'sensor': return 28;
      default: return 35;
    }
  };

  const initGraph = useCallback(() => {
    if (!containerRef.current) return;

    // Filter nodes
    let filteredNodes = nodes;
    if (filterTypes && filterTypes.length > 0) {
      filteredNodes = nodes.filter(n => filterTypes.includes(n.type));
    }
    if (filterStatus && filterStatus.length > 0) {
      filteredNodes = filteredNodes.filter(n => filterStatus.includes(n.status));
    }

    const nodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredEdges = edges.filter(e => nodeIds.has(e.source) && nodeIds.has(e.target));

    const elements = [
      ...filteredNodes.map(node => ({
        data: {
          id: node.id,
          label: node.type === 'sensor' ? node.name.split(' ').pop() : node.name,
          nodeData: node,
          icon: NODE_TYPE_ICONS[node.type] || '⚙️',
          healthScore: node.healthScore,
          failureProbability: node.failureProbability,
        },
        classes: [node.status, node.type, node.failureProbability > 10 ? 'predicted-risk' : ''].filter(Boolean).join(' '),
      })),
      ...filteredEdges.map(edge => ({
        data: {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          edgeType: edge.type,
          weight: edge.weight,
          label: edge.label,
        },
        classes: edge.type,
      })),
    ];

    if (cyRef.current) {
      cyRef.current.destroy();
    }

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        // Base node style
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'text-valign': 'bottom',
            'text-halign': 'center',
            'text-margin-y': 8,
            'font-size': '10px',
            'font-family': 'Inter, sans-serif',
            'font-weight': 500,
            'color': '#9ca3b4',
            'text-outline-color': '#0a0b0e',
            'text-outline-width': 2,
            'background-color': '#1a1d26',
            'border-width': 2,
            'border-color': '#6b7280',
            'width': 35,
            'height': 35,
            'transition-property': 'border-color, border-width, background-color',
            'transition-duration': 300,
          } as cytoscape.Css.Node,
        },
        // Healthy
        {
          selector: 'node.healthy',
          style: {
            'border-color': '#10b981',
            'background-color': '#064e3b',
            'shadow-blur': 12,
            'shadow-color': 'rgba(16, 185, 129, 0.3)',
            'shadow-opacity': 1,
          } as cytoscape.Css.Node,
        },
        // Warning
        {
          selector: 'node.warning',
          style: {
            'border-color': '#f59e0b',
            'background-color': '#78350f',
            'shadow-blur': 12,
            'shadow-color': 'rgba(245, 158, 11, 0.3)',
            'shadow-opacity': 1,
          } as cytoscape.Css.Node,
        },
        // Critical
        {
          selector: 'node.critical',
          style: {
            'border-color': '#ef4444',
            'background-color': '#7f1d1d',
            'shadow-blur': 16,
            'shadow-color': 'rgba(239, 68, 68, 0.4)',
            'shadow-opacity': 1,
            'border-width': 3,
          } as cytoscape.Css.Node,
        },
        // Offline
        {
          selector: 'node.offline',
          style: {
            'border-color': '#4b5563',
            'background-color': '#1f2937',
            'opacity': 0.6,
          } as cytoscape.Css.Node,
        },
        // Predicted Risk (outer ring effect via larger border)
        {
          selector: 'node.predicted-risk',
          style: {
            'border-width': 4,
            'border-style': 'double',
          } as cytoscape.Css.Node,
        },
        // Node types — size variations
        {
          selector: 'node.production_line',
          style: { 'width': 55, 'height': 55, 'shape': 'round-rectangle', 'font-size': '11px', 'font-weight': 700 } as cytoscape.Css.Node,
        },
        {
          selector: 'node.machine',
          style: { 'width': 45, 'height': 45, 'shape': 'round-rectangle' } as cytoscape.Css.Node,
        },
        {
          selector: 'node.motor',
          style: { 'width': 40, 'height': 40 } as cytoscape.Css.Node,
        },
        {
          selector: 'node.sensor',
          style: { 'width': 25, 'height': 25, 'font-size': '8px', 'border-width': 1.5 } as cytoscape.Css.Node,
        },
        // Selected node
        {
          selector: 'node:selected',
          style: {
            'border-color': '#06b6d4',
            'border-width': 3,
            'shadow-blur': 20,
            'shadow-color': 'rgba(6, 182, 212, 0.5)',
            'shadow-opacity': 1,
          } as cytoscape.Css.Node,
        },
        // Edges
        {
          selector: 'edge',
          style: {
            'width': 1.5,
            'line-color': '#2a2d3a',
            'target-arrow-color': '#2a2d3a',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'arrow-scale': 0.8,
            'opacity': 0.6,
            'transition-property': 'line-color, width, opacity',
            'transition-duration': 300,
          } as cytoscape.Css.Edge,
        },
        {
          selector: 'edge.power',
          style: { 'line-color': '#f59e0b44', 'target-arrow-color': '#f59e0b44' } as cytoscape.Css.Edge,
        },
        {
          selector: 'edge.mechanical',
          style: { 'line-color': '#6b728044', 'target-arrow-color': '#6b728044' } as cytoscape.Css.Edge,
        },
        {
          selector: 'edge.thermal',
          style: { 'line-color': '#ef444444', 'target-arrow-color': '#ef444444' } as cytoscape.Css.Edge,
        },
        {
          selector: 'edge.fluid',
          style: { 'line-color': '#3b82f644', 'target-arrow-color': '#3b82f644' } as cytoscape.Css.Edge,
        },
        {
          selector: 'edge.data',
          style: { 'line-color': '#8b5cf644', 'target-arrow-color': '#8b5cf644', 'line-style': 'dotted' } as cytoscape.Css.Edge,
        },
        // Highlighted edges (when hovering)
        {
          selector: 'edge.highlighted',
          style: { 'width': 3, 'opacity': 1, 'z-index': 10 } as cytoscape.Css.Edge,
        },
        {
          selector: 'node.highlighted',
          style: { 'border-width': 3, 'z-index': 10 } as cytoscape.Css.Node,
        },
        {
          selector: 'node.dimmed',
          style: { 'opacity': 0.2 } as cytoscape.Css.Node,
        },
        {
          selector: 'edge.dimmed',
          style: { 'opacity': 0.1 } as cytoscape.Css.Edge,
        },
      ],
      layout: {
        name: 'preset',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        positions: (node: any) => {
          const nodeId = typeof node === 'string' ? node : typeof node.id === 'function' ? node.id() : node.id;
          const n = nodes.find(nd => nd.id === nodeId);
          return n ? { x: n.position.x * 1.8, y: n.position.y * 1.2 } : { x: 0, y: 0 };
        },
        padding: 60,
        fit: true,
      } as cytoscape.LayoutOptions,
      minZoom: 0.3,
      maxZoom: 3,
      wheelSensitivity: 0.3,
    });

    // Events
    cy.on('tap', 'node', (e: EventObject) => {
      const nodeId = e.target.id();
      onNodeSelect(nodeId);
    });

    cy.on('tap', (e: EventObject) => {
      if (e.target === cy) {
        onNodeSelect(null);
        setTooltip(null);
      }
    });

    cy.on('mouseover', 'node', (e: EventObject) => {
      const nodeData = e.target.data('nodeData') as SystemNode;
      const pos = e.target.renderedPosition();
      setTooltip({ node: nodeData, x: pos.x, y: pos.y });

      // Highlight connected
      const connectedEdges = e.target.connectedEdges();
      const connectedNodes = connectedEdges.connectedNodes();
      
      cy.elements().addClass('dimmed');
      e.target.removeClass('dimmed').addClass('highlighted');
      connectedEdges.removeClass('dimmed').addClass('highlighted');
      connectedNodes.removeClass('dimmed').addClass('highlighted');
    });

    cy.on('mouseout', 'node', () => {
      setTooltip(null);
      cy.elements().removeClass('dimmed highlighted');
    });

    cyRef.current = cy;

    // Apply selected state
    if (selectedNodeId) {
      cy.getElementById(selectedNodeId).select();
    }
  }, [nodes, edges, selectedNodeId, onNodeSelect, filterTypes, filterStatus]);

  useEffect(() => {
    initGraph();
    return () => {
      if (cyRef.current) cyRef.current.destroy();
    };
  }, [initGraph]);

  // Highlight specific node
  useEffect(() => {
    if (!cyRef.current || !highlightNodeId) return;
    const cy = cyRef.current;
    const node = cy.getElementById(highlightNodeId);
    if (node.length) {
      cy.animate({ center: { eles: node }, zoom: 1.5 } as object, { duration: 500 });
    }
  }, [highlightNodeId]);

  return (
    <div className="relative w-full h-full" style={{ minHeight: 500 }}>
      <div ref={containerRef} className="w-full h-full cytoscape-container" />
      
      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-20 glass rounded-xl p-4 pointer-events-none animate-fade-in"
          style={{
            left: tooltip.x + 20,
            top: tooltip.y - 20,
            minWidth: 200,
            transform: 'translateY(-50%)',
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{
                backgroundColor: statusColors[tooltip.node.status],
                boxShadow: `0 0 8px ${statusGlow[tooltip.node.status]}`,
              }}
            />
            <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              {tooltip.node.name}
            </span>
          </div>
          <div className="space-y-1.5">
            {[
              { label: 'Health', value: `${tooltip.node.healthScore}%`, color: statusColors[tooltip.node.status] },
              { label: 'Temperature', value: `${tooltip.node.temperature}°C` },
              { label: 'Vibration', value: `${tooltip.node.vibration} mm/s` },
              { label: 'Load', value: `${tooltip.node.load}%` },
              { label: 'Failure Prob.', value: `${tooltip.node.failureProbability}%`, color: tooltip.node.failureProbability > 10 ? '#ef4444' : undefined },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between text-[11px]">
                <span style={{ color: 'var(--color-text-muted)' }}>{item.label}</span>
                <span className="font-mono font-medium" style={{ color: item.color || 'var(--color-text-primary)' }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
