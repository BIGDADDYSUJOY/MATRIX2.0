
import React, { useState } from 'react';
import { SupplyChainNode, DecodeReport, DecodeStatus } from '../types';
import { auditAgent } from '../services/geminiService';

interface AuditDetailProps {
  agent: SupplyChainNode;
  report: DecodeReport | null;
  onAuditComplete: (report: DecodeReport) => void;
  onClose: () => void;
}

const AuditDetail: React.FC<AuditDetailProps> = React.memo(({ agent, report, onAuditComplete, onClose }) => {
  const [isDecoding, setIsDecoding] = useState(false);

  const handleStartDecode = async () => {
    setIsDecoding(true);
    try {
      const result = await auditAgent(agent);
      onAuditComplete(result);
    } catch (error) {
      console.error("Decoding failed", error);
    } finally {
      setIsDecoding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      <div className="glass w-full max-w-5xl max-h-[95vh] overflow-hidden rounded-[32px] flex flex-col border-white/10 shadow-2xl">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-blue-500/10 to-transparent">
          <div>
            <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono text-blue-500 uppercase tracking-widest font-bold">Node Decoding</span>
                <span className="w-1 h-1 rounded-full bg-blue-500/50"></span>
                <span className="text-[10px] font-mono text-gray-500">{agent.id}</span>
            </div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">{agent.name}</h2>
            <p className="text-sm text-gray-400 font-medium">Classification: {agent.classification} • Sync: {new Date(agent.lastSynchronization).toLocaleTimeString()}</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-white/30 transition-all active:scale-90">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-blue-500/60 font-black">Geometric Node Specs</h3>
              <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <svg className="w-24 h-24" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" /></svg>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed italic mb-4">"{agent.description}"</p>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <p className="text-[9px] uppercase text-gray-500 font-bold mb-2">Flow Topology</p>
                        <code className="text-xs text-blue-400 font-mono bg-blue-500/10 px-2 py-1 rounded">{agent.type} NODE</code>
                    </div>
                    <div>
                        <p className="text-[9px] uppercase text-gray-500 font-bold mb-2">Coordinates</p>
                        <code className="text-xs text-white font-mono">LAT: {agent.coordinates.y} | LON: {agent.coordinates.x}</code>
                    </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-blue-500/60 font-black">Wave Parameters</h3>
              <div className="bg-black/40 p-6 rounded-2xl border border-white/5 space-y-4">
                {[
                    { label: 'Frequency', val: agent.frequency },
                    { label: 'Intensity', val: agent.intensity },
                    { label: 'Chaos', val: agent.chaos }
                ].map(param => (
                    <div key={param.label}>
                        <div className="flex justify-between text-[10px] font-mono mb-2">
                            <span className="text-gray-500">{param.label}</span>
                            <span className="text-white">{(param.val * 100).toFixed(1)}%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 transition-all duration-1000"
                                style={{ width: `${param.val * 100}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
              </div>
            </div>
          </section>

          {report ? (
            <section className="animate-in slide-in-from-bottom-4 duration-700 space-y-8">
              <div className="flex items-center gap-4">
                <h3 className="text-[10px] uppercase tracking-[0.3em] text-blue-500/60 font-black">Deep Decode Results</h3>
                <div className="h-px flex-1 bg-gradient-to-r from-blue-500/20 to-transparent"></div>
              </div>

              <div className={`p-8 rounded-3xl border ${report.status === DecodeStatus.SYNCHRONIZED ? 'bg-blue-500/5 border-blue-500/20 shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)]' : 'bg-red-500/5 border-red-500/20'}`}>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl border-2 ${report.status === DecodeStatus.SYNCHRONIZED ? 'border-blue-500 text-blue-500 glow-blue' : 'border-red-500 text-red-500 glow-red'}`}>
                      {report.status === DecodeStatus.SYNCHRONIZED ? 'Φ' : 'Ω'}
                    </div>
                    <div>
                      <p className="text-2xl font-black italic uppercase tracking-tighter">{report.status}</p>
                      <p className="text-xs font-mono text-blue-400/60 uppercase tracking-widest">
                        Sync Score: {report.synchronization_score}/10 • Pattern: {report.wave_interference_pattern}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
                        <p className="text-[9px] uppercase text-blue-500 font-bold mb-3 tracking-widest">Reasoning</p>
                        <p className="text-sm italic text-gray-300 leading-relaxed">"{report.reasoning}"</p>
                    </div>
                    <div className="space-y-4">
                        {[
                            { label: 'Frequency Rhythm', val: report.frequency_analysis },
                            { label: 'Intensity Magnitude', val: report.intensity_analysis },
                            { label: 'Chaos Distortion', val: report.chaos_analysis }
                        ].map(analysis => (
                            <div key={analysis.label} className="bg-black/20 p-4 rounded-xl border border-white/5">
                                <p className="text-[8px] uppercase text-gray-500 font-bold mb-1">{analysis.label}</p>
                                <p className="text-[11px] text-gray-400">{analysis.val}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-blue-500 tracking-[0.4em] uppercase">Emergent Simulation Logs</p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {report.testCases.map((tc, idx) => (
                      <div key={idx} className="bg-black/40 p-5 rounded-2xl border border-white/5 hover:border-blue-500/20 transition-colors">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[11px] font-bold text-blue-400 italic uppercase">{tc.scenario}</span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${tc.stability_index === 'PASS' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>
                            {tc.stability_index === 'PASS' ? 'STABLE' : 'DECOHERENT'}
                          </span>
                        </div>
                        <div className="space-y-2">
                            <div>
                                <p className="text-[8px] uppercase text-gray-600 font-bold mb-0.5">Input</p>
                                <p className="text-[11px] text-gray-500 font-mono">{tc.input_wave}</p>
                            </div>
                            <div>
                                <p className="text-[8px] uppercase text-gray-600 font-bold mb-0.5">Result</p>
                                <p className="text-[11px] text-blue-100/70 font-mono leading-relaxed">{tc.resultant_state}</p>
                            </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.01]">
              <div className="mb-8 relative">
                <div className="w-20 h-20 border-2 border-blue-500/20 rounded-full animate-ping"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-500/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
              </div>
              <p className="text-gray-500 mb-8 font-mono text-xs tracking-widest uppercase italic">Awaiting manual trigger for deep node decode.</p>
              <button
                onClick={handleStartDecode}
                disabled={isDecoding}
                className={`group relative px-12 py-5 rounded-full font-black uppercase tracking-[0.2em] transition-all overflow-hidden ${isDecoding ? 'bg-zinc-800 cursor-not-allowed' : 'bg-white text-black hover:scale-105 active:scale-95'}`}
              >
                <span className="relative z-10">{isDecoding ? 'Decoding Matrix...' : 'Initiate Deep Decode'}</span>
                {!isDecoding && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                )}
              </button>
              {isDecoding && (
                <div className="mt-6 flex gap-2">
                    {[0, 1, 2].map(i => (
                        <div key={i} className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}></div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default AuditDetail;
