'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { completeStep, getMissionTemplate, getProgress } from '@/lib/mission-engine';
import { missionTemplates } from '@/data/missions/templates';
import { loadRuns, saveRun } from '@/lib/store/demo-store';
import { useMemo, useState } from 'react';

export default function MissionRunPage() {
  const params = useParams<{ runId: string }>();
  const [runs, setRuns] = useState(loadRuns());
  const run = runs.find((r) => r.id === params.runId);
  const template = useMemo(() => missionTemplates.find((m) => m.id === run?.templateId), [run]);

  if (!run || !template) return <main className="shell">Run not found.</main>;

  const currentStep = template.stepDefinitions.find((s) => s.id === run.currentStepId);
  const progress = getProgress(run, template);

  const onComplete = () => {
    if (!currentStep) return;
    const next = completeStep(run, currentStep.id, template);
    saveRun(next);
    setRuns(loadRuns());
  };

  return (
    <main className="shell space-y-4">
      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">{template.title}</h1>
          <Badge>{progress.percentage}% complete</Badge>
        </div>
        <Progress value={progress.percentage} />
        <p className="text-xs text-slate-300">
          {progress.done}/{progress.total} objectives complete
        </p>
      </Card>

      {currentStep ? (
        <Card className="space-y-3">
          <Badge>{currentStep.urgency} urgency</Badge>
          <h2 className="text-lg font-semibold">Next move: {currentStep.title}</h2>
          <p>{currentStep.instruction}</p>
          <p className="text-sm text-cyan-200">Why it matters: {currentStep.whyItMatters}</p>
          {currentStep.warningText && <p className="text-sm text-amber-200">⚠ {currentStep.warningText}</p>}
          {currentStep.avoidText && <p className="text-sm text-rose-200">Avoid: {currentStep.avoidText}</p>}
          <Button onClick={onComplete}>Mark objective complete</Button>
          <p className="text-xs text-slate-400">Keep the timeline factual and simple.</p>
        </Card>
      ) : (
        <Card className="space-y-2">
          <h2 className="text-lg font-semibold">Mission complete</h2>
          <p>You’ve completed the critical first steps. Your report pack is ready.</p>
          <Link href={`/runs/${run.id}/summary`}>
            <Button>Open summary</Button>
          </Link>
        </Card>
      )}

      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <Link href={`/runs/${run.id}/evidence`} className="glass p-3">
          Evidence
        </Link>
        <Link href={`/runs/${run.id}/timeline`} className="glass p-3">
          Timeline
        </Link>
        <Link href={`/runs/${run.id}/summary`} className="glass p-3">
          Report
        </Link>
      </div>
    </main>
  );
}
