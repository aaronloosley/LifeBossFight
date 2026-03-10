'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth-provider';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, sessionMode } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && sessionMode !== 'demo') {
      router.replace('/login');
    }
  }, [user, loading, sessionMode, router]);

  if (loading) {
    return (
      <main className="shell flex min-h-screen items-center justify-center">
        <p className="text-sm text-cyan-200">Loading…</p>
      </main>
    );
  }

  if (!user && sessionMode !== 'demo') {
    return null;
  }

  return <>{children}</>;
}
