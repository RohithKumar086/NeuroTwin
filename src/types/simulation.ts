export type SimulationStatus =
  | 'idle'
  | 'configuring'
  | 'initializing'
  | 'updating_graph'
  | 'running_model'
  | 'propagating'
  | 'forecasting'
  | 'complete'
  | 'error'
  | 'timeout';

export interface SimulationConfig {
  id: string;
  name: string;
  description: string;
  targetNodeId: string;
  targetNodeName: string;
  changes: SimulationChange[];
  createdAt: string;
}

export interface SimulationChange {
  parameter: string;
  currentValue: number;
  newValue: number;
  unit: string;
}

export interface SimulationResult {
  id: string;
  config: SimulationConfig;
  status: SimulationStatus;
  progress: number;          // 0-100
  startedAt: string;
  completedAt?: string;
  duration?: number;         // ms
  baseline: SystemMetrics;
  simulated: SystemMetrics;
  affectedComponents: AffectedComponent[];
  propagationPath: PropagationStep[];
  confidence: number;
}

export interface SystemMetrics {
  overallHealth: number;
  energyConsumption: number;
  avgTemperature: number;
  failureRisk: number;
  productionEfficiency: number;
  activeAlerts: number;
}

export interface AffectedComponent {
  nodeId: string;
  nodeName: string;
  impactLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
  healthChange: number;     // delta
  temperatureChange: number;
  failureProbChange: number;
  estimatedRecovery: string; // e.g. "2h 30m"
}

export interface PropagationStep {
  step: number;
  fromNodeId: string;
  fromNodeName: string;
  toNodeId: string;
  toNodeName: string;
  effect: string;
  delay: string;            // e.g. "immediate", "5 min", "1h"
}

export interface ScenarioComparison {
  scenarios: SimulationResult[];
  metrics: string[];
}

export const SIMULATION_STEPS: { status: SimulationStatus; label: string }[] = [
  { status: 'initializing', label: 'Initializing Twin' },
  { status: 'updating_graph', label: 'Updating Graph' },
  { status: 'running_model', label: 'Running Neural Model' },
  { status: 'propagating', label: 'Propagating State' },
  { status: 'forecasting', label: 'Generating Forecast' },
  { status: 'complete', label: 'Simulation Complete' },
];
