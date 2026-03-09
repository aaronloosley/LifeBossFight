'use client';

import { EvidenceItem, MissionRun } from '@/lib/mission-engine/types';

const RUNS_KEY = 'lbf_runs';
const EVIDENCE_KEY = 'lbf_evidence';

export const demoUser = {
  id: 'demo-user',
  name: 'Demo Operator',
  email: 'demo@lifebossfight.app'
};

export function loadRuns(): MissionRun[] {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem(RUNS_KEY) || '[]');
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
}
