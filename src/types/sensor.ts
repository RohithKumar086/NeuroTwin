export type SensorType =
  | 'temperature'
  | 'pressure'
  | 'vibration'
  | 'energy'
  | 'rpm'
  | 'flow'
  | 'humidity'
  | 'voltage'
  | 'current'
  | 'load';

export type SensorStatus = 'active' | 'warning' | 'critical' | 'inactive' | 'error';

export interface Sensor {
  id: string;
  name: string;
  componentId: string;
  componentName: string;
  type: SensorType;
  value: number;
  unit: string;
  status: SensorStatus;
  lastUpdate: string;       // ISO date
  minValue: number;
  maxValue: number;
  warningThreshold: number;
  criticalThreshold: number;
  accuracy: number;          // percentage
  samplingRate: number;      // Hz
  history: SensorDataPoint[];
}

export interface SensorDataPoint {
  timestamp: number;
  value: number;
}

export const SENSOR_TYPE_LABELS: Record<SensorType, string> = {
  temperature: 'Temperature',
  pressure: 'Pressure',
  vibration: 'Vibration',
  energy: 'Energy',
  rpm: 'RPM',
  flow: 'Flow Rate',
  humidity: 'Humidity',
  voltage: 'Voltage',
  current: 'Current',
  load: 'Load',
};

export const SENSOR_UNITS: Record<SensorType, string> = {
  temperature: '°C',
  pressure: 'bar',
  vibration: 'mm/s',
  energy: 'kW',
  rpm: 'RPM',
  flow: 'L/min',
  humidity: '%',
  voltage: 'V',
  current: 'A',
  load: '%',
};
