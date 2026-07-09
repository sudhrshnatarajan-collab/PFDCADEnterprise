export interface Equipment {
  id: string;
  tag: string;
  type: 'storage_tank' | 'pump' | 'reactor' | 'strainer' | 'heat_exchanger' | 'vessel';
  label: string;
  sequence: number;
  x: number;
  y: number;
  width: number;
  height: number;
  autoAdded?: boolean;
  material?: string;
  notes?: string[];
}

export interface Instrument {
  id: string;
  tag: string;
  type: 'PI' | 'LT' | 'FT' | 'FIC' | 'LI' | 'TI' | 'PIC' | 'FCV' | 'vent';
  label: string;
  x: number;
  y: number;
  lineRef?: string;
  equipmentRef?: string;
  autoAdded?: boolean;
  isFunctionBlock?: boolean;
}

export interface PipeLine {
  id: string;
  tag: string;
  from: string;
  to: string;
  size: string;
  material: string;
  type: 'process' | 'bypass' | 'vent' | 'drain' | 'sample';
  points: [number, number][];
  flowDirection: 'forward' | 'reverse' | 'bidirectional';
  autoAdded?: boolean;
}

export interface ControlValve {
  id: string;
  tag: string;
  x: number;
  y: number;
  lineRef: string;
  autoAdded?: boolean;
  hasBypass?: boolean;
  bypassLineId?: string;
}

export interface ValidationRule {
  ruleId: string;
  standard: string;
  description: string;
  status: 'passed' | 'warning' | 'failed' | 'autofixed';
  affectedEquipment: string[];
  autoFixApplied?: string;
}

export interface PFDModel {
  id: string;
  name: string;
  revision: string;
  createdAt: string;
  equipment: Equipment[];
  instruments: Instrument[];
  pipes: PipeLine[];
  controlValves: ControlValve[];
  validationResults: ValidationRule[];
}

export interface TestCase {
  id: string;
  label: string;
  model: PFDModel;
}
