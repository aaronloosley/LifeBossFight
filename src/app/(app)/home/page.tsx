'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Droplets, FolderOpen, ShieldEllipsis } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button, buttonStyles } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { missionTemplates } from '@/data/missions/templates';
import { getCurrentStep, getProgress } from '@/lib/mission-engine';
import { loadEvidence, loadRuns, loadSession } from '@/lib/store/demo-store';

export default function HomePage() {
  const [runs, setRuns] = useState(loadRuns());
  const [evidenceCount, setEvidenceCount] = useState(0);
  const [session, setSession] = useState<'demo' | 'google' | null>(null);

  useEffect(() => {
    setRuns(loadRuns());
    setEvidenceCount(loadEvidence().length);
    setSession(loadSession());
  }, []);

  return (
    <main className="shell space-y-4 pb-28">
      <header className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-cyan-200">Welcome back{session === 'demo' ? ', Demo Operator' : ''}</p>
          <Badge className="bg-white/5 text-slate-200">{session === 'google' ? 'Google session' : 'Demo mode'}</Badge>
        </div>
        <h1 className="text-2xl font-bold">Choose your crisis. Start the mission.</h1>
        <p className="text-sm text-slate-300">Clear next moves, evidence capture, and a report-ready timeline when things get messy fast.</p>
      </header>

      <Card className="overflow-hidden p-0">
        <div className="space-y-3 bg-[linear-gradient(135deg,rgba(14,116,144,0.25),rgba(15,23,42,0.95))] p-4">
          <Image
            alt="Burst Pipe cover"
            className="h-40 w-full rounded-2xl object-cover"
            height={300}
            priority
            src="/burst-pipe-cover.svg"
            width={600}
          />
          <Badge className="bg-rose-500/15 text-rose-100">Quick start</Badge>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Burst Pipe</h2>
              <p className="mt-1 text-sm text-slate-200">Contain the leak, capture the damage, alert the right people.</p>
            </div>
            <Droplets className="h-6 w-6 text-cyan-200" />
          </div>
          <Link className={buttonStyles()} href="/missions/burst-pipe">
            Start a new Boss Fight
          </Link>
        </div>
      </Card>

      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Active Missions</h2>
          <Badge>{runs.length} active</Badge>
        </div>
        {runs.length === 0 ? (
          <p className="text-sm text-slate-300">No active missions yet. Start Burst Pipe to secure the critical first steps fast.</p>
        ) : (
          <div className="space-y-3">
            {runs.map((run) => {
              const template = missionTemplates.find((item) => item.id === run.templateId);
              if (!template) return null;
              const progress = getProgress(run, template);
              const currentStep = getCurrentStep(run, template);

              return (
                <Link key={run.id} className="block rounded-2xl border border-white/10 bg-white/5 p-4" href={`/runs/${run.id}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{template.title}</p>
                      <p className="mt-1 text-sm text-slate-300">{currentStep ? `Next move: ${currentStep.title}` : 'Mission complete'}</p>
                    </div>
                    <Badge>{progress.percentage}%</Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                    <span>{progress.done}/{progress.total} objectives</span>
                    <span>{progress.safeToPause ? 'Safe to pause' : 'Urgent now'}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Card>

      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Available Boss Fights</h2>
          <span className="text-xs text-slate-400">Mission library</span>
        </div>
        {missionTemplates.map((tmpl) => (
          <div key={tmpl.id} className="rounded-2xl border border-white/10 p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-medium">{tmpl.title}</p>
              <Badge className={tmpl.status === 'live' ? '' : 'border-white/20 bg-white/5 text-slate-300'}>{tmpl.status}</Badge>
            </div>
            <p className="mb-2 text-sm text-slate-300">{tmpl.summary}</p>
            <p className="mb-3 text-xs text-slate-400">
              {tmpl.category} · Threat {tmpl.threatLevel} · {tmpl.estimatedMinutes} min
            </p>
            {tmpl.status === 'live' ? (
              <Link className={buttonStyles()} href={`/missions/${tmpl.slug}`}>
                Start mission
              </Link>
            ) : (
              <Button disabled className="bg-slate-700">
                Coming soon
              </Button>
            )}
          </div>
        ))}
      </Card>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="glass flex items-center gap-3 p-4">
          <FolderOpen className="h-4 w-4 text-cyan-200" />
          <div>
            <p className="font-medium">Evidence & reports</p>
            <p className="text-xs text-slate-400">{evidenceCount} items secured</p>
          </div>
        </div>
        <Link href="/settings" className="glass flex items-center gap-3 p-4">
          <ShieldEllipsis className="h-4 w-4 text-cyan-200" />
          <div>
            <p className="font-medium">Settings</p>
            <p className="text-xs text-slate-400">Profile and demo reset</p>
          </div>
        </Link>
      </div>

      <div className="glass flex items-center justify-between p-4 text-sm text-slate-300">
        <p>Recent activity stays factual, timestamped, and ready for export.</p>
        <ArrowRight className="h-4 w-4 text-cyan-200" />
      </div>
    </main>
  );
}
