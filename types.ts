
export enum DecodeStatus {
  SYNCHRONIZED = 'SYNCHRONIZED',
  DECOHERENT = 'DECOHERENT',
  STABLE = 'STABLE',
  UNSTABLE = 'UNSTABLE'
}

export type NodeType = 'PHYSICAL' | 'INFORMATIONAL' | 'TEMPORAL' | 'ATOMIC';

export interface SupplyChainNode {
  id: string;
  name: string;
  classification: string;
  description: string;
  type: NodeType;
  lastSynchronization: string;
  coordinates: { x: number; y: number };
  frequency: number;
  intensity: number;
  chaos: number;
}

export interface DecodeReport {
  node_id: string;
  status: DecodeStatus;
  reasoning: string;
  maquation: string; // The Opposite of Equation: You + Me = Why now?
  frequency_analysis: string;
  intensity_analysis: string;
  chaos_analysis: string;
  synchronization_score: number;
  wave_interference_pattern: 'CONSTRUCTIVE' | 'DESTRUCTIVE' | 'NEUTRAL';
  testCases: SimulationResult[];
}

export interface SimulationResult {
  scenario: string;
  input_wave: string;
  resultant_state: string;
  stability_index: 'PASS' | 'FAIL';
}

export interface WaveState {
  targetFrequency: number;
  targetIntensity: number;
  chaos: number;
  variation: number;
  currentFrequency: number;
  currentIntensity: number;
  phase: number;
  cycles: number;
  runtime: number;
  mode: 'Traveling' | 'Standing';
}
