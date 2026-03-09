'use client';

import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { missionTemplates } from '@/data/missions/templates';
import { getProgress } from '@/lib/mission-engine';
import { loadEvidence, loadRuns } from '@/lib/store/demo-store';

export default function SummaryPage() {
  const { runId } = useParams<{ runId: string }>();
  const run = loadRuns().find((r) => r.id === runId);
  if (!run) return <main className="shell">Run not found.</main>;
  const template = missionTemplates.find((m) => m.id === run.templateId)!;
  const evidence = loadEvidence(runId);
  const progress = getProgress(run, template);

  return (
    <main className="shell space-y-4">
      <Card className="space-y-2">
        <h1 className="text-2xl font-bold">Report pack ready</h1>
        <p>{template.title}</p>
        <p className="text-sm text-slate-300">Mission progress: {progress.done + '/' + progress.total}</p>
        <p className="text-sm text-slate-300">Evidence secured: {evidence.length} items</p>
      </Card>
      <Card>
        <h2 className="mb-2 font-semibold">Structured summary</h2>
        <pre className="overflow-x-auto text-xs text-slate-200">
{JSON.stringify(
  {
    run,
    template: { slug: template.slug, title: template.title },
    evidence
  },
  null,
  2
)}
        </pre>
      </Card>
    </main>
  );
}
