'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { buildTimeline } from '@/lib/mission-engine';
import { loadEvidence, loadRuns } from '@/lib/store/demo-store';

export default function TimelinePage() {
  const { runId } = useParams<{ runId: string }>();
  const run = loadRuns().find((r) => r.id === runId);
  if (!run) return <main className="shell">Run not found.</main>;

  const timeline = buildTimeline(run, loadEvidence(runId));

  return (
    <main className="shell space-y-4">
      <Card>
        <h1 className="mb-2 text-xl font-semibold">Incident timeline</h1>
        <div className="space-y-2">
          {timeline.map((event) => (
            <div key={event.id} className="rounded-lg border border-white/10 p-3">
              <p className="font-medium">{event.title}</p>
              <p className="text-sm text-slate-300">{event.detail}</p>
              <p className="text-xs text-slate-500">{new Date(event.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </Card>
      <Link href={`/runs/${runId}`}>Back to mission</Link>
    </main>
  );
}
