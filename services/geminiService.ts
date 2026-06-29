
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

    CORE PHILOSOPHY: "What living being eats that's the hunger of nature."
    This "hunger" is the hunger of Supreme Consciousness.
    Analyze this node through the Frequency–Intensity–Chaos framework, viewing the global supply chain as a large-scale wave-interference system and metabolic process of consciousness.

    Return a Deep Decode report as JSON with these fields:
    - node_id: string
    - status: 'SYNCHRONIZED' | 'DECOHERENT' | 'STABLE' | 'UNSTABLE'
    - reasoning: A brief, esoteric yet technical summary of the node's current state.
    - frequency_analysis: How its rhythm affects global movement and the "metabolic pulse" of nature.
    - intensity_analysis: The magnitude of flow and "nutritional" volume concentration at this node.
    - chaos_analysis: Nonlinear disruption potential and "digestive" sensitivity.
    - synchronization_score: 0-10
    - wave_interference_pattern: 'CONSTRUCTIVE' | 'DESTRUCTIVE' | 'NEUTRAL'
    - maquation: A "Maquation" (nonlinear philosophical logic output) that captures the metaphysical essence of this node's hunger and state (e.g., "You + Me = Why now?", "Flow = Hunger * Silence").
    - testCases: 2-3 Simulation scenarios showing emergent behaviors.
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
          frequency_analysis: { type: Type.STRING },
          intensity_analysis: { type: Type.STRING },
          chaos_analysis: { type: Type.STRING },
          synchronization_score: { type: Type.NUMBER },
          wave_interference_pattern: { type: Type.STRING, enum: ['CONSTRUCTIVE', 'DESTRUCTIVE', 'NEUTRAL'] },
          maquation: { type: Type.STRING },
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
        required: ['node_id', 'status', 'reasoning', 'frequency_analysis', 'intensity_analysis', 'chaos_analysis', 'synchronization_score', 'wave_interference_pattern', 'testCases']
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
