import { Sensor } from '@/types/sensor';

function generateHistory(baseValue: number, variance: number, points: number = 60): { timestamp: number; value: number }[] {
  const now = Date.now();
  const history: { timestamp: number; value: number }[] = [];
  for (let i = points; i >= 0; i--) {
    history.push({
      timestamp: now - i * 60000, // 1 minute intervals
      value: baseValue + (Math.random() - 0.5) * variance * 2,
    });
  }
  return history;
}

export const mockSensors: Sensor[] = [
  // Motor A Sensors
  {
    id: 'S-001', name: 'Motor A Temperature', componentId: 'mot-001', componentName: 'Motor A',
    type: 'temperature', value: 78.4, unit: '°C', status: 'warning',
    lastUpdate: new Date().toISOString(), minValue: 20, maxValue: 120,
    warningThreshold: 75, criticalThreshold: 95, accuracy: 99.2, samplingRate: 10,
    history: generateHistory(72, 6),
  },
  {
    id: 'S-002', name: 'Motor A Vibration', componentId: 'mot-001', componentName: 'Motor A',
    type: 'vibration', value: 4.8, unit: 'mm/s', status: 'warning',
    lastUpdate: new Date().toISOString(), minValue: 0, maxValue: 15,
    warningThreshold: 4.5, criticalThreshold: 7.1, accuracy: 98.5, samplingRate: 100,
    history: generateHistory(3.2, 1.5),
  },
  {
    id: 'S-003', name: 'Motor A RPM', componentId: 'mot-001', componentName: 'Motor A',
    type: 'rpm', value: 1480, unit: 'RPM', status: 'active',
    lastUpdate: new Date().toISOString(), minValue: 0, maxValue: 3000,
    warningThreshold: 1550, criticalThreshold: 1600, accuracy: 99.8, samplingRate: 50,
    history: generateHistory(1488, 12),
  },
  {
    id: 'S-004', name: 'Motor A Current', componentId: 'mot-001', componentName: 'Motor A',
    type: 'current', value: 142, unit: 'A', status: 'active',
    lastUpdate: new Date().toISOString(), minValue: 0, maxValue: 250,
    warningThreshold: 180, criticalThreshold: 220, accuracy: 99.1, samplingRate: 50,
    history: generateHistory(138, 10),
  },

  // Motor B Sensors
  {
    id: 'S-005', name: 'Motor B Temperature', componentId: 'mot-002', componentName: 'Motor B',
    type: 'temperature', value: 62.1, unit: '°C', status: 'active',
    lastUpdate: new Date().toISOString(), minValue: 20, maxValue: 120,
    warningThreshold: 75, criticalThreshold: 95, accuracy: 99.2, samplingRate: 10,
    history: generateHistory(61, 3),
  },
  {
    id: 'S-006', name: 'Motor B Vibration', componentId: 'mot-002', componentName: 'Motor B',
    type: 'vibration', value: 2.1, unit: 'mm/s', status: 'active',
    lastUpdate: new Date().toISOString(), minValue: 0, maxValue: 15,
    warningThreshold: 4.5, criticalThreshold: 7.1, accuracy: 98.5, samplingRate: 100,
    history: generateHistory(2.0, 0.5),
  },

  // Motor C Sensors
  {
    id: 'S-007', name: 'Motor C Temperature', componentId: 'mot-003', componentName: 'Motor C',
    type: 'temperature', value: 59.8, unit: '°C', status: 'active',
    lastUpdate: new Date().toISOString(), minValue: 20, maxValue: 120,
    warningThreshold: 75, criticalThreshold: 95, accuracy: 99.2, samplingRate: 10,
    history: generateHistory(59, 2),
  },
  {
    id: 'S-008', name: 'Motor C Vibration', componentId: 'mot-003', componentName: 'Motor C',
    type: 'vibration', value: 1.9, unit: 'mm/s', status: 'active',
    lastUpdate: new Date().toISOString(), minValue: 0, maxValue: 15,
    warningThreshold: 4.5, criticalThreshold: 7.1, accuracy: 98.5, samplingRate: 100,
    history: generateHistory(1.8, 0.4),
  },

  // Machine A Sensors
  {
    id: 'S-009', name: 'Machine A Temperature', componentId: 'mch-001', componentName: 'Machine A',
    type: 'temperature', value: 71.3, unit: '°C', status: 'active',
    lastUpdate: new Date().toISOString(), minValue: 20, maxValue: 150,
    warningThreshold: 80, criticalThreshold: 100, accuracy: 99.0, samplingRate: 10,
    history: generateHistory(70, 4),
  },
  {
    id: 'S-010', name: 'Machine A Pressure', componentId: 'mch-001', componentName: 'Machine A',
    type: 'pressure', value: 4.2, unit: 'bar', status: 'active',
    lastUpdate: new Date().toISOString(), minValue: 0, maxValue: 12,
    warningThreshold: 6, criticalThreshold: 8, accuracy: 99.5, samplingRate: 20,
    history: generateHistory(4.1, 0.5),
  },
  {
    id: 'S-011', name: 'Machine A Vibration', componentId: 'mch-001', componentName: 'Machine A',
    type: 'vibration', value: 2.4, unit: 'mm/s', status: 'active',
    lastUpdate: new Date().toISOString(), minValue: 0, maxValue: 10,
    warningThreshold: 4, criticalThreshold: 6, accuracy: 98.5, samplingRate: 100,
    history: generateHistory(2.3, 0.5),
  },
  {
    id: 'S-012', name: 'Machine A Energy', componentId: 'mch-001', componentName: 'Machine A',
    type: 'energy', value: 120, unit: 'kW', status: 'active',
    lastUpdate: new Date().toISOString(), minValue: 0, maxValue: 250,
    warningThreshold: 180, criticalThreshold: 220, accuracy: 98.8, samplingRate: 5,
    history: generateHistory(118, 10),
  },

  // Machine B Sensors
  {
    id: 'S-013', name: 'Machine B Temperature', componentId: 'mch-002', componentName: 'Machine B',
    type: 'temperature', value: 68.7, unit: '°C', status: 'active',
    lastUpdate: new Date().toISOString(), minValue: 20, maxValue: 150,
    warningThreshold: 80, criticalThreshold: 100, accuracy: 99.0, samplingRate: 10,
    history: generateHistory(67, 3),
  },
  {
    id: 'S-014', name: 'Machine B Pressure', componentId: 'mch-002', componentName: 'Machine B',
    type: 'pressure', value: 3.8, unit: 'bar', status: 'active',
    lastUpdate: new Date().toISOString(), minValue: 0, maxValue: 12,
    warningThreshold: 6, criticalThreshold: 8, accuracy: 99.5, samplingRate: 20,
    history: generateHistory(3.7, 0.4),
  },

  // Machine C Sensors
  {
    id: 'S-015', name: 'Machine C Temperature', componentId: 'mch-003', componentName: 'Machine C',
    type: 'temperature', value: 64.2, unit: '°C', status: 'active',
    lastUpdate: new Date().toISOString(), minValue: 20, maxValue: 150,
    warningThreshold: 80, criticalThreshold: 100, accuracy: 99.0, samplingRate: 10,
    history: generateHistory(63, 3),
  },

  // Pump Sensors
  {
    id: 'S-016', name: 'Pump A Pressure', componentId: 'pmp-001', componentName: 'Pump A',
    type: 'pressure', value: 6.1, unit: 'bar', status: 'active',
    lastUpdate: new Date().toISOString(), minValue: 0, maxValue: 12,
    warningThreshold: 8, criticalThreshold: 10, accuracy: 99.5, samplingRate: 20,
    history: generateHistory(6.0, 0.4),
  },
  {
    id: 'S-017', name: 'Pump A Flow', componentId: 'pmp-001', componentName: 'Pump A',
    type: 'flow', value: 45.2, unit: 'L/min', status: 'active',
    lastUpdate: new Date().toISOString(), minValue: 0, maxValue: 80,
    warningThreshold: 60, criticalThreshold: 70, accuracy: 98.0, samplingRate: 10,
    history: generateHistory(44, 3),
  },
  {
    id: 'S-018', name: 'Pump B Pressure', componentId: 'pmp-002', componentName: 'Pump B',
    type: 'pressure', value: 5.8, unit: 'bar', status: 'active',
    lastUpdate: new Date().toISOString(), minValue: 0, maxValue: 12,
    warningThreshold: 8, criticalThreshold: 10, accuracy: 99.5, samplingRate: 20,
    history: generateHistory(5.7, 0.3),
  },

  // Compressor Sensors
  {
    id: 'S-019', name: 'Compressor A Pressure', componentId: 'comp-001', componentName: 'Compressor A',
    type: 'pressure', value: 7.8, unit: 'bar', status: 'active',
    lastUpdate: new Date().toISOString(), minValue: 0, maxValue: 14,
    warningThreshold: 9, criticalThreshold: 11, accuracy: 99.5, samplingRate: 20,
    history: generateHistory(7.7, 0.4),
  },
  {
    id: 'S-020', name: 'Compressor A Temperature', componentId: 'comp-001', componentName: 'Compressor A',
    type: 'temperature', value: 56.4, unit: '°C', status: 'active',
    lastUpdate: new Date().toISOString(), minValue: 20, maxValue: 120,
    warningThreshold: 70, criticalThreshold: 90, accuracy: 99.0, samplingRate: 10,
    history: generateHistory(55, 3),
  },

  // Cooling Sensors
  {
    id: 'S-021', name: 'Cooling A Temperature', componentId: 'cool-001', componentName: 'Cooling Unit A',
    type: 'temperature', value: 18.4, unit: '°C', status: 'active',
    lastUpdate: new Date().toISOString(), minValue: 5, maxValue: 40,
    warningThreshold: 25, criticalThreshold: 35, accuracy: 99.2, samplingRate: 10,
    history: generateHistory(18, 1.5),
  },
  {
    id: 'S-022', name: 'Cooling A Flow', componentId: 'cool-001', componentName: 'Cooling Unit A',
    type: 'flow', value: 52.1, unit: 'L/min', status: 'active',
    lastUpdate: new Date().toISOString(), minValue: 0, maxValue: 80,
    warningThreshold: 60, criticalThreshold: 70, accuracy: 98.0, samplingRate: 10,
    history: generateHistory(51, 2),
  },
  {
    id: 'S-023', name: 'Cooling B Temperature', componentId: 'cool-002', componentName: 'Cooling Unit B',
    type: 'temperature', value: 17.8, unit: '°C', status: 'active',
    lastUpdate: new Date().toISOString(), minValue: 5, maxValue: 40,
    warningThreshold: 25, criticalThreshold: 35, accuracy: 99.2, samplingRate: 10,
    history: generateHistory(17.5, 1),
  },

  // Power Unit Sensors
  {
    id: 'S-024', name: 'Main Power Voltage', componentId: 'pwr-001', componentName: 'Main Power Unit',
    type: 'voltage', value: 398.2, unit: 'V', status: 'active',
    lastUpdate: new Date().toISOString(), minValue: 350, maxValue: 450,
    warningThreshold: 420, criticalThreshold: 440, accuracy: 99.8, samplingRate: 50,
    history: generateHistory(398, 3),
  },
  {
    id: 'S-025', name: 'Main Power Current', componentId: 'pwr-001', componentName: 'Main Power Unit',
    type: 'current', value: 680, unit: 'A', status: 'active',
    lastUpdate: new Date().toISOString(), minValue: 0, maxValue: 1200,
    warningThreshold: 900, criticalThreshold: 1100, accuracy: 99.5, samplingRate: 50,
    history: generateHistory(670, 30),
  },

  // Production Line Sensors
  {
    id: 'S-026', name: 'Production Line Temperature', componentId: 'prd-001', componentName: 'Production Line Alpha',
    type: 'temperature', value: 42.1, unit: '°C', status: 'active',
    lastUpdate: new Date().toISOString(), minValue: 15, maxValue: 80,
    warningThreshold: 55, criticalThreshold: 70, accuracy: 99.0, samplingRate: 10,
    history: generateHistory(41, 2),
  },
  {
    id: 'S-027', name: 'Production Line Energy', componentId: 'prd-001', componentName: 'Production Line Alpha',
    type: 'energy', value: 280, unit: 'kW', status: 'active',
    lastUpdate: new Date().toISOString(), minValue: 0, maxValue: 500,
    warningThreshold: 380, criticalThreshold: 450, accuracy: 98.5, samplingRate: 5,
    history: generateHistory(275, 15),
  },
];
