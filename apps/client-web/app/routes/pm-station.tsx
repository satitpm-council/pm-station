import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import type { FirebaseOptions } from "firebase/app";
import { useFirebase } from "../utils/firebase";

type PUBLIC_ENV = {
  ENV: {
    firebaseConfig: FirebaseOptions;
  };
};

export const unstable_shouldReload = () => false;

export const loader: LoaderFunction = async () => {
  const firebaseConfig = {
    apiKey: process.env.PM_STATION_FIREBASE_PUBLIC_API_KEY,
    authDomain: process.env.PM_STATION_FIREBASE_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.PM_STATION_FIREBASE_PUBLIC_PROJECT_ID,
    storageBucket: process.env.PM_STATION_FIREBASE_PUBLIC_STORAGE_BUCKET,
    messagingSenderId:
      process.env.PM_STATION_FIREBASE_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.PM_STATION_FIREBASE_PUBLIC_APP_ID,
    measurementId: process.env.PM_STATION_FIREBASE_PUBLIC_MEASUREMENT_ID,
  };
  return json<PUBLIC_ENV>({
    ENV: {
      firebaseConfig,
    },
  });
};

export default function PMStationApp() {
  const {
    ENV: { firebaseConfig },
  } = useLoaderData<PUBLIC_ENV>();

  useFirebase("pm-station", firebaseConfig);

  return <Outlet />;
}
