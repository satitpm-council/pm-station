import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { AuthenticityTokenProvider } from "remix-utils";
import type { FirebaseOptions } from "firebase/app";
import { useFirebase } from "../utils/firebase";

import pmStation from "~/styles/pm-station.css";
import { createCSRFToken } from "~/utils/pm-station/auth.server";

type PUBLIC_ENV = {
  ENV: {
    firebaseConfig: FirebaseOptions;
    csrf: string;
  };
};

export const unstable_shouldReload = () => false;

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: pmStation },
];

export const loader: LoaderFunction = async ({ request }) => {
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
  const { csrf, headers } = await createCSRFToken(request.headers);
  return json<PUBLIC_ENV>(
    {
      ENV: {
        firebaseConfig,
        csrf,
      },
    },
    await headers()
  );
};

export default function PMStationApp() {
  const {
    ENV: { firebaseConfig, csrf },
  } = useLoaderData<PUBLIC_ENV>();

  useFirebase("pm-station", firebaseConfig);

  return (
    <AuthenticityTokenProvider token={csrf}>
      <Outlet />
    </AuthenticityTokenProvider>
  );
}
