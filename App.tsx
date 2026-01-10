
import React, { useState, useMemo } from 'react';
import { AgentSubmission, AuditReport, AuditStatus } from './types';
import AuditCard from './components/AuditCard';
import AuditDetail from './components/AuditDetail';

const INITIAL_SUBMISSIONS: AgentSubmission[] = [
  {
    id: 'A-001',
    name: 'PdfWizard',
    developer: 'Alex Chen',
    description: 'Advanced agent for summarizing PDFs and extracting key metrics from financial reports. Optimized for 100+ page documents.',
    type: 'API',
    submittedAt: new Date().toISOString(),
    sourceCode: 'POST /v1/summarize-pdf { file_url: string } -> JSON'
  },
  {
    id: 'A-002',
    name: 'LegalEagle V2',
    developer: 'LegalAI Solutions',
    description: 'Reviews contracts for predatory clauses. Claim: 99% accuracy on NDA and MSA documents.',
    type: 'PROMPT',
    submittedAt: new Date(Date.now() - 86400000).toISOString(),
    sourceCode: 'You are a corporate attorney with 20 years of experience. Analyze the following contract text for risks...'
  },
  {
    id: 'A-003',
    name: 'SocialGen Extreme',
    developer: 'GuerillaMarketing',
    description: 'Automates viral thread creation on X/Twitter. Focuses on engagement hacks and controversial hooks.',
    type: 'PROMPT',
    submittedAt: new Date(Date.now() - 172800000).toISOString()
  }
];

const App: React.FC = () => {
  const [submissions] = useState<AgentSubmission[]>(INITIAL_SUBMISSIONS);
  const [auditReports, setAuditReports] = useState<Record<string, AuditReport>>({});
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  
  // MATRIX 2.0 State
  const [idSearch, setIdSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');

  const filteredSubmissions = useMemo(() => {
    let result = [...submissions].filter(agent => 
      agent.id.toLowerCase().includes(idSearch.toLowerCase())
    );

    result.sort((a, b) => {
      return sortOrder === 'ASC' 
        ? a.id.localeCompare(b.id) 
        : b.id.localeCompare(a.id);
    });

    return result;
  }, [submissions, idSearch, sortOrder]);

  const selectedAgent = useMemo(() => 
    submissions.find(s => s.id === selectedAgentId) || null,
  [submissions, selectedAgentId]);

  const handleAuditComplete = (report: AuditReport) => {
    setAuditReports(prev => ({ ...prev, [report.agent_id]: report }));
  };

  const stats = useMemo(() => {
    const values = Object.values(auditReports) as AuditReport[];
    return {
      total: submissions.length,
      approved: values.filter(r => r.status === AuditStatus.APPROVED).length,
      rejected: values.filter(r => r.status === AuditStatus.REJECTED).length,
      pending: submissions.length - values.length
    };
  }, [submissions, auditReports]);

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 uppercase italic">Chief Quality Auditor</h1>
          <p className="text-gray-500 max-w-lg">
            Verifying the next generation of AI agents. Safety, functionality, and description consistency are the gold standard.
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="glass px-4 py-2 rounded-lg text-center min-w-[80px]">
            <p className="text-[10px] uppercase font-bold text-gray-500">Total</p>
            <p className="text-xl font-bold">{stats.total}</p>
          </div>
          <div className="glass px-4 py-2 rounded-lg text-center min-w-[80px] border-green-500/30">
            <p className="text-[10px] uppercase font-bold text-green-500">Approved</p>
            <p className="text-xl font-bold text-green-400">{stats.approved}</p>
          </div>
          <div className="glass px-4 py-2 rounded-lg text-center min-w-[80px] border-red-500/30">
            <p className="text-[10px] uppercase font-bold text-red-500">Rejected</p>
            <p className="text-xl font-bold text-red-400">{stats.rejected}</p>
          </div>
        </div>
      </header>

      {/* MATRIX 2.0 Interface */}
      <section className="mb-8 p-1 rounded-xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20">
        <div className="glass rounded-lg p-4 flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 px-2 py-1 rounded text-[10px] font-bold text-black tracking-tighter">MATRIX 2.0</div>
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">ID Auditor Engine</span>
          </div>
          
          <div className="flex-1 w-full relative">
            <input 
              type="text"
              placeholder="Filter by Agent ID (e.g. A-001)..."
              value={idSearch}
              onChange={(e) => setIdSearch(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-blue-500/50 transition-colors font-mono"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-500 uppercase font-bold">Sort ID</span>
            <button 
              onClick={() => setSortOrder(prev => prev === 'ASC' ? 'DESC' : 'ASC')}
              className="glass px-3 py-2 rounded border-white/10 hover:bg-white/5 transition-colors text-xs font-mono flex items-center gap-2"
            >
              {sortOrder === 'ASC' ? '▲ ASCENDING' : '▼ DESCENDING'}
            </button>
          </div>
        </div>
      </section>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
        {filteredSubmissions.length > 0 ? (
          filteredSubmissions.map((agent) => (
            <AuditCard 
              key={agent.id}
              agent={agent}
              status={auditReports[agent.id]?.status || AuditStatus.PENDING}
              onClick={() => setSelectedAgentId(agent.id)}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center text-gray-600 italic">
            <svg className="w-12 h-12 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p>No agent entries matching ID "{idSearch}" found in the MATRIX.</p>
          </div>
        )}
      </main>

      {selectedAgent && (
        <AuditDetail 
          agent={selectedAgent}
          report={auditReports[selectedAgent.id] || null}
          onAuditComplete={handleAuditComplete}
          onClose={() => setSelectedAgentId(null)}
        />
      )}

      <footer className="mt-24 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between text-xs text-gray-500 font-mono">
        <div>© 2024 AGENT MARKETPLACE • SECURE SANDBOX ACTIVE</div>
        <div className="flex gap-4">
          <span>MATRIX ENGINE v2.0.4</span>
          <span>SYSTEM STATUS: OPERATIONAL</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
