'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { missionTemplates } from '@/data/missions/templates';
import { loadRuns } from '@/lib/store/demo-store';

export default function HomePage() {
  const [runs, setRuns] = useState(loadRuns());

  useEffect(() => {
    setRuns(loadRuns());
  }, []);

  return (
    <main className="shell space-y-4">
      <header className="space-y-2">
        <p className="text-sm text-cyan-200">Welcome back</p>
        <h1 className="text-2xl font-bold">Choose your crisis. Start the mission.</h1>
      </header>

      <Card>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-semibold">Active Missions</h2>
          <Badge>{runs.length} active</Badge>
        </div>
        {runs.length === 0 ? (
          <p className="text-sm text-slate-300">No active missions yet. Start Burst Pipe to secure key steps fast.</p>
        ) : (
          <div className="space-y-2">
            {runs.map((run) => (
              <Link key={run.id} className="block rounded-lg border border-white/10 p-3" href={`/runs/${run.id}`}>
                Resume mission {run.id.slice(-4)}
              </Link>
            ))}
          </div>
        )}
      </Card>

      <Card className="space-y-3">
        <h2 className="font-semibold">Available Boss Fights</h2>
        {missionTemplates.map((tmpl) => (
          <div key={tmpl.id} className="rounded-xl border border-white/10 p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-medium">{tmpl.title}</p>
              <Badge className={tmpl.status === 'live' ? '' : 'border-white/20 bg-white/5 text-slate-300'}>{tmpl.status}</Badge>
            </div>
            <p className="mb-3 text-sm text-slate-300">{tmpl.summary}</p>
            {tmpl.status === 'live' ? (
              <Link href={`/missions/${tmpl.slug}`}>
                <Button>Start mission</Button>
              </Link>
            ) : (
              <Button disabled className="bg-slate-700">
                Coming soon
              </Button>
            )}
          </div>
        ))}
      </Card>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <Link href="/settings" className="glass p-3 text-center">
          Settings
        </Link>
        <div className="glass p-3 text-center">Reports</div>
      </div>
    </main>
  );
}
