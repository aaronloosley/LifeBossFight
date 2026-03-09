import { describe, expect, it } from 'vitest';
import { missionTemplates } from '@/data/missions/templates';
import { completeStep, createMissionRun, getMissionTemplate, getProgress } from '@/lib/mission-engine';

describe('mission engine', () => {
  it('loads burst pipe template from registry', () => {
    const template = getMissionTemplate('burst-pipe');
    expect(template?.title).toBe('Burst Pipe');
    expect(template?.stepDefinitions.length).toBeGreaterThan(5);
  });

  it('tracks step completion and completion status', () => {
    const template = missionTemplates[0];
    const run = createMissionRun('u1', template);
    const after = completeStep(run, template.stepDefinitions[0].id, template);
    expect(after.completedStepIds.length).toBe(1);
    expect(after.currentStepId).not.toBe(template.stepDefinitions[0].id);
  });

  it('calculates progress percentage', () => {
    const template = missionTemplates[0];
    let run = createMissionRun('u1', template);
    run = { ...run, completedStepIds: template.stepDefinitions.slice(0, 5).map((s) => s.id) };
    expect(getProgress(run, template).percentage).toBe(50);
  });
});
