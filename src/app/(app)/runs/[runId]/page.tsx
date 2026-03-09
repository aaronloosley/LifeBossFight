'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AlertTriangle, CheckCircle2, ChevronRight, FileText, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { completeStep, getCurrentStep, getPhaseSteps, getProgress, getUpcomingReminders } from '@/lib/mission-engine';
import { missionTemplates } from '@/data/missions/templates';
import { loadRuns, saveRun } from '@/lib/store/demo-store';
import { useMemo, useState } from 'react';

export default function MissionRunPage() {
  const params = useParams<{ runId: string }>();
  const [runs, setRuns] = useState(loadRuns());
  const run = runs.find((r) => r.id === params.runId);
  const template = useMemo(() => missionTemplates.find((m) => m.id === run?.templateId), [run]);

  if (!run || !template) return <main className="shell">Run not found.</main>;

  const currentStep = getCurrentStep(run, template);
  const progress = getProgress(run, template);
  const reminders = getUpcomingReminders(run, template).slice(0, 2);

  const onComplete = () => {
    if (!currentStep) return;
    const next = completeStep(run, currentStep.id, template);
    saveRun(next);
    setRuns(loadRuns());
  };

  return (
    <main className="shell space-y-4 pb-28">
      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">{template.title}</h1>
          <Badge>{progress.percentage}% complete</Badge>
        </div>
        <Progress value={progress.percentage} />
        <p className="text-xs text-slate-300">
          {progress.done}/{progress.total} objectives complete
        </p>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{progress.currentPhase ? `Current phase: ${progress.currentPhase.label}` : 'Mission complete'}</span>
          <span>{progress.safeToPause ? 'Safe to pause' : 'Action needed now'}</span>
        </div>
      </Card>

      {currentStep ? (
        <Card className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Badge>{currentStep.urgency} urgency</Badge>
            <Badge className={progress.safeToPause ? 'bg-emerald-500/15 text-emerald-100' : 'bg-rose-500/15 text-rose-100'}>
              {progress.safeToPause ? 'Safe to pause after this step' : 'Stay with this step'}
            </Badge>
          </div>
          <h2 className="text-lg font-semibold">Next move: {currentStep.title}</h2>
          <p>{currentStep.instruction}</p>
          <p className="text-sm text-cyan-200">Why it matters: {currentStep.whyItMatters}</p>
          {currentStep.warningText && <p className="text-sm text-amber-200">⚠ {currentStep.warningText}</p>}
          {currentStep.avoidText && <p className="text-sm text-rose-200">Avoid: {currentStep.avoidText}</p>}
          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3 text-sm text-slate-300">
            <p className="font-medium text-slate-100">Evidence prompt</p>
            <p className="mt-1">
              {currentStep.evidencePolicy === 'required'
                ? 'Capture evidence for this objective before moving on.'
                : currentStep.evidencePolicy === 'recommended'
                  ? 'Evidence is recommended here if it is safe and practical.'
                  : 'No evidence is required for this objective.'}
            </p>
          </div>
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

      {progress.currentPhase && (
        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{progress.currentPhase.label}</h2>
            <span className="text-xs text-slate-400">{progress.currentPhase.summary}</span>
          </div>
          <div className="space-y-2">
            {getPhaseSteps(template, progress.currentPhase.id).map((step) => {
              const completed = run.completedStepIds.includes(step.id);
              return (
                <div key={step.id} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                  {completed ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" />
                  ) : (
                    <ChevronRight className="mt-0.5 h-4 w-4 text-slate-400" />
                  )}
                  <div>
                    <p className="font-medium text-slate-100">{step.title}</p>
                    <p className="text-sm text-slate-300">{step.instruction}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <Card className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-200" />
          <h2 className="font-semibold">Urgent prompts</h2>
        </div>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="rounded-2xl border border-white/10 bg-white/5 p-3">What is happening: burst pipe response is active.</li>
          <li className="rounded-2xl border border-white/10 bg-white/5 p-3">What to do next: {currentStep ? currentStep.title : 'Review and export your summary.'}</li>
          <li className="rounded-2xl border border-white/10 bg-white/5 p-3">
            What evidence to keep: photos, notes, contact logs, and receipts.
          </li>
        </ul>
      </Card>

      {reminders.length > 0 && (
        <Card className="space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-cyan-200" />
            <h2 className="font-semibold">Follow-up reminders</h2>
          </div>
          {reminders.map((reminder) => (
            <div key={reminder.id} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm">
              <p className="font-medium">{reminder.title}</p>
              <p className="mt-1 text-slate-300">{reminder.detail}</p>
              <p className="mt-2 text-xs text-slate-400">Due {new Date(reminder.dueAt).toLocaleString()}</p>
            </div>
          ))}
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
          <span className="inline-flex items-center gap-1">
            <FileText className="h-3.5 w-3.5" />
            Report
          </span>
        </Link>
      </div>
    </main>
  );
}
