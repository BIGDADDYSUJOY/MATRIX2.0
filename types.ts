
export enum AuditStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface AgentSubmission {
  id: string;
  name: string;
  developer: string;
  description: string;
  type: 'PROMPT' | 'API';
  submittedAt: string;
  sourceCode?: string;
}

export interface AuditReport {
  agent_id: string;
  status: AuditStatus;
  reasoning: string;
  security_score: number;
  functionality_score: number;
  testCases: TestCaseResult[];
}

export interface TestCaseResult {
  name: string;
  prompt: string;
  output: string;
  status: 'PASS' | 'FAIL';
}
