'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { auth, hasFirebaseConfig } from '@/lib/firebase/config';
import { onAuthStateChanged } from '@/lib/firebase/auth';
import { loadSession, setSession } from '@/lib/store/demo-store';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  sessionMode: 'demo' | 'google' | 'email' | null;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  sessionMode: null
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionMode, setSessionMode] = useState<'demo' | 'google' | 'email' | null>(null);

  useEffect(() => {
    const storedSession = loadSession();
    if (storedSession) {
      setSessionMode(storedSession as 'demo' | 'google' | 'email');
    }

    if (auth && hasFirebaseConfig) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        if (firebaseUser) {
          const provider = firebaseUser.providerData[0]?.providerId;
          const mode = provider === 'google.com' ? 'google' : 'email';
          setSessionMode(mode);
          setSession(mode);
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, sessionMode }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
