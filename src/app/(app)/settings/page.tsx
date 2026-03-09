'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { clearDeviceAttachments } from '@/lib/store/local-attachments';
import { demoUser, loadSession, resetDemo } from '@/lib/store/demo-store';

export default function SettingsPage() {
  const session = loadSession();

  return (
    <main className="shell space-y-4 pb-28">
      <Card className="space-y-2">
        <h1 className="text-xl font-semibold">Profile & settings</h1>
        <p>{demoUser.name}</p>
        <p className="text-sm text-slate-300">{demoUser.email}</p>
        <p className="text-xs text-slate-400">Session mode: {session ?? 'demo'}</p>
      </Card>
      <Card className="space-y-2 text-sm text-slate-300">
        <p className="font-medium text-slate-100">App behavior</p>
        <p>Autosaves demo progress locally so you can resume a mission, review evidence, and export a summary later.</p>
        <p>Reset clears demo missions, evidence, and the current session mode.</p>
      </Card>
      <Button
        className="bg-slate-700"
        onClick={async () => {
          await clearDeviceAttachments();
          resetDemo();
          location.href = '/home';
        }}
      >
        Reset demo data
      </Button>
    </main>
  );
}
