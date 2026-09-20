/**
 * Mock API Service Layer
 * 
 * Mirrors the future REST API contract. Replace these functions
 * with actual fetch() calls when the backend is ready.
 * 
 * Future endpoints:
 *   GET  /api/twin/state
 *   GET  /api/graph
 *   GET  /api/sensors
 *   GET  /api/predictions
 *   POST /api/simulation
 *   GET  /api/anomalies
 *   GET  /api/model/status
 */

import { allNodes } from '@/data/mockNodes';
import { mockEdges } from '@/data/mockEdges';
import { mockSensors } from '@/data/mockSensors';
import { mockPredictions, mockPredictionSummary } from '@/data/mockPredictions';
import { mockAlerts, mockAnomalies } from '@/data/mockAlerts';
import { mockScenarioResults, mockScenarioConfigs } from '@/data/mockScenarios';
import { SystemNode } from '@/types/node';
import { GraphEdge, GraphStatistics } from '@/types/graph';
import { Sensor } from '@/types/sensor';
import { Prediction, PredictionSummary } from '@/types/prediction';
import { Alert, Anomaly, AlertSummary } from '@/types/alert';
import { SimulationResult, SimulationConfig } from '@/types/simulation';

// Simulate network latency
const delay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms + Math.random() * 300));

// ─── Twin State ──────────────────────────────────────────────

export interface TwinState {
  nodes: SystemNode[];
  overallHealth: number;
  activeMachines: number;
  activeSensors: number;
  anomaliesDetected: number;
  failureRisk: number;
  energyConsumption: number;
  modelConfidence: number;
  dataFreshness: number; // seconds ago
  systemStatus: 'operational' | 'degraded' | 'critical' | 'offline';
  lastSync: string;
}

export async function getTwinState(): Promise<TwinState> {
  await delay();
  const nodes = allNodes;
  const machines = nodes.filter(n => n.type === 'machine' || n.type === 'motor' || n.type === 'pump' || n.type === 'compressor' || n.type === 'cooling' || n.type === 'power' || n.type === 'production_line');
  const activeMachines = machines.filter(n => n.operatingState === 'running').length;
  const sensors = nodes.filter(n => n.type === 'sensor');
  const activeSensors = sensors.filter(n => n.operatingState === 'running').length;
  
  const avgHealth = machines.reduce((sum, n) => sum + n.healthScore, 0) / machines.length;
  const maxFailure = Math.max(...machines.map(n => n.failureProbability));
  const totalEnergy = machines.reduce((sum, n) => sum + n.energyConsumption, 0);
  
  return {
    nodes,
    overallHealth: Math.round(avgHealth * 10) / 10,
    activeMachines,
    activeSensors,
    anomaliesDetected: mockAnomalies.filter(a => a.status === 'active').length,
    failureRisk: Math.round(maxFailure * 10) / 10,
    energyConsumption: Math.round(totalEnergy),
    modelConfidence: 94.2,
    dataFreshness: 1.2,
    systemStatus: maxFailure > 30 ? 'critical' : maxFailure > 15 ? 'degraded' : 'operational',
    lastSync: new Date().toISOString(),
  };
}

// ─── Graph ───────────────────────────────────────────────────

export interface GraphData {
  nodes: SystemNode[];
  edges: GraphEdge[];
  statistics: GraphStatistics;
}

export async function getGraph(): Promise<GraphData> {
  await delay();
  const nodes = allNodes;
  const edges = mockEdges;

  const healthy = nodes.filter(n => n.status === 'healthy').length;
  const warning = nodes.filter(n => n.status === 'warning').length;
  const critical = nodes.filter(n => n.status === 'critical').length;
  const offline = nodes.filter(n => n.status === 'offline').length;

  return {
    nodes,
    edges,
    statistics: {
      totalNodes: nodes.length,
      totalEdges: edges.length,
      averageDegree: Math.round((edges.length * 2 / nodes.length) * 100) / 100,
      connectedComponents: 1,
      criticalNodes: critical,
      warningNodes: warning,
      healthyNodes: healthy,
      offlineNodes: offline,
      density: Math.round((2 * edges.length / (nodes.length * (nodes.length - 1))) * 1000) / 1000,
    },
  };
}

// ─── Sensors ─────────────────────────────────────────────────

export async function getSensors(): Promise<Sensor[]> {
  await delay();
  return mockSensors.map(s => ({
    ...s,
    lastUpdate: new Date().toISOString(),
  }));
}

export async function getSensorById(id: string): Promise<Sensor | null> {
  await delay();
  return mockSensors.find(s => s.id === id) || null;
}

// ─── Predictions ─────────────────────────────────────────────

export async function getPredictions(nodeId?: string): Promise<Prediction[]> {
  await delay();
  if (nodeId) {
    return mockPredictions.filter(p => p.nodeId === nodeId);
  }
  return mockPredictions;
}

export async function getPredictionSummary(): Promise<PredictionSummary> {
  await delay();
  return { ...mockPredictionSummary, lastUpdated: new Date().toISOString() };
}

// ─── Simulation ──────────────────────────────────────────────

export async function runSimulation(config: SimulationConfig): Promise<SimulationResult> {
  // Simulate longer delay for simulation
  await delay(1500);
  
  // Return matching pre-built result or generate a generic one
  const matchingResult = mockScenarioResults.find(r => r.config.id === config.id);
  if (matchingResult) {
    return { ...matchingResult, startedAt: new Date().toISOString() };
  }

  // Generic result for custom simulations
  return {
    id: `result-${Date.now()}`,
    config,
    status: 'complete',
    progress: 100,
    startedAt: new Date(Date.now() - 3000).toISOString(),
    completedAt: new Date().toISOString(),
    duration: 3200,
    baseline: {
      overallHealth: 92.4,
      energyConsumption: 1182,
      avgTemperature: 54.8,
      failureRisk: 7.8,
      productionEfficiency: 94.2,
      activeAlerts: 3,
    },
    simulated: {
      overallHealth: 85.1,
      energyConsumption: 1250,
      avgTemperature: 58.2,
      failureRisk: 14.5,
      productionEfficiency: 88.6,
      activeAlerts: 5,
    },
    affectedComponents: [],
    propagationPath: [],
    confidence: 88.3,
  };
}

export async function getScenarios(): Promise<SimulationConfig[]> {
  await delay();
  return mockScenarioConfigs;
}

export async function getScenarioResults(): Promise<SimulationResult[]> {
  await delay();
  return mockScenarioResults;
}

// ─── Anomalies ───────────────────────────────────────────────

export async function getAnomalies(): Promise<Anomaly[]> {
  await delay();
  return mockAnomalies;
}

export async function getAlerts(): Promise<Alert[]> {
  await delay();
  return mockAlerts;
}

export async function getAlertSummary(): Promise<AlertSummary> {
  await delay();
  const total = mockAlerts.length;
  const critical = mockAlerts.filter(a => a.severity === 'critical').length;
  const warning = mockAlerts.filter(a => a.severity === 'warning').length;
  const info = mockAlerts.filter(a => a.severity === 'info').length;
  const resolved = mockAlerts.filter(a => a.status === 'resolved').length;
  return { total, critical, warning, info, resolved, falsePositiveRate: 3.2 };
}

// ─── Model Status ────────────────────────────────────────────

export interface ModelStatus {
  name: string;
  version: string;
  architecture: string;
  graphNodes: number;
  graphEdges: number;
  inputFeatures: number;
  predictionHorizon: string;
  lastTraining: string;
  trainingDuration: string;
  status: 'active' | 'training' | 'error';
  metrics: {
    mae: number;
    rmse: number;
    f1Score: number;
    precision: number;
    recall: number;
    predictionAccuracy: number;
    modelConfidence: number;
  };
  trainingLoss: number[];
  validationLoss: number[];
}

export async function getModelStatus(): Promise<ModelStatus> {
  await delay();
  return {
    name: 'Graph Neural Network + Temporal Model',
    version: 'v0.4.2',
    architecture: 'GATv2 (4 layers) + GRU (2 layers)',
    graphNodes: allNodes.length,
    graphEdges: mockEdges.length,
    inputFeatures: 12,
    predictionHorizon: '24 hours',
    lastTraining: '2026-09-19T03:00:00Z',
    trainingDuration: '4h 23m',
    status: 'active',
    metrics: {
      mae: 0.0342,
      rmse: 0.0518,
      f1Score: 0.924,
      precision: 0.938,
      recall: 0.911,
      predictionAccuracy: 94.2,
      modelConfidence: 93.7,
    },
    trainingLoss: [0.82, 0.54, 0.38, 0.28, 0.21, 0.17, 0.14, 0.12, 0.10, 0.09, 0.08, 0.075, 0.071, 0.068, 0.065, 0.063, 0.061, 0.059, 0.058, 0.057],
    validationLoss: [0.85, 0.62, 0.45, 0.35, 0.28, 0.24, 0.21, 0.19, 0.17, 0.16, 0.15, 0.145, 0.14, 0.138, 0.135, 0.133, 0.131, 0.13, 0.129, 0.128],
  };
}
