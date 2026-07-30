export type LanguageCode = 'en' | 'de' | 'fr' | 'es' | 'ru' | 'ja' | 'ar' | 'nl';

export type EngineMode = 'inkstechshub' | 'grok' | 'alisa' | 'gemini' | 'claude';

export type TaskStatus = 'backlog' | 'in_progress' | 'review' | 'completed';
export type TaskPriority = 'P0' | 'P1' | 'P2' | 'P3';
export type EisenhowerQuadrant = 'Do First' | 'Schedule' | 'Delegate' | 'Eliminate';

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  category: 'Infrastructure' | 'Architecture' | 'AI Sourcing' | 'Security' | 'DevOps' | 'Frontend/UI';
  status: TaskStatus;
  assignee: string;
  priority: TaskPriority;
  aiPriority?: TaskPriority;
  eisenhowerQuadrant?: EisenhowerQuadrant;
  aiContextSuggestion?: string;
  timezoneTarget?: string;
  estimatedHours: number;
  riskFactor?: 'Low' | 'Medium' | 'High' | 'Critical';
  strategicImpact?: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  city: string;
  country: string;
  timezone: string;
  offsetUTC: number; // e.g. +2 for Zurich CEST, +9 for Tokyo, -4 for NY
  status: 'Online' | 'In Deep Work' | 'In Sync' | 'Offline';
  avatarUrl?: string;
  currentTask?: string;
  languages: string[];
}

export interface BOMItem {
  component: string;
  spec: string;
  estimatedMonthlyCostUSD: number;
}

export interface ArchitectureBlueprint {
  title: string;
  summary: string;
  billOfMaterials: BOMItem[];
  terraformSnippet: string;
  architectureDiagramNodes: string[];
  complianceNotes: string;
  cloudProvider: string;
  timestamp?: string;
}

export interface EncryptedProjectPayload {
  version: string;
  projectTitle: string;
  creator: string;
  tasks: TaskItem[];
  teamMembers: TeamMember[];
  blueprint?: ArchitectureBlueprint | null;
  activeLanguage: LanguageCode;
  createdAt: string;
  expiresInDays?: number;
  encryptedHash?: string;
}

export type ActiveTab = 'console' | 'task-matrix' | 'sourcing-blueprint' | 'timezones' | 'encrypted-vault';
