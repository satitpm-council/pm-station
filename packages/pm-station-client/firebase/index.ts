import type { FirebaseApp, FirebaseError, FirebaseOptions } from "firebase/app";
import { initializeApp } from "firebase/app";
import type { Auth, User } from "firebase/auth";
import { onIdTokenChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getFirebaseConfig } from "./config";

type FirebaseStore = {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
};

let firebaseStore: FirebaseStore;

const fallbackConfig = getFirebaseConfig();

export const useFirebase = (initialConfig?: FirebaseOptions): FirebaseStore => {
  if (firebaseStore) {
    return firebaseStore;
  }

  if (initialConfig ?? fallbackConfig) {
    const app = initializeApp(
      (initialConfig ?? fallbackConfig) as FirebaseOptions
    );
    const auth = getAuth(app);
    const db = getFirestore(app);
    auth.languageCode = "th";
    const store: FirebaseStore = { app, auth, db };
    firebaseStore = store;
    return store;
  }
  throw new Error(
    "Attempt to access the firebase instance, but wasn't initialized properly."
  );
};

export const useFirebaseUser = () => {
  const { auth } = useFirebase();
  const [user, setUser] = useState<User | null | undefined>();
  useEffect(() => onIdTokenChanged(auth, setUser), [auth]);
  return user;
};

export const isFirebaseError = (err: unknown): err is FirebaseError => {
  return (
    err instanceof Error &&
    (err as any as FirebaseError).code !== null &&
    typeof (err as any as FirebaseError).code === "string"
  );
};
