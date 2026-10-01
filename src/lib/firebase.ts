import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  getDocs,
  getDocFromServer,
  Firestore,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import firebaseConfigJson from '../../firebase-applet-config.json';

const env = (import.meta as unknown as { env?: Record<string, string> }).env || {};

interface FirebaseAppletConfig {
  projectId: string;
  appId: string;
  apiKey: string;
  authDomain: string;
  firestoreDatabaseId?: string;
  storageBucket: string;
  messagingSenderId: string;
  measurementId?: string;
  oAuthClientId?: string;
  recaptchaSiteKey?: string;
}

const cfgJson: FirebaseAppletConfig = firebaseConfigJson as FirebaseAppletConfig;

function resolveConfig() {
  let apiKey = cfgJson.apiKey || '';
  let authDomain = cfgJson.authDomain || '';

  const envApiKey = typeof env.VITE_FIREBASE_API_KEY === 'string' ? env.VITE_FIREBASE_API_KEY.trim() : '';
  const envAuthDomain = typeof env.VITE_FIREBASE_AUTH_DOMAIN === 'string' ? env.VITE_FIREBASE_AUTH_DOMAIN.trim() : '';

  // Detect and correct swapped or misconfigured environment variables
  if (envApiKey.startsWith('AIza')) {
    apiKey = envApiKey;
  } else if (envAuthDomain.startsWith('AIza')) {
    apiKey = envAuthDomain;
  }

  if (envAuthDomain.includes('.firebaseapp.com') || envAuthDomain.includes('.web.app')) {
    authDomain = envAuthDomain;
  } else if (envApiKey.includes('.firebaseapp.com') || envApiKey.includes('.web.app')) {
    authDomain = envApiKey;
  }

  // Ensure apiKey and authDomain always fall back to provisioned credentials
  if (!apiKey || !apiKey.startsWith('AIza')) {
    apiKey = cfgJson.apiKey || 'AIzaSyDg5ZwU7PWC3wBaEfSCqDY-kukJqph6il0';
  }
  if (!authDomain || !authDomain.includes('.')) {
    authDomain = cfgJson.authDomain || 'gen-lang-client-0741191357.firebaseapp.com';
  }

  return {
    apiKey,
    authDomain,
    projectId: env.VITE_FIREBASE_PROJECT_ID || cfgJson.projectId || 'gen-lang-client-0741191357',
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || cfgJson.storageBucket || 'gen-lang-client-0741191357.firebasestorage.app',
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || cfgJson.messagingSenderId || '249850278683',
    appId: env.VITE_FIREBASE_APP_ID || cfgJson.appId || '1:249850278683:web:5827b9deaa795d8e94d9be',
  };
}

export const firebaseConfig = resolveConfig();

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Custom database ID support from config
const firestoreDbId = firebaseConfigJson.firestoreDatabaseId;
export const db: Firestore = firestoreDbId && firestoreDbId !== '(default)'
  ? getFirestore(app, firestoreDbId)
  : getFirestore(app);

export const storage = getStorage(app);

// Connectivity health-check per Firebase Skill requirement
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client operating in offline mode or waiting for backend handshake.');
    }
    return false;
  }
}

// Initial bootstrap test deferred to prevent blocking app startup
if (typeof window !== 'undefined') {
  setTimeout(() => {
    testFirestoreConnection().catch(() => {});
  }, 1000);
}

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  getDocs,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
};
export type { FirebaseUser };
