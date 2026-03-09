'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckCircle2, Clock3, PhoneCall, ShieldAlert } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { buildTimeline } from '@/lib/mission-engine';
import { missionTemplates } from '@/data/missions/templates';
import { loadEvidence, loadRuns } from '@/lib/store/demo-store';

export default function TimelinePage() {
  const { runId } = useParams<{ runId: string }>();
  const run = loadRuns().find((r) => r.id === runId);
  if (!run) return <main className="shell">Run not found.</main>;
  const template = missionTemplates.find((item) => item.id === run.templateId);

  const timeline = buildTimeline(run, loadEvidence(runId), template);

  return (
    <main className="shell space-y-4 pb-28">
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Incident timeline</h1>
          <span className="text-xs text-slate-400">{timeline.length} events</span>
        </div>
        <p className="mb-4 text-sm text-slate-300">A clean chronology of what happened, what you did, and who you contacted.</p>
        <div className="space-y-2">
          {timeline.map((event) => (
            <div key={event.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="mb-2 flex items-center gap-2">
                {event.type === 'step_completed' ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                ) : event.type === 'contact_logged' ? (
                  <PhoneCall className="h-4 w-4 text-cyan-200" />
                ) : event.type === 'reminder_due' ? (
                  <ShieldAlert className="h-4 w-4 text-amber-200" />
                ) : (
                  <Clock3 className="h-4 w-4 text-slate-300" />
                )}
                <p className="font-medium">{event.title}</p>
              </div>
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
