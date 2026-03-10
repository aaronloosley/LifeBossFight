import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  linkWithPopup,
  linkWithCredential,
  EmailAuthProvider,
  onAuthStateChanged,
  type Auth,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase/config';

export { onAuthStateChanged } from 'firebase/auth';

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/invalid-credential': 'Invalid email or password.',
  'auth/user-not-found': 'No account found with this email.',
  'auth/wrong-password': 'Incorrect password.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/popup-closed-by-user': 'Sign-in popup was closed.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/account-exists-with-different-credential':
    'An account already exists with a different sign-in method.',
  'auth/credential-already-in-use':
    'This credential is already linked to another account.',
};

export function mapAuthError(error: unknown): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'string'
  ) {
    const code = (error as { code: string }).code;
    return AUTH_ERROR_MESSAGES[code] ?? 'Something went wrong. Please try again.';
  }
  return 'Something went wrong. Please try again.';
}

function ensureAuth(): Auth {
  if (!auth) {
    throw new Error(
      'Firebase Auth is not initialized. Ensure Firebase is properly configured in @/lib/firebase/config.',
    );
  }
  return auth;
}

export async function registerWithEmail(email: string, password: string) {
  const firebaseAuth = ensureAuth();
  const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
  await sendEmailVerification(credential.user);
  return credential;
}

export async function loginWithEmail(email: string, password: string) {
  const firebaseAuth = ensureAuth();
  return signInWithEmailAndPassword(firebaseAuth, email, password);
}

export async function loginWithGoogle() {
  const firebaseAuth = ensureAuth();
  return signInWithPopup(firebaseAuth, googleProvider);
}

export async function resetPassword(email: string) {
  const firebaseAuth = ensureAuth();
  return sendPasswordResetEmail(firebaseAuth, email);
}

export async function logout() {
  const firebaseAuth = ensureAuth();
  return signOut(firebaseAuth);
}

export async function linkGoogleAccount() {
  const firebaseAuth = ensureAuth();
  const currentUser = firebaseAuth.currentUser;
  if (!currentUser) {
    throw new Error('No authenticated user to link.');
  }
  return linkWithPopup(currentUser, googleProvider);
}

export async function linkEmailAccount(email: string, password: string) {
  const firebaseAuth = ensureAuth();
  const currentUser = firebaseAuth.currentUser;
  if (!currentUser) {
    throw new Error('No authenticated user to link.');
  }
  const credential = EmailAuthProvider.credential(email, password);
  return linkWithCredential(currentUser, credential);
}
