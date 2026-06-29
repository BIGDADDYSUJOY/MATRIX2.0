
import React, { useState } from 'react';
import { SupplyChainNode, DecodeReport, DecodeStatus } from '../types';
import { auditAgent } from '../services/geminiService';

interface DecodeDetailProps {
  agent: SupplyChainNode;
  report: DecodeReport | null;
  onDecodeComplete: (report: DecodeReport) => void;
  onClose: () => void;
}

const DecodeDetail: React.FC<DecodeDetailProps> = React.memo(({ agent, report, onDecodeComplete: onAuditComplete, onClose }) => {
  const [isDecoding, setIsDecoding] = useState(false);

  const handleStartDecode = async () => {
    setIsDecoding(true);
    try {
      const result = await auditAgent(agent);
      onAuditComplete(result);
    } catch (error) {
      console.error('Decoding failed:', error);
    } finally {
      setIsDecoding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="glass w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border-white/10 shadow-2xl relative z-10 animate-in fade-in zoom-in duration-300">
        <div className="sticky top-0 z-20 bg-black/40 backdrop-blur-xl border-b border-white/5 p-6 flex justify-between items-center">
          <div>
            <div className="text-[10px] font-mono text-blue-500 uppercase tracking-widest mb-1">Deep Decode Report</div>
            <h2 className="text-3xl font-black tracking-tighter uppercase italic">{agent.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-8">
          {!report && !isDecoding ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-full border-2 border-blue-500/20 flex items-center justify-center mb-6 animate-pulse">
                <div className="w-12 h-12 rounded-full border-2 border-blue-500/50"></div>
              </div>
              <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">Node Unsynchronized</h3>
              <p className="text-gray-500 max-w-xs text-sm mb-8">This Atomic Lay Line is currently in a state of unobserved potential. Initiate deep decode to synchronize.</p>
              <button
                onClick={handleStartDecode}
                className="bg-blue-600 hover:bg-blue-500 text-black font-black px-8 py-4 rounded-xl transition-all uppercase tracking-widest text-sm glow-blue active:scale-95"
              >
                Initiate Deep Decode
              </button>
            </div>
          ) : isDecoding ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-xl font-bold mb-2 uppercase tracking-tight animate-pulse">Decoding Atomic Signals...</h3>
              <p className="text-gray-500 font-mono text-[10px] uppercase tracking-widest">Querying SHUNYA MAGNATION AI</p>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Report Header Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-2xl border-white/5">
                    <p className="text-[10px] uppercase text-gray-500 font-bold mb-2 tracking-widest">Sync Score</p>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-black font-mono text-blue-400">{report!.synchronization_score}</span>
                        <span className="text-gray-600 text-sm mb-1 font-mono">/ 10</span>
                    </div>
                </div>
                <div className="glass p-6 rounded-2xl border-white/5">
                    <p className="text-[10px] uppercase text-gray-500 font-bold mb-2 tracking-widest">Interference</p>
                    <p className="text-xl font-black text-white uppercase italic tracking-tighter">{report!.wave_interference_pattern}</p>
                </div>
                <div className="glass p-6 rounded-2xl border-white/5">
                    <p className="text-[10px] uppercase text-gray-500 font-bold mb-2 tracking-widest">Status</p>
                    <p className="text-xl font-black text-blue-500 uppercase italic tracking-tighter">{report!.status}</p>
                </div>
              </div>

              {/* Reasoning */}
              <div>
                <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-4 border-l-2 border-blue-500 pl-4">Executive Summary</h4>
                <p className="text-lg text-gray-200 leading-relaxed font-medium italic">"{report!.reasoning}"</p>
              </div>

              {/* Detailed Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <div>
                        <h4 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-3">Frequency Dynamics</h4>
                        <p className="text-sm text-gray-400 leading-relaxed">{report!.frequency_analysis}</p>
                    </div>
                    <div>
                        <h4 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-3">Intensity Metrics</h4>
                        <p className="text-sm text-gray-400 leading-relaxed">{report!.intensity_analysis}</p>
                    </div>
                </div>
                <div className="space-y-8">
                    <div>
                        <h4 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-3">Chaos Analysis</h4>
                        <p className="text-sm text-gray-400 leading-relaxed">{report!.chaos_analysis}</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                        <h4 className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-3 italic">Maquation Logic</h4>
                        <p className="text-xs font-mono text-blue-300/80 leading-relaxed">
                            {/* Simulate the metaphysical logic output mentioned in the context */}
                            Ψ(Node) = Frequency(${agent.frequency}) ⊗ Intensity(${agent.intensity}) / Chaos(${agent.chaos})
                            Result: Consciousness Coherence at ${report!.synchronization_score * 10}%
                        </p>
                    </div>
                </div>
              </div>

              {/* Simulation Sandbox */}
              <div>
                <h4 className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-4">
                    <span>Interference Sandbox</span>
                    <span className="h-px flex-1 bg-red-500/20"></span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {report!.testCases.map((tc, idx) => (
                    <div key={idx} className="glass p-5 rounded-xl border-white/5 hover:border-red-500/20 transition-all group">
                        <div className="flex justify-between items-start mb-3">
                            <span className="text-[8px] font-mono bg-red-500/10 text-red-400 px-2 py-0.5 rounded uppercase font-bold tracking-widest">Scenario {idx + 1}</span>
                            <span className={`text-[8px] font-mono px-2 py-0.5 rounded uppercase font-bold ${tc.stability_index === 'PASS' ? 'text-emerald-400' : 'text-red-400'}`}>
                                {tc.stability_index}
                            </span>
                        </div>
                        <p className="text-sm font-bold text-white mb-2 group-hover:text-red-400 transition-colors">{tc.scenario}</p>
                        <div className="space-y-2">
                            <div className="text-[10px] text-gray-500 font-mono"><span className="text-gray-700">INPUT:</span> {tc.input_wave}</div>
                            <div className="text-[10px] text-gray-400 font-mono italic"><span className="text-gray-700">RESULT:</span> {tc.resultant_state}</div>
                        </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-8 border-t border-white/5 bg-black/20 flex justify-end">
            <button
                onClick={onClose}
                className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-colors"
            >
                Close Decoder
            </button>
        </div>
      </div>
    </div>
  );
});

export default DecodeDetail;
