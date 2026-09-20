export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertStatus = 'active' | 'investigating' | 'resolved' | 'dismissed';

export interface Alert {
  id: string;
  timestamp: string;
  componentId: string;
  componentName: string;
  event: string;
  description: string;
  severity: AlertSeverity;
  status: AlertStatus;
  confidence: number;        // 0-100
  possibleCause: string;
  affectedDependencies: string[];
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface AlertSummary {
  total: number;
  critical: number;
  warning: number;
  info: number;
  resolved: number;
  falsePositiveRate: number;
}

export interface Anomaly extends Alert {
  metricName: string;
  expectedValue: number;
  actualValue: number;
  deviation: number;          // standard deviations
  unit: string;
}

export const SEVERITY_COLORS: Record<AlertSeverity, string> = {
  critical: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
};

export const STATUS_LABELS: Record<AlertStatus, string> = {
  active: 'Active',
  investigating: 'Investigating',
  resolved: 'Resolved',
  dismissed: 'Dismissed',
};
