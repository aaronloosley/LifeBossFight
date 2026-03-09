'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { demoUser, resetDemo } from '@/lib/store/demo-store';

export default function SettingsPage() {
  return (
    <main className="shell space-y-4">
      <Card className="space-y-2">
        <h1 className="text-xl font-semibold">Profile & settings</h1>
        <p>{demoUser.name}</p>
        <p className="text-sm text-slate-300">{demoUser.email}</p>
      </Card>
      <Button
        className="bg-slate-700"
        onClick={() => {
          resetDemo();
          location.href = '/home';
        }}
      >
        Reset demo data
      </Button>
    </main>
  );
}
