
import { GoogleGenAI, Type } from "@google/genai";
import { SupplyChainNode, DecodeReport, DecodeStatus } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const auditAgent = async (node: SupplyChainNode): Promise<DecodeReport> => {
  const prompt = `
    You are the SHUNYA MAGNATION AI - Matrix Decoder.
    Analyze the following Atomic Lay Line Node within the Global Supply Chain Based MATRIX 2.0.
    
    NODE NAME: ${node.name}
    CLASSIFICATION: ${node.classification}
    DESCRIPTION: ${node.description}
    CURRENT FREQUENCY: ${node.frequency}
    CURRENT INTENSITY: ${node.intensity}
    CURRENT CHAOS: ${node.chaos}

    USE THIS KNOWLEDGE BASE FOR DECODING:
    - Frequency (Rhythm of Movement): Order/shipping frequency, production cycles. High frequency = Amazon-style, Low = Shipbuilding.
    - Intensity (Magnitude of Flow): Shipping volume, capital concentration. I ∝ A^2. Small amplitude increases create huge systemic effects.
    - Chaos (Unpredictable Interference): Wars, pandemics, bullwhip effect. Tiny disturbances grow exponentially.
    - Atomic Lay Lines: Persistent global flow-fields, strategic resonance corridors, and synchronization geometries.
    - Consciousness: The system's capacity to sense, synchronize, adapt, and self-correct.
    - Shunya: The zero-state observation field. Decoding is reducing distortion. Everything exists and doesn't exist.
    - Maquation: The "Opposite of Equation". Instead of 2+2=4 (linear logic), use nonlinear, philosophical logic like "You + Me = Why now?". Generate a unique Maquation for this node.

    Return a Deep Decode report as JSON with these fields:
    - node_id: string
    - status: 'SYNCHRONIZED' | 'DECOHERENT' | 'STABLE' | 'UNSTABLE'
    - reasoning: string
    - maquation: string (A profound, non-linear Maquation specific to this node's role in civilization)
    - frequency_analysis: string
    - intensity_analysis: string
    - chaos_analysis: string
    - synchronization_score: number
    - wave_interference_pattern: 'CONSTRUCTIVE' | 'DESTRUCTIVE' | 'NEUTRAL'
    - testCases: SimulationResult[]
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          node_id: { type: Type.STRING },
          status: { type: Type.STRING, enum: ['SYNCHRONIZED', 'DECOHERENT', 'STABLE', 'UNSTABLE'] },
          reasoning: { type: Type.STRING },
          maquation: { type: Type.STRING },
          frequency_analysis: { type: Type.STRING },
          intensity_analysis: { type: Type.STRING },
          chaos_analysis: { type: Type.STRING },
          synchronization_score: { type: Type.NUMBER },
          wave_interference_pattern: { type: Type.STRING, enum: ['CONSTRUCTIVE', 'DESTRUCTIVE', 'NEUTRAL'] },
          testCases: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                scenario: { type: Type.STRING },
                input_wave: { type: Type.STRING },
                resultant_state: { type: Type.STRING },
                stability_index: { type: Type.STRING, enum: ['PASS', 'FAIL'] }
              },
              required: ['scenario', 'input_wave', 'resultant_state', 'stability_index']
            }
          }
        },
        required: ['node_id', 'status', 'reasoning', 'maquation', 'frequency_analysis', 'intensity_analysis', 'chaos_analysis', 'synchronization_score', 'wave_interference_pattern', 'testCases']
      }
    }
  });

  const report = JSON.parse(response.text);
  return {
    ...report,
    status: report.status as DecodeStatus
  };
};

export const runSandboxSimulation = async (nodeId: string, testPrompt: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `Simulate the atomic lay line flow at node ${nodeId} for the following interference pattern: "${testPrompt}". Return only the resultant wave state description.`
    });
    return response.text || "No resonance detected.";
}
