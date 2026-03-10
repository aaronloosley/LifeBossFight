'use client';

import { missionTemplates } from '@/data/missions/templates';
import { normalizeMissionRun } from '@/lib/mission-engine';
import { EvidenceItem, MissionRun } from '@/lib/mission-engine/types';

const RUNS_KEY = 'lbf_runs';
const EVIDENCE_KEY = 'lbf_evidence';
const SESSION_KEY = 'lbf_session';

export const demoUser = {
  id: 'demo-user',
  name: 'Demo Operator',
  email: 'demo@lifebossfight.app',
  photoUrl: ''
};

export function loadRuns(): MissionRun[] {
  if (typeof window === 'undefined') return [];
  const rawRuns: MissionRun[] = JSON.parse(localStorage.getItem(RUNS_KEY) || '[]');
  return rawRuns.map((run) => {
    const template = missionTemplates.find((item) => item.id === run.templateId);
    return template ? normalizeMissionRun(run, template) : run;
  });
}

export function saveRun(run: MissionRun): void {
  const runs = loadRuns();
  const next = [...runs.filter((r) => r.id !== run.id), run];
  localStorage.setItem(RUNS_KEY, JSON.stringify(next));
}

export function loadEvidence(runId?: string): EvidenceItem[] {
  if (typeof window === 'undefined') return [];
  const all: EvidenceItem[] = JSON.parse(localStorage.getItem(EVIDENCE_KEY) || '[]');
  return runId ? all.filter((item) => item.missionRunId === runId) : all;
}

export function saveEvidence(item: EvidenceItem): void {
  const all = loadEvidence();
  localStorage.setItem(EVIDENCE_KEY, JSON.stringify([...all, item]));
}

export function resetDemo(): void {
  localStorage.removeItem(RUNS_KEY);
  localStorage.removeItem(EVIDENCE_KEY);
  localStorage.removeItem(SESSION_KEY);
}

export function setSession(mode: 'demo' | 'google' | 'email') {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_KEY, mode);
}

export function loadSession(): 'demo' | 'google' | 'email' | null {
  if (typeof window === 'undefined') return null;
  const session = localStorage.getItem(SESSION_KEY);
  return session === 'demo' || session === 'google' || session === 'email' ? session : null;
}
