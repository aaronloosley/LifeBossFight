import { missionTemplates } from '@/data/missions/templates';
import { EvidenceItem, MissionRun, MissionTemplate, TimelineEvent } from './types';

export function getMissionTemplate(slug: string): MissionTemplate | undefined {
  return missionTemplates.find((m) => m.slug === slug);
}

export function createMissionRun(userId: string, template: MissionTemplate): MissionRun {
  return {
    id: `run-${Date.now()}`,
    userId,
    templateId: template.id,
    status: 'active',
    startedAt: new Date().toISOString(),
    currentStepId: template.stepDefinitions[0]?.id ?? '',
    completedStepIds: []
  };
}

export function completeStep(run: MissionRun, stepId: string, template: MissionTemplate): MissionRun {
  const completedStepIds = Array.from(new Set([...run.completedStepIds, stepId]));
  const pending = template.stepDefinitions.find((step) => !completedStepIds.includes(step.id));

  return {
    ...run,
    completedStepIds,
    currentStepId: pending?.id ?? run.currentStepId,
    status: pending ? 'active' : 'completed',
    completedAt: pending ? undefined : new Date().toISOString()
  };
}

export function getProgress(run: MissionRun, template: MissionTemplate) {
  const total = template.stepDefinitions.length;
  const done = run.completedStepIds.length;
  return {
    done,
    total,
    percentage: total ? Math.round((done / total) * 100) : 0
  };
}

export function buildTimeline(run: MissionRun, evidence: EvidenceItem[]): TimelineEvent[] {
  const base: TimelineEvent[] = [
    {
      id: 'started',
      missionRunId: run.id,
      type: 'mission_started',
      timestamp: run.startedAt,
      title: 'Mission started',
      detail: 'You initiated this boss fight.'
    }
  ];

  return [
    ...base,
    ...evidence.map((item) => ({
      id: `ev-${item.id}`,
      missionRunId: run.id,
      type: item.type === 'contact' ? 'contact_logged' : 'evidence_added',
      timestamp: item.createdAt,
      title: `${item.type} added`,
      detail: item.title
    }))
  ].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}
