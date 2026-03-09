'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { hasFirebaseConfig } from '@/lib/firebase/config';

export default function LoginPage() {
  const router = useRouter();

  return (
    <main className="shell flex min-h-screen items-center">
      <Card className="w-full space-y-6 p-6">
        <div className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Life Boss Fight</p>
          <h1 className="text-3xl font-bold">Turn chaos into calm, guided missions.</h1>
          <p className="text-sm text-slate-300">Fast support for high-stress moments. No waffle, just next moves.</p>
        </div>
        <motion.div initial={{ opacity: 0.8 }} animate={{ opacity: 1 }}>
          <Button onClick={() => router.push('/home')}>Continue with Google</Button>
        </motion.div>
        <Button className="bg-slate-700" onClick={() => router.push('/home')}>
          Try Demo
        </Button>
        {!hasFirebaseConfig && (
          <p className="rounded-lg border border-amber-300/30 bg-amber-400/10 p-2 text-xs text-amber-200">
            Firebase not configured. Demo mode is active.
          </p>
        )}
      </Card>
    </main>
  );
}
