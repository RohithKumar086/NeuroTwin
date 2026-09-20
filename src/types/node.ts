export type NodeType =
  | 'machine'
  | 'motor'
  | 'pump'
  | 'compressor'
  | 'cooling'
  | 'power'
  | 'sensor'
  | 'production_line';

export type NodeStatus = 'healthy' | 'warning' | 'critical' | 'offline';

export type OperatingState = 'running' | 'idle' | 'maintenance' | 'stopped' | 'starting' | 'shutting_down';

export interface SystemNode {
  id: string;
  name: string;
  type: NodeType;
  status: NodeStatus;
  operatingState: OperatingState;
  position: { x: number; y: number };

  // Dynamic properties
  temperature: number;        // °C
  pressure: number;           // bar
  vibration: number;          // mm/s
  energyConsumption: number;  // kW
  rpm: number;
  load: number;               // percentage 0-100
  healthScore: number;        // percentage 0-100
  failureProbability: number; // percentage 0-100

  // Metadata
  operatingHours: number;
  lastMaintenance: string;    // ISO date
  nextMaintenance: string;    // ISO date
  manufacturer: string;
  model: string;
  installDate: string;        // ISO date

  // Dependencies
  upstreamIds: string[];
  downstreamIds: string[];

  // Thresholds
  thresholds: NodeThresholds;
}

export interface NodeThresholds {
  temperature: { warning: number; critical: number };
  vibration: { warning: number; critical: number };
  load: { warning: number; critical: number };
  pressure: { warning: number; critical: number };
}

export interface NodeMetricHistory {
  nodeId: string;
  metric: string;
  timestamps: number[];
  values: number[];
}

export const NODE_TYPE_LABELS: Record<NodeType, string> = {
  machine: 'Machine',
  motor: 'Motor',
  pump: 'Pump',
  compressor: 'Compressor',
  cooling: 'Cooling System',
  power: 'Power Unit',
  sensor: 'Sensor',
  production_line: 'Production Line',
};

export const NODE_TYPE_ICONS: Record<NodeType, string> = {
  machine: '⚙️',
  motor: '🔄',
  pump: '💧',
  compressor: '🌀',
  cooling: '❄️',
  power: '⚡',
  sensor: '📡',
  production_line: '🏭',
};

export const STATUS_COLORS: Record<NodeStatus, string> = {
  healthy: '#10b981',
  warning: '#f59e0b',
  critical: '#ef4444',
  offline: '#6b7280',
};
