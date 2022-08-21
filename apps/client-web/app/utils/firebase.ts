import type { FirebaseApp, FirebaseOptions } from "firebase/app";
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
    const app = initializeApp(initialConfig);
    const store = { app, auth: getAuth(app) };
    firebaseStore.set(appName, store);
    return store;
  }
  throw new Error(
    "Attempt to access the firebase instance, but wasn't initialized properly."
  );
};
