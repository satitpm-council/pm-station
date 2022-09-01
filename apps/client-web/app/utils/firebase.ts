import type { FirebaseApp, FirebaseError, FirebaseOptions } from "firebase/app";
import { initializeApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import { getAuth } from "firebase/auth";

type FirebaseStore = {
  app: FirebaseApp;
  auth: Auth;
};

type FirebaseAppName = "pm-station";
let firebaseStore: Map<FirebaseAppName, FirebaseStore> = new Map();

export const useFirebase = (
  appName: FirebaseAppName,
  initialConfig?: FirebaseOptions
): FirebaseStore => {
  if (firebaseStore && firebaseStore.has(appName)) {
    return firebaseStore.get(appName) as FirebaseStore;
  }
  if (initialConfig) {
    const app = initializeApp(initialConfig, appName);
    const auth = getAuth(app);
    auth.languageCode = "th";
    const store: FirebaseStore = { app, auth };
    firebaseStore.set(appName, store);
    return store;
  }
  throw new Error(
    "Attempt to access the firebase instance, but wasn't initialized properly."
  );
};

export const isFirebaseError = (err: unknown): err is FirebaseError => {
  return (
    err instanceof Error &&
    (err as any as FirebaseError).code !== null &&
    typeof (err as any as FirebaseError).code === "string"
  );
};
