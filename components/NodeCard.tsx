
import React from 'react';
import { SupplyChainNode, DecodeStatus } from '../types';

interface NodeCardProps {
  agent: SupplyChainNode;
  onClick: () => void;
  status: DecodeStatus | 'PENDING';
}

const NodeCard: React.FC<NodeCardProps> = ({ agent, onClick, status }) => {
  const statusColors = {
    ['PENDING']: 'bg-zinc-900/50 text-zinc-500 border-white/5',
    [DecodeStatus.SYNCHRONIZED]: 'bg-blue-900/10 text-blue-400 border-blue-500/30 glow-blue',
    [DecodeStatus.DECOHERENT]: 'bg-red-900/10 text-red-400 border-red-500/30 glow-red',
    [DecodeStatus.STABLE]: 'bg-emerald-900/10 text-emerald-400 border-emerald-500/30',
    [DecodeStatus.UNSTABLE]: 'bg-orange-900/10 text-orange-400 border-orange-500/30',
  };

  return (
    <div 
      onClick={onClick}
      className={`glass p-6 rounded-2xl border transition-all cursor-pointer hover:border-white/20 group relative overflow-hidden ${statusColors[status]}`}
    >
      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-30 transition-opacity">
        <div className="w-12 h-12 border-t border-r border-current rounded-tr-lg"></div>
      </div>

      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-[10px] font-mono opacity-50 uppercase tracking-widest mb-1">{agent.classification}</div>
          <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">{agent.name}</h3>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[9px] uppercase tracking-[0.2em] font-black px-2 py-1 rounded border border-current mb-2">
            {status}
          </span>
          <span className="text-[9px] font-mono opacity-40 uppercase">{agent.type}</span>
        </div>
      </div>

      <p className="text-sm line-clamp-3 text-gray-400 mb-6 font-medium leading-relaxed">
        {agent.description}
      </p>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-black/40 p-2 rounded-lg border border-white/5 text-center">
            <p className="text-[8px] uppercase text-gray-600 font-bold mb-1">Freq</p>
            <p className="text-xs font-mono">{(agent.frequency * 100).toFixed(0)}%</p>
        </div>
        <div className="bg-black/40 p-2 rounded-lg border border-white/5 text-center">
            <p className="text-[8px] uppercase text-gray-600 font-bold mb-1">Int</p>
            <p className="text-xs font-mono">{(agent.intensity * 100).toFixed(0)}%</p>
        </div>
        <div className="bg-black/40 p-2 rounded-lg border border-white/5 text-center">
            <p className="text-[8px] uppercase text-gray-600 font-bold mb-1">Chaos</p>
            <p className="text-xs font-mono">{(agent.chaos * 100).toFixed(0)}%</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
        <span className="text-[9px] font-mono text-gray-600">ID: {agent.id}</span>
        <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full bg-blue-500/50 animate-pulse"></div>
            <div className="w-1 h-1 rounded-full bg-blue-500/50 animate-pulse delay-75"></div>
            <div className="w-1 h-1 rounded-full bg-blue-500/50 animate-pulse delay-150"></div>
        </div>
      </div>
    </div>
  );
};

export default NodeCard;
