'use client';

import { Download, FileText, Printer, ShieldCheck } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { missionTemplates } from '@/data/missions/templates';
import { generateMissionReport } from '@/lib/mission-engine';
import { loadEvidence, loadRuns } from '@/lib/store/demo-store';

export default function SummaryPage() {
  const { runId } = useParams<{ runId: string }>();
  const run = loadRuns().find((r) => r.id === runId);
  if (!run) return <main className="shell">Run not found.</main>;
  const template = missionTemplates.find((m) => m.id === run.templateId)!;
  const evidence = loadEvidence(runId);
  const report = generateMissionReport(run, template, evidence);

  const downloadReport = () => {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${template.slug}-report-pack.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="shell space-y-4 pb-28">
      <Card className="space-y-2">
        <h1 className="text-2xl font-bold">Report pack ready</h1>
        <p>{template.title}</p>
        <p className="text-sm text-slate-300">Mission progress: {report.summary.progressLabel}</p>
        <p className="text-sm text-slate-300">Evidence secured: {report.summary.evidenceCount} items</p>
        <p className="text-sm text-slate-300">
          {report.summary.safeToPause ? 'This mission is currently safe to pause.' : 'There are still urgent actions in flight.'}
        </p>
      </Card>

      <Card className="space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-cyan-200" />
          <h2 className="font-semibold">Summary of actions taken</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Contacts logged</p>
            <p className="mt-2 text-lg font-semibold">{report.summary.contactCount}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Timeline events</p>
            <p className="mt-2 text-lg font-semibold">{report.summary.timelineCount}</p>
          </div>
        </div>
        <div className="space-y-2 text-sm text-slate-300">
          {report.nextActions.map((action) => (
            <div key={action} className="rounded-2xl border border-white/10 bg-white/5 p-3">
              {action}
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-cyan-200" />
          <h2 className="font-semibold">Report actions</h2>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Button onClick={downloadReport}>
            <Download className="mr-2 h-4 w-4" />
            Download JSON pack
          </Button>
          <Button className="bg-slate-700" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Print summary
          </Button>
        </div>
      </Card>

      <Card>
        <h2 className="mb-2 font-semibold">Structured summary</h2>
        <pre className="overflow-x-auto text-xs text-slate-200">
{JSON.stringify(report, null, 2)}
        </pre>
      </Card>
    </main>
  );
}
