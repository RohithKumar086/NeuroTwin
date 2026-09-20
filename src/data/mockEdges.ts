import { GraphEdge } from '@/types/graph';

export const mockEdges: GraphEdge[] = [
  // Power → Motors
  { id: 'e-001', source: 'pwr-001', target: 'mot-001', type: 'power', weight: 0.95, label: 'Primary Power' },
  { id: 'e-002', source: 'pwr-001', target: 'mot-002', type: 'power', weight: 0.95, label: 'Primary Power' },
  { id: 'e-003', source: 'pwr-001', target: 'mot-003', type: 'power', weight: 0.95, label: 'Primary Power' },
  { id: 'e-004', source: 'pwr-001', target: 'comp-001', type: 'power', weight: 0.9, label: 'Compressor Power' },
  { id: 'e-005', source: 'pwr-002', target: 'mot-001', type: 'power', weight: 0.3, label: 'Backup Power' },
  { id: 'e-006', source: 'pwr-002', target: 'mot-002', type: 'power', weight: 0.3, label: 'Backup Power' },
  { id: 'e-007', source: 'pwr-002', target: 'mot-003', type: 'power', weight: 0.3, label: 'Backup Power' },

  // Motors → Machines
  { id: 'e-008', source: 'mot-001', target: 'mch-001', type: 'mechanical', weight: 0.92, label: 'Drive' },
  { id: 'e-009', source: 'mot-002', target: 'mch-002', type: 'mechanical', weight: 0.92, label: 'Drive' },
  { id: 'e-010', source: 'mot-003', target: 'mch-003', type: 'mechanical', weight: 0.92, label: 'Drive' },

  // Motor A → Pump A
  { id: 'e-011', source: 'mot-001', target: 'pmp-001', type: 'mechanical', weight: 0.85, label: 'Pump Drive' },
  // Motor C → Pump B
  { id: 'e-012', source: 'mot-003', target: 'pmp-002', type: 'mechanical', weight: 0.85, label: 'Pump Drive' },

  // Pumps → Cooling
  { id: 'e-013', source: 'pmp-001', target: 'cool-001', type: 'fluid', weight: 0.88, label: 'Coolant Flow' },
  { id: 'e-014', source: 'pmp-002', target: 'cool-002', type: 'fluid', weight: 0.88, label: 'Coolant Flow' },

  // Cooling → Machines
  { id: 'e-015', source: 'cool-001', target: 'mch-001', type: 'thermal', weight: 0.78, label: 'Cooling' },
  { id: 'e-016', source: 'cool-001', target: 'mch-002', type: 'thermal', weight: 0.78, label: 'Cooling' },
  { id: 'e-017', source: 'cool-002', target: 'mch-003', type: 'thermal', weight: 0.78, label: 'Cooling' },

  // Compressor → Machines
  { id: 'e-018', source: 'comp-001', target: 'mch-001', type: 'fluid', weight: 0.7, label: 'Compressed Air' },
  { id: 'e-019', source: 'comp-001', target: 'mch-002', type: 'fluid', weight: 0.7, label: 'Compressed Air' },
  { id: 'e-020', source: 'comp-001', target: 'mch-003', type: 'fluid', weight: 0.7, label: 'Compressed Air' },

  // Machines → Production Line
  { id: 'e-021', source: 'mch-001', target: 'prd-001', type: 'dependency', weight: 0.95, label: 'Production Feed' },
  { id: 'e-022', source: 'mch-002', target: 'prd-001', type: 'dependency', weight: 0.95, label: 'Production Feed' },
  { id: 'e-023', source: 'mch-003', target: 'prd-001', type: 'dependency', weight: 0.85, label: 'Production Feed' },

  // Machine A ↔ Cooling feedback loop
  { id: 'e-024', source: 'mch-001', target: 'cool-001', type: 'thermal', weight: 0.6, label: 'Heat Output' },

  // Sensor data edges
  { id: 'e-025', source: 'mot-001', target: 'sen-001', type: 'data', weight: 1, label: 'Temperature Data' },
  { id: 'e-026', source: 'mot-001', target: 'sen-002', type: 'data', weight: 1, label: 'Vibration Data' },
  { id: 'e-027', source: 'mch-002', target: 'sen-003', type: 'data', weight: 1, label: 'Temperature Data' },
  { id: 'e-028', source: 'mch-003', target: 'sen-004', type: 'data', weight: 1, label: 'Temperature Data' },
  { id: 'e-029', source: 'pmp-001', target: 'sen-005', type: 'data', weight: 1, label: 'Pressure Data' },
  { id: 'e-030', source: 'cool-001', target: 'sen-006', type: 'data', weight: 1, label: 'Temperature Data' },
  { id: 'e-031', source: 'comp-001', target: 'sen-007', type: 'data', weight: 1, label: 'Pressure Data' },
  { id: 'e-032', source: 'pwr-001', target: 'sen-008', type: 'data', weight: 1, label: 'Voltage Data' },
];
