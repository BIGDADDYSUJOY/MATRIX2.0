
import React, { useState } from 'react';
import { AgentSubmission, AuditReport, AuditStatus } from '../types';
import { auditAgent } from '../services/geminiService';

interface AuditDetailProps {
  agent: AgentSubmission;
  report: AuditReport | null;
  onAuditComplete: (report: AuditReport) => void;
  onClose: () => void;
}

const AuditDetail: React.FC<AuditDetailProps> = ({ agent, report, onAuditComplete, onClose }) => {
  const [isAuditing, setIsAuditing] = useState(false);

  const handleStartAudit = async () => {
    setIsAuditing(true);
    try {
      const result = await auditAgent(agent);
      onAuditComplete(result);
    } catch (error) {
      console.error("Audit failed", error);
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl flex flex-col">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Auditing: {agent.name}</h2>
            <p className="text-sm text-gray-400">{agent.developer} • Submitted: {new Date(agent.submittedAt).toLocaleDateString()}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <section>
            <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-3">Agent Specs</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Description</p>
                <p className="text-sm">{agent.description}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Technical Stack</p>
                <code className="text-xs text-blue-400">{agent.type === 'PROMPT' ? 'System Instructions' : 'External REST API'}</code>
              </div>
            </div>
            {agent.sourceCode && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-1">Source Code Snippet</p>
                <pre className="text-[11px] bg-black p-3 rounded border border-white/5 overflow-x-auto mono text-green-500">
                  {agent.sourceCode}
                </pre>
              </div>
            )}
          </section>

          {report ? (
            <section className="animate-in fade-in duration-500">
              <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-4">Audit Results</h3>
              <div className={`p-6 rounded-xl border ${report.status === AuditStatus.APPROVED ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${report.status === AuditStatus.APPROVED ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}`}>
                      {report.status === AuditStatus.APPROVED ? '✓' : '✕'}
                    </div>
                    <div>
                      <p className="text-lg font-bold">Status: {report.status}</p>
                      <p className="text-sm opacity-80">Security: {report.security_score}/10 | Functionality: {report.functionality_score}/10</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-black/40 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 mb-2">Internal Reasoning</p>
                    <p className="text-sm italic">{report.reasoning}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-xs text-gray-500 font-bold">SANDBOX EXECUTION LOGS</p>
                    {report.testCases.map((tc, idx) => (
                      <div key={idx} className="bg-black/20 p-3 rounded border border-white/5">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-bold text-blue-400">{tc.name}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded ${tc.status === 'PASS' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {tc.status}
                          </span>
                        </div>
                        <p className="text-[11px] mb-1 opacity-60">Prompt: {tc.prompt}</p>
                        <p className="text-[11px] mono text-gray-300">Output: {tc.output}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-white/10 rounded-xl">
              <p className="text-gray-500 mb-6">Awaiting manual trigger for sandbox audit.</p>
              <button
                onClick={handleStartAudit}
                disabled={isAuditing}
                className={`px-8 py-3 rounded-full font-bold transition-all ${isAuditing ? 'bg-gray-700 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-200 active:scale-95'}`}
              >
                {isAuditing ? 'Auditing with Gemini Pro...' : 'Initiate Full Audit'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditDetail;
