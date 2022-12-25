import { initializeApp, getApps, cert, getApp } from "firebase-admin/app";

const admin = !getApps().length
  ? initializeApp({
      credential: cert({
        projectId: process.env.PM_STATION_FIREBASE_PUBLIC_PROJECT_ID,
        clientEmail: process.env.PM_STATION_FIREBASE_CLIENT_EMAIL,
        privateKey: (
          process.env.PM_STATION_FIREBASE_PRIVATE_KEY as string
        ).replace(/\\n/g, "\n"),
      }),
    })
  : getApp();

export default admin;
