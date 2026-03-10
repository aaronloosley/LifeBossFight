import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { User } from 'firebase/auth';

export interface UserProfile {
  name: string;
  email: string;
  photoUrl: string | null;
  createdAt: unknown;
  updatedAt: unknown;
}

export async function upsertUserProfile(user: User): Promise<void> {
  if (!db) return;

  const ref = doc(db, 'users', user.uid);
  const snapshot = await getDoc(ref);

  if (snapshot.exists()) {
    await setDoc(
      ref,
      {
        name: user.displayName ?? '',
        email: user.email ?? '',
        photoUrl: user.photoURL ?? null,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );
  } else {
    await setDoc(ref, {
      name: user.displayName ?? '',
      email: user.email ?? '',
      photoUrl: user.photoURL ?? null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!db) return null;
  const ref = doc(db, 'users', uid);
  const snapshot = await getDoc(ref);
  return snapshot.exists() ? (snapshot.data() as UserProfile) : null;
}
