export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  weight: number;          // 0-1 strength of dependency
  label?: string;
  animated?: boolean;
}

export type EdgeType =
  | 'power'
  | 'mechanical'
  | 'thermal'
  | 'fluid'
  | 'data'
  | 'control'
  | 'dependency';

export interface GraphStatistics {
  totalNodes: number;
  totalEdges: number;
  averageDegree: number;
  connectedComponents: number;
  criticalNodes: number;
  warningNodes: number;
  healthyNodes: number;
  offlineNodes: number;
  density: number;
}

export type GraphFilter = {
  nodeTypes: string[];
  statusFilter: string[];
  searchQuery: string;
  showPredictedRisk: boolean;
  showCriticalPath: boolean;
  highlightDependencies: string | null; // node id
};

export const EDGE_TYPE_COLORS: Record<EdgeType, string> = {
  power: '#f59e0b',
  mechanical: '#6b7280',
  thermal: '#ef4444',
  fluid: '#3b82f6',
  data: '#8b5cf6',
  control: '#10b981',
  dependency: '#64748b',
};

export const EDGE_TYPE_LABELS: Record<EdgeType, string> = {
  power: 'Power Supply',
  mechanical: 'Mechanical',
  thermal: 'Thermal',
  fluid: 'Fluid',
  data: 'Data',
  control: 'Control',
  dependency: 'Dependency',
};
