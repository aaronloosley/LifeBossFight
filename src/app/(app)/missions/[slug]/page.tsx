'use client';

import { ArrowRight, Clock3, Droplets, ShieldAlert } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { buttonStyles } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getMissionTemplate } from '@/lib/mission-engine';

export default function MissionIntroPage() {
  const params = useParams<{ slug: string }>();
  const template = getMissionTemplate(params.slug);

  if (!template) return <main className="shell">Mission not found.</main>;

  return (
    <main className="shell space-y-4 pb-28">
      <Card className="space-y-4 overflow-hidden bg-[linear-gradient(145deg,rgba(34,211,238,0.12),rgba(15,23,42,0.96))]">
        <Image alt={`${template.title} cover`} className="h-52 w-full rounded-2xl object-cover" height={380} src="/burst-pipe-cover.svg" width={760} />
        <div className="flex items-center justify-between">
          <Badge>{template.missionType}</Badge>
          <Droplets className="h-5 w-5 text-cyan-200" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{template.title}</h1>
          <p className="mt-2 text-sm text-slate-300">{template.category} · Threat level: {template.threatLevel}</p>
        </div>
        <p className="text-base">{template.summary}</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Mission pace</p>
            <p className="mt-2 flex items-center gap-2 font-medium">
              <Clock3 className="h-4 w-4 text-cyan-200" />
              About {template.estimatedMinutes} minutes
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Threat level</p>
            <p className="mt-2 flex items-center gap-2 font-medium">
              <ShieldAlert className="h-4 w-4 text-rose-200" />
              {template.threatLevel}
            </p>
          </div>
        </div>

        <div className="space-y-2 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
          <p className="text-sm font-medium">Mission phases</p>
          <div className="space-y-2 text-sm text-slate-300">
            {template.phases.map((phase, index) => (
              <div key={phase.id} className="flex gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/15 text-xs text-cyan-100">
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium text-slate-100">{phase.label}</p>
                  <p>{phase.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Link className={buttonStyles()} href={`/launch/${template.slug}`}>
          Start mission
        </Link>
        <p className="text-xs text-slate-400">You do not need to solve everything at once. Start with the safest first step.</p>
      </Card>

      <Card className="space-y-2 text-sm text-slate-300">
        <p className="font-medium text-slate-100">What this mission helps you do</p>
        <p>Stabilise the situation, secure clear evidence, log who you contacted, and leave with a report-ready timeline.</p>
        <div className="flex items-center gap-2 text-cyan-200">
          <ArrowRight className="h-4 w-4" />
          <span>Safe to pause moments are highlighted as you go.</span>
        </div>
      </Card>
    </main>
  );
}
