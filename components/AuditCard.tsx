
import React from 'react';
import { AgentSubmission, AuditStatus } from '../types';

interface AuditCardProps {
  agent: AgentSubmission;
  onClick: () => void;
  status: AuditStatus;
}

const AuditCard: React.FC<AuditCardProps> = ({ agent, onClick, status }) => {
  const statusColors = {
    [AuditStatus.PENDING]: 'bg-gray-800 text-gray-400 border-gray-700',
    [AuditStatus.IN_PROGRESS]: 'bg-blue-900/30 text-blue-400 border-blue-500/50',
    [AuditStatus.APPROVED]: 'bg-green-900/30 text-green-400 border-green-500/50',
    [AuditStatus.REJECTED]: 'bg-red-900/30 text-red-400 border-red-500/50',
  };

  return (
    <div 
      onClick={onClick}
      className={`glass p-5 rounded-xl border transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${statusColors[status]}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-white">{agent.name}</h3>
          <p className="text-xs opacity-70">Dev: {agent.developer}</p>
        </div>
        <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded border border-current">
          {status}
        </span>
      </div>
      <p className="text-sm line-clamp-2 text-gray-300 mb-4 h-10">
        {agent.description}
      </p>
      <div className="flex items-center gap-3 text-[10px] font-mono opacity-60">
        <span>ID: {agent.id}</span>
        <span>•</span>
        <span>{agent.type}</span>
      </div>
    </div>
  );
};

export default AuditCard;
