import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Firebase configuration - user must provide their own config
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

interface FirebaseContextType {
  app: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
  storage: FirebaseStorage | null;
  user: User | null;
  loading: boolean;
  isConfigured: boolean;
  setConfig: (config: FirebaseConfig) => void;
}

const FirebaseContext = createContext<FirebaseContextType>({
  app: null,
  auth: null,
  db: null,
  storage: null,
  user: null,
  loading: true,
  isConfigured: false,
  setConfig: () => {},
});

const FIREBASE_CONFIG_KEY = 'nona_firebase_config';

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [app, setApp] = useState<FirebaseApp | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [db, setDb] = useState<Firestore | null>(null);
  const [storage, setStorage] = useState<FirebaseStorage | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);

  const initializeFirebase = (config: FirebaseConfig) => {
    try {
      const firebaseApp = initializeApp(config);
      const firebaseAuth = getAuth(firebaseApp);
      const firebaseDb = getFirestore(firebaseApp);
      const firebaseStorage = getStorage(firebaseApp);

      setApp(firebaseApp);
      setAuth(firebaseAuth);
      setDb(firebaseDb);
      setStorage(firebaseStorage);
      setIsConfigured(true);

      // Listen for auth state changes
      const unsubscribe = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Firebase initialization error:', error);
      setLoading(false);
      return null;
    }
  };

  const setConfig = (config: FirebaseConfig) => {
    localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(config));
    initializeFirebase(config);
  };

  useEffect(() => {
    // Check for stored config on mount
    const storedConfig = localStorage.getItem(FIREBASE_CONFIG_KEY);
    if (storedConfig) {
      try {
        const config = JSON.parse(storedConfig) as FirebaseConfig;
        const unsubscribe = initializeFirebase(config);
        return () => {
          if (unsubscribe) unsubscribe();
        };
      } catch {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <FirebaseContext.Provider
      value={{ app, auth, db, storage, user, loading, isConfigured, setConfig }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}

export function useAuth() {
  const { auth, user, loading } = useFirebase();
  return { auth, user, loading };
}

export function useFirestore() {
  const { db } = useFirebase();
  return db;
}

export function useStorage() {
  const { storage } = useFirebase();
  return storage;
}
