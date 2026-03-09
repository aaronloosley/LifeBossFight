'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { setSession } from '@/lib/store/demo-store';

export default function DemoEntryPage() {
  const router = useRouter();

  useEffect(() => {
    setSession('demo');
    router.replace('/home');
  }, [router]);

  return (
    <main className="shell flex min-h-screen items-center">
      <Card className="w-full space-y-3 text-center">
        <p className="text-sm text-cyan-200">Entering demo mode…</p>
        <h1 className="text-2xl font-semibold">Life Boss Fight</h1>
        <p className="text-sm text-slate-300">Loading the mission library with local demo storage enabled.</p>
      </Card>
    </main>
  );
}
