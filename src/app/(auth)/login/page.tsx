'use client';

import { AlertTriangle, ArrowRight, ShieldCheck, Waves } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { auth, googleProvider, hasFirebaseConfig } from '@/lib/firebase/config';
import { setSession } from '@/lib/store/demo-store';
import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const continueToHome = (mode: 'demo' | 'google') => {
    setSession(mode);
    router.push('/home');
  };

  const signInWithGoogle = async () => {
    setBusy(true);
    setError(null);

    try {
      if (auth && hasFirebaseConfig) {
        await signInWithPopup(auth, googleProvider);
        continueToHome('google');
      } else {
        continueToHome('demo');
      }
    } catch {
      setError('Google sign-in was unavailable. You can still continue in demo mode right now.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="shell flex min-h-screen items-center py-8">
      <Card className="w-full space-y-6 overflow-hidden p-0">
        <div className="space-y-5 rounded-[1.75rem] bg-[radial-gradient(circle_at_top,_rgba(103,232,249,0.18),_transparent_35%),linear-gradient(180deg,rgba(8,23,50,0.95),rgba(10,17,30,0.98))] p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-200">Life Boss Fight</p>
              <h1 className="text-3xl font-bold leading-tight">Turn chaos into calm, guided missions.</h1>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-cyan-200">
              <Waves className="h-6 w-6" />
            </div>
          </div>

          <div className="grid gap-3 text-sm text-slate-200">
            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-cyan-200" />
              <p>Calm, step-by-step incident support with evidence capture, timelines, and report packs.</p>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-200" />
              <p>No waffle. Just the safest next move, what to keep, and what can wait.</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-6 pt-0">
          <div className="flex items-center justify-between">
            <Badge className="bg-rose-500/15 text-rose-100">Burst Pipe ready</Badge>
            <p className="text-xs text-slate-400">Mobile-first MVP</p>
          </div>

          <motion.div initial={{ opacity: 0.8, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            <Button disabled={busy} onClick={signInWithGoogle}>
              {busy ? 'Connecting…' : 'Continue with Google'}
            </Button>
          </motion.div>

          <Button className="bg-slate-700" onClick={() => continueToHome('demo')}>
            Try Demo
          </Button>

          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-sm text-slate-300">
            <p className="font-medium text-slate-100">Start fast</p>
            <p className="mt-1">You’ll see the mission library immediately. No long onboarding before the app becomes useful.</p>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{hasFirebaseConfig ? 'Firebase ready' : 'Firebase optional in demo mode'}</span>
            <ArrowRight className="h-4 w-4" />
          </div>

          {(error || !hasFirebaseConfig) && (
            <p className="rounded-lg border border-amber-300/30 bg-amber-400/10 p-2 text-xs text-amber-200">
              {error ?? 'Firebase not configured. Demo mode is active.'}
            </p>
          )}
        </div>
      </Card>
    </main>
  );
}
