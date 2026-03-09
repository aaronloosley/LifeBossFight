'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { evidenceSchema, type EvidenceInput } from '@/lib/validation/evidence';
import { demoUser, loadEvidence, saveEvidence } from '@/lib/store/demo-store';
import { useState } from 'react';

export default function EvidencePage() {
  const params = useParams<{ runId: string }>();
  const [items, setItems] = useState(loadEvidence(params.runId));
  const { register, handleSubmit, reset, formState } = useForm<EvidenceInput>({
    resolver: zodResolver(evidenceSchema),
    defaultValues: { type: 'photo' }
  });

  const onSubmit = (values: EvidenceInput) => {
    saveEvidence({
      id: `e-${Date.now()}`,
      missionRunId: params.runId,
      userId: demoUser.id,
      createdAt: new Date().toISOString(),
      ...values
    });
    setItems(loadEvidence(params.runId));
    reset({ type: 'photo', title: '', description: '' });
  };

  return (
    <main className="shell space-y-4">
      <Card className="space-y-3">
        <h1 className="text-xl font-semibold">Evidence vault</h1>
        <p className="text-sm text-slate-300">Focus on what happened, what you did, and who you contacted.</p>
        <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
          <select {...register('type')} className="w-full rounded-xl border border-white/15 bg-slate-950/60 p-3 text-sm">
            <option value="photo">Photo</option>
            <option value="note">Note</option>
            <option value="receipt">Receipt</option>
            <option value="contact">Contact log</option>
            <option value="fact">Key fact</option>
          </select>
          <Input placeholder="Title" {...register('title')} />
          <Textarea placeholder="Description (optional)" {...register('description')} />
          {formState.errors.title && <p className="text-xs text-rose-300">{formState.errors.title.message}</p>}
          <Button type="submit">Secure evidence</Button>
        </form>
      </Card>

      <Card>
        <h2 className="mb-2 font-semibold">Saved evidence</h2>
        {items.length === 0 ? (
          <p className="text-sm text-slate-300">No evidence yet. Add your first proof item now.</p>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div className="rounded-lg border border-white/10 p-2 text-sm" key={item.id}>
                <p className="font-medium">{item.title}</p>
                <p className="text-xs text-slate-400">
                  {item.type} · {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
      <Link href={`/runs/${params.runId}`}>Back to mission</Link>
    </main>
  );
}
