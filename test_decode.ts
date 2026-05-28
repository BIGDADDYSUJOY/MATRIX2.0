import { auditAgent } from './services/geminiService';
import { SupplyChainNode } from './types';

const tsmc: SupplyChainNode = {
    id: 'NL-002',
    name: 'TSMC Hsinchu',
    classification: 'Atomic Coherence Hub',
    description: 'The world\'s most advanced semiconductor fabrication cluster. Represents the pinnacle of Atomic Lay Line precision and Phase Coherence.',
    type: 'ATOMIC',
    lastSynchronization: new Date().toISOString(),
    coordinates: { x: 120.9, y: 24.7 },
    frequency: 0.98,
    intensity: 0.88,
    chaos: 0.05
};

async function run() {
    console.log("DECODING TSMC HSINCHU...");
    try {
        const report = await auditAgent(tsmc);
        console.log(JSON.stringify(report, null, 2));
    } catch (e) {
        console.error(e);
    }
}

run();
