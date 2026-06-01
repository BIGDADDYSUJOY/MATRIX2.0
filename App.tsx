
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { SupplyChainNode, DecodeReport, DecodeStatus, WaveState } from './types';
import AuditCard from './components/AuditCard';
import AuditDetail from './components/AuditDetail';
import WaveEngine from './components/WaveEngine';

const INITIAL_NODES: SupplyChainNode[] = [
  {
    id: 'NL-001',
    name: 'Strait of Malacca',
    classification: 'Geopolitical Chokepoint',
    description: 'The primary maritime gateway between the Indian Ocean and the Pacific Ocean. Governs the Frequency of energy and raw material flow.',
    type: 'PHYSICAL',
    lastSynchronization: new Date().toISOString(),
    coordinates: { x: 102.3, y: 2.2 },
    frequency: 0.85,
    intensity: 0.92,
    chaos: 0.15
  },
  {
    id: 'NL-002',
    name: 'TSMC Hsinchu',
    classification: 'Atomic Coherence Hub',
    description: 'The world\'s most advanced semiconductor fabrication cluster. Represents the pinnacle of Atomic Lay Line precision and Phase Coherence.',
    type: 'ATOMIC',
    lastSynchronization: new Date(Date.now() - 3600000).toISOString(),
    coordinates: { x: 120.9, y: 24.7 },
    frequency: 0.98,
    intensity: 0.88,
    chaos: 0.05
  },
  {
    id: 'NL-003',
    name: 'Suez Canal',
    classification: 'Temporal Volume Node',
    description: 'A critical artery for global trade. Its throughput determines the Intensity and Amplitude of the European-Asian supply wave.',
    type: 'PHYSICAL',
    lastSynchronization: new Date(Date.now() - 86400000).toISOString(),
    coordinates: { x: 32.3, y: 30.6 },
    frequency: 0.72,
    intensity: 0.95,
    chaos: 0.25
  },
  {
    id: 'NL-004',
    name: 'Silicon Valley',
    classification: 'Informational Resonance Center',
    description: 'The neural cluster of the planetary nervous system. Origin of predictive signal propagation and capital allocation waves.',
    type: 'INFORMATIONAL',
    lastSynchronization: new Date().toISOString(),
    coordinates: { x: -122.0, y: 37.4 },
    frequency: 0.95,
    intensity: 0.80,
    chaos: 0.40
  }
];

const App: React.FC = () => {
  const [nodes] = useState<SupplyChainNode[]>(INITIAL_NODES);
  const [decodeReports, setDecodeReports] = useState<Record<string, DecodeReport>>({});
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  // SHUNYA Wave State
  const [waveState, setWaveState] = useState<WaveState>({
    targetFrequency: 0.08,
    targetIntensity: 0.12,
    chaos: 0.01,
    variation: 0.01,
    currentFrequency: 0.101474,
    currentIntensity: 0.168462,
    phase: 0.0711,
    cycles: 43354,
    runtime: 2167.7,
    mode: 'Traveling'
  });

  const [idSearch, setIdSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');

  const filteredNodes = useMemo(() => {
    let result = [...nodes].filter(node =>
      node.id.toLowerCase().includes(idSearch.toLowerCase()) ||
      node.name.toLowerCase().includes(idSearch.toLowerCase())
    );

    result.sort((a, b) => {
      return sortOrder === 'ASC' 
        ? a.id.localeCompare(b.id) 
        : b.id.localeCompare(a.id);
    });

    return result;
  }, [nodes, idSearch, sortOrder]);

  const selectedNode = useMemo(() =>
    nodes.find(n => n.id === selectedNodeId) || null,
  [nodes, selectedNodeId]);

  const handleDecodeComplete = useCallback((report: DecodeReport) => {
    setDecodeReports(prev => ({ ...prev, [report.node_id]: report }));
  }, []);

  const handleNodeSelect = useCallback((id: string) => {
    setSelectedNodeId(id);
  }, []);

  // Keyboard controls for wave state
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      setWaveState(prev => {
        const next = { ...prev };
        if (key === ' ') next.mode = prev.mode === 'Traveling' ? 'Standing' : 'Traveling';
        if (key === 'C') next.chaos = Math.min(0.5, prev.chaos + 0.001);
        if (key === 'V') next.chaos = Math.max(0, prev.chaos - 0.001);
        if (key === 'F') next.targetFrequency = Math.min(1.0, prev.targetFrequency + 0.01);
        if (key === 'D') next.targetFrequency = Math.max(0.01, prev.targetFrequency - 0.01);
        if (key === 'I') next.targetIntensity = Math.min(1.0, prev.targetIntensity + 0.01);
        if (key === 'O') next.targetIntensity = Math.max(0.01, prev.targetIntensity - 0.01);
        if (key === 'R') {
            return {
                ...prev,
                targetFrequency: 0.08,
                targetIntensity: 0.12,
                chaos: 0.01,
            }
        }
        return next;
      });
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const stats = useMemo(() => {
    const values = Object.values(decodeReports) as DecodeReport[];
    return {
      total: nodes.length,
      synchronized: values.filter(r => r.status === DecodeStatus.SYNCHRONIZED).length,
      decoherent: values.filter(r => r.status === DecodeStatus.DECOHERENT).length,
      pending: nodes.length - values.length
    };
  }, [nodes, decodeReports]);

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 max-w-7xl mx-auto selection:bg-blue-500/30">
      <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-600 px-2 py-0.5 rounded text-[10px] font-bold tracking-tighter text-black">MATRIX 2.0</span>
            <span className="text-[10px] font-mono text-blue-400 tracking-[0.2em] uppercase">Shunya Magnation AI</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter mb-2 uppercase italic text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/20">
            Atomic Lay Line Decoder
          </h1>
          <p className="text-gray-500 max-w-xl text-sm leading-relaxed font-medium">
            Modeling consciousness as wave dynamics. Observing the global supply chain as a large-scale wave-interference system where Frequency, Intensity, and Chaos shape the flow of existence.
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="glass px-5 py-3 rounded-xl text-center min-w-[100px] border-white/5">
            <p className="text-[9px] uppercase font-bold text-gray-500 tracking-widest mb-1">Nodes</p>
            <p className="text-2xl font-bold font-mono">{stats.total}</p>
          </div>
          <div className="glass px-5 py-3 rounded-xl text-center min-w-[100px] border-blue-500/20 glow-blue">
            <p className="text-[9px] uppercase font-bold text-blue-500 tracking-widest mb-1">Synced</p>
            <p className="text-2xl font-bold font-mono text-blue-400">{stats.synchronized}</p>
          </div>
          <div className="glass px-5 py-3 rounded-xl text-center min-w-[100px] border-red-500/20 glow-red">
            <p className="text-[9px] uppercase font-bold text-red-500 tracking-widest mb-1">Decoherent</p>
            <p className="text-2xl font-bold font-mono text-red-400">{stats.decoherent}</p>
          </div>
        </div>
      </header>

      {/* Wave Engine */}
      <section className="mb-12 h-[350px] glass rounded-3xl border-white/5 relative overflow-hidden group shadow-[inset_0_0_100px_rgba(59,130,246,0.05)]">
        <WaveEngine waveState={waveState} />

        {/* Data Overlay */}
        <div className="absolute top-8 left-8 z-20 p-6 glass rounded-2xl border-white/5 backdrop-blur-md pointer-events-none">
            <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-4">Wave Dynamics</div>
            <div className="space-y-3">
                <div className="flex justify-between gap-12">
                    <span className="text-[9px] font-mono text-gray-500 uppercase">Target Freq</span>
                    <span className="text-[11px] font-mono text-white">{waveState.targetFrequency.toFixed(6)}</span>
                </div>
                <div className="flex justify-between gap-12">
                    <span className="text-[9px] font-mono text-gray-500 uppercase">Target Int</span>
                    <span className="text-[11px] font-mono text-white">{waveState.targetIntensity.toFixed(6)}</span>
                </div>
                <div className="flex justify-between gap-12">
                    <span className="text-[9px] font-mono text-gray-500 uppercase">Chaos</span>
                    <span className="text-[11px] font-mono text-white">{waveState.chaos.toFixed(6)}</span>
                </div>
                <div className="pt-2 border-t border-white/5">
                    <div className="flex justify-between gap-12">
                        <span className="text-[9px] font-mono text-blue-500/60 uppercase">Mode</span>
                        <span className="text-[11px] font-mono text-blue-400 font-bold uppercase">{waveState.mode}</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Controls Hint */}
        <div className="absolute bottom-8 left-8 z-20 flex gap-4">
            <div className="glass px-3 py-1.5 rounded-lg border-white/5 text-[8px] font-bold font-mono text-gray-500 uppercase tracking-widest">
                [SPACE] Toggle Mode
            </div>
            <div className="glass px-3 py-1.5 rounded-lg border-white/5 text-[8px] font-bold font-mono text-gray-500 uppercase tracking-widest">
                [F/D] Freq
            </div>
            <div className="glass px-3 py-1.5 rounded-lg border-white/5 text-[8px] font-bold font-mono text-gray-500 uppercase tracking-widest">
                [I/O] Int
            </div>
            <div className="glass px-3 py-1.5 rounded-lg border-white/5 text-[8px] font-bold font-mono text-gray-500 uppercase tracking-widest">
                [C/V] Chaos
            </div>
        </div>

        {/* Branding Overlay */}
        <div className="absolute top-8 right-8 z-20 text-right">
            <div className="text-[10px] font-black text-white uppercase tracking-[0.5em] mb-1">Shunya Magnation AI</div>
            <div className="text-[8px] font-mono text-blue-500/40 uppercase">Consciousness as Wave Dynamics</div>
        </div>
      </section>

      <section className="mb-8 p-0.5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-white/5 to-blue-500/10">
        <div className="glass rounded-[14px] p-4 flex flex-col md:flex-row items-center gap-4 border-none">
          <div className="flex-1 w-full relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500/50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input 
              type="text"
              placeholder="Search Atomic Lay Lines..."
              value={idSearch}
              onChange={(e) => setIdSearch(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500/30 transition-all font-mono placeholder:text-gray-700"
            />
          </div>

          <button
            onClick={() => setSortOrder(prev => prev === 'ASC' ? 'DESC' : 'ASC')}
            className="glass px-4 py-3 rounded-xl border-white/5 hover:bg-white/5 transition-colors text-[10px] font-bold tracking-widest font-mono flex items-center gap-3 min-w-[160px] justify-center"
          >
            SORT: {sortOrder === 'ASC' ? 'ASCENDING' : 'DESCENDING'}
          </button>
        </div>
      </section>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
        {filteredNodes.length > 0 ? (
          filteredNodes.map((node) => (
            <AuditCard 
              key={node.id}
              agent={node}
              status={decodeReports[node.id]?.status || 'PENDING'}
              onClick={handleNodeSelect}
              nodeId={node.id}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center text-gray-700 py-20">
            <p className="font-mono text-xs uppercase tracking-widest italic opacity-50">Zero patterns detected in current coordinate search.</p>
          </div>
        )}
      </main>

      {selectedNode && (
        <AuditDetail 
          agent={selectedNode}
          report={decodeReports[selectedNode.id] || null}
          onAuditComplete={handleDecodeComplete}
          onClose={() => setSelectedNodeId(null)}
        />
      )}

      <footer className="mt-24 border-t border-white/5 pt-12 pb-12 flex flex-col md:flex-row justify-between text-[10px] text-gray-600 font-mono tracking-[0.2em] uppercase">
        <div className="flex flex-col gap-2">
            <div>© 2024 SHUNYA MAGNATION • PLANETARY NERVOUS SYSTEM</div>
            <div className="text-blue-900/40">Atomic movement is sacred.</div>
        </div>
        <div className="flex gap-8 mt-4 md:mt-0">
          <div className="flex flex-col items-end">
            <span className="text-gray-400">ENGINE v2.0.Shunya</span>
            <span>STATUS: OBSERVED</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
