import { missionTemplates } from '@/data/missions/templates';
import { EvidenceItem, MissionReport, MissionRun, MissionStepState, MissionTemplate, Reminder, TimelineEvent } from './types';

export function getMissionTemplate(slug: string): MissionTemplate | undefined {
  return missionTemplates.find((m) => m.slug === slug);
}

function createStepStates(template: MissionTemplate): MissionStepState[] {
  return template.stepDefinitions.map((step) => ({
    id: `state-${step.id}`,
    stepDefinitionId: step.id,
    status: 'pending',
    evidenceCount: 0
  }));
}

export function createMissionRun(userId: string, template: MissionTemplate): MissionRun {
  const startedAt = new Date().toISOString();
  return {
    id: `run-${Date.now()}`,
    userId,
    templateId: template.id,
    status: 'active',
    startedAt,
    currentStepId: template.stepDefinitions[0]?.id ?? '',
    completedStepIds: [],
    stepStates: createStepStates(template),
    metadata: {
      templateSlug: template.slug,
      safeToPause: false,
      lastUpdatedAt: startedAt
    }
  };
}

export function normalizeMissionRun(run: MissionRun, template: MissionTemplate): MissionRun {
  const stepStates =
    run.stepStates?.length > 0
      ? run.stepStates
      : template.stepDefinitions.map((step) => ({
          id: `state-${step.id}`,
          stepDefinitionId: step.id,
          status: run.completedStepIds.includes(step.id) ? 'completed' : 'pending',
          completedAt: run.completedStepIds.includes(step.id) ? run.completedAt : undefined,
          evidenceCount: 0
        }));

  const currentStepId = run.currentStepId || (template.stepDefinitions.find((step) => !run.completedStepIds.includes(step.id))?.id ?? '');
  const currentStep = template.stepDefinitions.find((step) => step.id === currentStepId);

  return {
    ...run,
    currentStepId,
    stepStates,
    metadata: {
      templateSlug: run.metadata?.templateSlug ?? template.slug,
      safeToPause: currentStep ? currentStep.urgency !== 'Now' : true,
      lastUpdatedAt: run.metadata?.lastUpdatedAt ?? run.completedAt ?? run.startedAt
    }
  };
}

export function completeStep(run: MissionRun, stepId: string, template: MissionTemplate): MissionRun {
  const normalized = normalizeMissionRun(run, template);
  const completedStepIds = Array.from(new Set([...normalized.completedStepIds, stepId]));
  const pending = template.stepDefinitions.find((step) => !completedStepIds.includes(step.id));
  const now = new Date().toISOString();

  return {
    ...normalized,
    completedStepIds,
    currentStepId: pending?.id ?? stepId,
    status: pending ? 'active' : 'completed',
    completedAt: pending ? undefined : now,
    stepStates: normalized.stepStates.map((state) =>
      state.stepDefinitionId === stepId ? { ...state, status: 'completed', completedAt: now } : state
    ),
    metadata: {
      ...normalized.metadata,
      safeToPause: pending ? pending.urgency !== 'Now' : true,
      lastUpdatedAt: now
    }
  };
}

export function getProgress(run: MissionRun, template: MissionTemplate) {
  const normalized = normalizeMissionRun(run, template);
  const total = template.stepDefinitions.length;
  const done = normalized.completedStepIds.length;
  const currentStep = getCurrentStep(normalized, template);
  const requiredEvidenceOutstanding = template.stepDefinitions.filter(
    (step) => step.evidencePolicy === 'required' && !normalized.completedStepIds.includes(step.id)
  ).length;

  return {
    done,
    total,
    percentage: total ? Math.round((done / total) * 100) : 0,
    safeToPause: currentStep ? currentStep.urgency !== 'Now' : true,
    currentPhase: currentStep ? template.phases.find((phase) => phase.id === currentStep.phaseId) : undefined,
    requiredEvidenceOutstanding
  };
}

export function getCurrentStep(run: MissionRun, template: MissionTemplate) {
  return template.stepDefinitions.find((step) => step.id === run.currentStepId);
}

export function getPhaseSteps(template: MissionTemplate, phaseId: string) {
  return template.stepDefinitions.filter((step) => step.phaseId === phaseId);
}

export function getUpcomingReminders(run: MissionRun, template: MissionTemplate): Reminder[] {
  const normalized = normalizeMissionRun(run, template);
  return normalized.stepStates.flatMap((state) => {
    if (!state.completedAt) return [];
    const step = template.stepDefinitions.find((item) => item.id === state.stepDefinitionId);
    if (!step?.followUpMinutes) return [];

    const dueAt = new Date(new Date(state.completedAt).getTime() + step.followUpMinutes * 60_000).toISOString();
    return [
      {
        id: `reminder-${state.stepDefinitionId}`,
        missionRunId: normalized.id,
        relatedStepId: state.stepDefinitionId,
        dueAt,
        status: 'pending',
        reminderType: 'follow-up',
        title: `Follow up: ${step.title}`,
        detail: `Check if the response promised for "${step.title}" has happened yet.`
      }
    ];
  });
}

export function createEvidenceItem(
  input: Omit<EvidenceItem, 'id' | 'createdAt'> & Partial<Pick<EvidenceItem, 'id' | 'createdAt'>>
): EvidenceItem {
  return {
    ...input,
    id: input.id ?? `e-${Date.now()}`,
    createdAt: input.createdAt ?? new Date().toISOString()
  };
}

export function buildTimeline(run: MissionRun, evidence: EvidenceItem[], template?: MissionTemplate): TimelineEvent[] {
  const normalized = template ? normalizeMissionRun(run, template) : run;
  const base: TimelineEvent[] = [
    {
      id: 'started',
      missionRunId: normalized.id,
      type: 'mission_started',
      timestamp: normalized.startedAt,
      title: 'Mission started',
      detail: 'You initiated this boss fight.'
    }
  ];

  const stepEvents =
    template?.stepDefinitions.flatMap((step) => {
      const state = normalized.stepStates?.find((item) => item.stepDefinitionId === step.id);
      if (!state?.completedAt) return [];

      return [
        {
          id: `step-${step.id}`,
          missionRunId: normalized.id,
          type: 'step_completed' as const,
          timestamp: state.completedAt,
          title: 'Objective completed',
          detail: step.title
        }
      ];
    }) ?? [];

  const reminderEvents =
    template?.stepDefinitions.flatMap((step) => {
      const reminder = getUpcomingReminders(normalized, template).find((item) => item.relatedStepId === step.id);
      if (!reminder) return [];
      return [
        {
          id: reminder.id,
          missionRunId: normalized.id,
          type: 'reminder_due' as const,
          timestamp: reminder.dueAt,
          title: reminder.title,
          detail: reminder.detail
        }
      ];
    }) ?? [];

  const statusEvents = normalized.completedAt
    ? [
        {
          id: 'completed',
          missionRunId: normalized.id,
          type: 'status_change' as const,
          timestamp: normalized.completedAt,
          title: 'Mission complete',
          detail: 'You marked the mission complete and generated a report-ready record.'
        }
      ]
    : [];

  return [
    ...base,
    ...stepEvents,
    ...evidence.map((item) => ({
      id: `ev-${item.id}`,
      missionRunId: normalized.id,
      type: item.type === 'contact' ? 'contact_logged' : 'evidence_added',
      timestamp: item.createdAt,
      title: item.type === 'contact' ? 'Contact logged' : 'Evidence secured',
      detail: item.title,
      actor: item.userId
    })),
    ...reminderEvents,
    ...statusEvents
  ].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

export function generateMissionReport(run: MissionRun, template: MissionTemplate, evidence: EvidenceItem[]): MissionReport {
  const progress = getProgress(run, template);
  const timeline = buildTimeline(run, evidence, template);
  const currentStep = getCurrentStep(run, template);

  return {
    missionRunId: run.id,
    generatedAt: new Date().toISOString(),
    title: `${template.title} report pack`,
    summary: {
      progressLabel: `${progress.done}/${progress.total} objectives complete`,
      evidenceCount: evidence.length,
      contactCount: evidence.filter((item) => item.type === 'contact').length,
      timelineCount: timeline.length,
      safeToPause: progress.safeToPause
    },
    nextActions: currentStep
      ? [`Continue with "${currentStep.title}".`, 'Keep the timeline factual and simple.']
      : ['Share your report pack with the right person.', 'Keep receipts and follow-up notes together.'],
    timeline,
    evidence
  };
}
