export type PredictionHorizon = '5m' | '15m' | '30m' | '1h' | '6h' | '24h';

export interface PredictionDataPoint {
  timestamp: number;
  value: number;
  lower: number;  // confidence interval lower
  upper: number;  // confidence interval upper
}

export interface Prediction {
  id: string;
  nodeId: string;
  nodeName: string;
  metric: string;
  unit: string;
  currentValue: number;
  predictedValue: number;
  confidence: number;       // 0-100
  horizon: PredictionHorizon;
  trend: 'increasing' | 'decreasing' | 'stable';
  riskLevel: 'low' | 'medium' | 'high';
  historical: PredictionDataPoint[];
  predicted: PredictionDataPoint[];
  explanation: string;
}

export interface PredictionSummary {
  overallConfidence: number;
  predictionsGenerated: number;
  highRiskPredictions: number;
  lastUpdated: string;
  modelVersion: string;
}

export const HORIZON_LABELS: Record<PredictionHorizon, string> = {
  '5m': '5 Minutes',
  '15m': '15 Minutes',
  '30m': '30 Minutes',
  '1h': '1 Hour',
  '6h': '6 Hours',
  '24h': '24 Hours',
};

export const HORIZON_MS: Record<PredictionHorizon, number> = {
  '5m': 5 * 60 * 1000,
  '15m': 15 * 60 * 1000,
  '30m': 30 * 60 * 1000,
  '1h': 60 * 60 * 1000,
  '6h': 6 * 60 * 60 * 1000,
  '24h': 24 * 60 * 60 * 1000,
};
