'use client';

import { useRouter, useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createMissionRun, getMissionTemplate } from '@/lib/mission-engine';
import { demoUser, saveRun } from '@/lib/store/demo-store';

export default function MissionIntroPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const template = getMissionTemplate(params.slug);

  if (!template) return <main className="shell">Mission not found.</main>;

  const start = () => {
    const run = createMissionRun(demoUser.id, template);
    saveRun(run);
    router.push(`/runs/${run.id}`);
  };

  return (
    <main className="shell space-y-4">
      <Card className="space-y-3">
        <Badge>{template.missionType}</Badge>
        <h1 className="text-3xl font-bold">{template.title}</h1>
        <p className="text-sm text-slate-300">Threat level: {template.threatLevel}</p>
        <p className="text-base">{template.summary}</p>
        <Button onClick={start}>Start mission</Button>
        <p className="text-xs text-slate-400">You do not need to solve everything at once. Start with the safest first step.</p>
      </Card>
    </main>
  );
}
