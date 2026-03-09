'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { createMissionRun, getMissionTemplate } from '@/lib/mission-engine';
import { demoUser, saveRun } from '@/lib/store/demo-store';

export default function LaunchMissionPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const template = getMissionTemplate(params.slug);

  useEffect(() => {
    if (!template) {
      router.replace('/home');
      return;
    }

    const run = createMissionRun(demoUser.id, template);
    saveRun(run);
    router.replace(`/runs/${run.id}`);
  }, [router, template]);

  return (
    <main className="shell flex min-h-screen items-center">
      <Card className="w-full space-y-3 text-center">
        <p className="text-sm text-cyan-200">Preparing mission…</p>
        <h1 className="text-2xl font-semibold">{template ? template.title : 'Mission'}</h1>
        <p className="text-sm text-slate-300">Loading the next move, evidence prompts, and timeline tools for this boss fight.</p>
      </Card>
    </main>
  );
}
