import { Prediction, PredictionSummary } from '@/types/prediction';

function generateTimeSeries(
  baseValue: number,
  trend: number,
  variance: number,
  points: number,
  intervalMs: number,
  startOffset: number = 0,
): { timestamp: number; value: number; lower: number; upper: number }[] {
  const now = Date.now();
  const data: { timestamp: number; value: number; lower: number; upper: number }[] = [];
  for (let i = 0; i < points; i++) {
    const t = now + startOffset + i * intervalMs;
    const noise = (Math.random() - 0.5) * variance;
    const value = baseValue + trend * i + noise;
    const uncertainty = Math.abs(trend) * i * 0.3 + variance * 0.5;
    data.push({
      timestamp: t,
      value: Math.round(value * 10) / 10,
      lower: Math.round((value - uncertainty) * 10) / 10,
      upper: Math.round((value + uncertainty) * 10) / 10,
    });
  }
  return data;
}

export const mockPredictions: Prediction[] = [
  {
    id: 'pred-001',
    nodeId: 'mot-001',
    nodeName: 'Motor A',
    metric: 'Temperature',
    unit: '°C',
    currentValue: 78.4,
    predictedValue: 84.2,
    confidence: 91.3,
    horizon: '1h',
    trend: 'increasing',
    riskLevel: 'high',
    historical: generateTimeSeries(65, 0.22, 2, 60, -60000),
    predicted: generateTimeSeries(78.4, 0.1, 1.5, 60, 60000),
    explanation: 'Temperature is projected to rise by +5.8°C over the next hour based on current vibration levels and load. Correlation with bearing friction pattern suggests mechanical heat generation.',
  },
  {
    id: 'pred-002',
    nodeId: 'mot-001',
    nodeName: 'Motor A',
    metric: 'Vibration',
    unit: 'mm/s',
    currentValue: 4.8,
    predictedValue: 5.6,
    confidence: 89.7,
    horizon: '1h',
    trend: 'increasing',
    riskLevel: 'high',
    historical: generateTimeSeries(2.8, 0.033, 0.5, 60, -60000),
    predicted: generateTimeSeries(4.8, 0.013, 0.4, 60, 60000),
    explanation: 'Vibration trend indicates progressive bearing degradation. Predicted to reach 5.6 mm/s within 1 hour. Recommend maintenance inspection if vibration exceeds 5.5 mm/s.',
  },
  {
    id: 'pred-003',
    nodeId: 'mot-001',
    nodeName: 'Motor A',
    metric: 'Failure Probability',
    unit: '%',
    currentValue: 18.4,
    predictedValue: 28.6,
    confidence: 87.4,
    horizon: '1h',
    trend: 'increasing',
    riskLevel: 'high',
    historical: generateTimeSeries(8, 0.17, 2, 60, -60000),
    predicted: generateTimeSeries(18.4, 0.17, 2, 60, 60000),
    explanation: 'Failure probability increased by 10.4% over the past hour due to rising vibration and temperature. GNN model identifies correlation with 3 similar historical failure events.',
  },
  {
    id: 'pred-004',
    nodeId: 'mot-001',
    nodeName: 'Motor A',
    metric: 'Health Score',
    unit: '%',
    currentValue: 71.2,
    predictedValue: 63.8,
    confidence: 90.1,
    horizon: '1h',
    trend: 'decreasing',
    riskLevel: 'high',
    historical: generateTimeSeries(88, -0.28, 2, 60, -60000),
    predicted: generateTimeSeries(71.2, -0.12, 2, 60, 60000),
    explanation: 'Health score declining at 0.28 points/minute. If unaddressed, predicted to drop below 60% within 3 hours — triggering automatic maintenance alert.',
  },
  {
    id: 'pred-005',
    nodeId: 'mch-001',
    nodeName: 'Machine A',
    metric: 'Temperature',
    unit: '°C',
    currentValue: 71.3,
    predictedValue: 73.8,
    confidence: 93.2,
    horizon: '1h',
    trend: 'increasing',
    riskLevel: 'medium',
    historical: generateTimeSeries(68, 0.055, 1.5, 60, -60000),
    predicted: generateTimeSeries(71.3, 0.042, 1.2, 60, 60000),
    explanation: 'Slight temperature increase predicted due to upstream Motor A thermal propagation. Cooling Unit A is compensating but thermal load is above average.',
  },
  {
    id: 'pred-006',
    nodeId: 'mch-002',
    nodeName: 'Machine B',
    metric: 'Energy',
    unit: 'kW',
    currentValue: 105,
    predictedValue: 108,
    confidence: 94.5,
    horizon: '1h',
    trend: 'increasing',
    riskLevel: 'low',
    historical: generateTimeSeries(97, 0.13, 3, 60, -60000),
    predicted: generateTimeSeries(105, 0.05, 2.5, 60, 60000),
    explanation: 'Energy consumption trending slightly above baseline. Pattern is consistent with normal workpiece variation and does not indicate mechanical degradation.',
  },
  {
    id: 'pred-007',
    nodeId: 'prd-001',
    nodeName: 'Production Line Alpha',
    metric: 'Load',
    unit: '%',
    currentValue: 71,
    predictedValue: 69,
    confidence: 95.8,
    horizon: '1h',
    trend: 'stable',
    riskLevel: 'low',
    historical: generateTimeSeries(70, 0.017, 3, 60, -60000),
    predicted: generateTimeSeries(71, -0.033, 2, 60, 60000),
    explanation: 'Production load expected to remain stable. Current batch processing is on schedule with no predicted bottlenecks.',
  },
];

export const mockPredictionSummary: PredictionSummary = {
  overallConfidence: 93.7,
  predictionsGenerated: 84,
  highRiskPredictions: 4,
  lastUpdated: new Date().toISOString(),
  modelVersion: 'v0.4.2',
};
