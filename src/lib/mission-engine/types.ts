export type ThreatLevel = 'Low' | 'Medium' | 'High';
export type StepUrgency = 'Now' | 'Soon' | 'Later';

export interface MissionStepDefinition {
  id: string;
  phaseId: string;
  title: string;
  instruction: string;
  whyItMatters: string;
  urgency: StepUrgency;
  warningText?: string;
  avoidText?: string;
  evidencePolicy: 'none' | 'recommended' | 'required';
  completionType: 'check' | 'note' | 'contact-log' | 'evidence';
  followUpMinutes?: number;
}

export interface MissionPhase {
  id: string;
  label: string;
  summary: string;
}

export interface MissionTemplate {
  id: string;
  slug: string;
  title: string;
  category: string;
  threatLevel: ThreatLevel;
  missionType: string;
  summary: string;
  estimatedMinutes: number;
  status: 'live' | 'coming-soon';
  active: boolean;
  cover: { icon: string; gradient: string };
  phases: MissionPhase[];
  stepDefinitions: MissionStepDefinition[];
  reportConfig: {
    includeEvidence: boolean;
    includeTimeline: boolean;
    includeContacts: boolean;
  };
}

export interface MissionRun {
  id: string;
  userId: string;
  templateId: string;
  status: 'active' | 'paused' | 'completed';
  startedAt: string;
  completedAt?: string;
  currentStepId: string;
  completedStepIds: string[];
}

export interface EvidenceItem {
  id: string;
  missionRunId: string;
  userId: string;
  type: 'photo' | 'note' | 'receipt' | 'contact' | 'fact';
  title: string;
  description?: string;
  createdAt: string;
  linkedStepId?: string;
  storagePath?: string;
  tags?: string[];
}

export interface TimelineEvent {
  id: string;
  missionRunId: string;
  type: 'mission_started' | 'step_completed' | 'evidence_added' | 'contact_logged' | 'status_change';
  timestamp: string;
  title: string;
  detail: string;
}
