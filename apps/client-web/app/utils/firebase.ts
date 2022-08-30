import type { FirebaseApp, FirebaseOptions } from "firebase/app";
import { initializeApp } from "firebase/app";
import type { Auth, User } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";

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

export const useUser = (appName: FirebaseAppName) => {
  const { auth } = useFirebase(appName);
  const [user, setUser] = useState<User | null>();
  useEffect(() => auth.onAuthStateChanged(setUser), [auth]);
  useEffect(() => console.log(user), [user]);
  return user;
};
