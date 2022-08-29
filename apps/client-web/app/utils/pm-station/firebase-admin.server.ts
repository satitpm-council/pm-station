import * as firebase from "firebase-admin";

const admin = !firebase.apps.length
  ? firebase.initializeApp({
      credential: firebase.credential.cert({
        projectId: process.env.PM_STATION_FIREBASE_PUBLIC_PROJECT_ID,
        clientEmail: process.env.PM_STATION_FIREBASE_CLIENT_EMAIL,
        privateKey: (
          process.env.PM_STATION_FIREBASE_PRIVATE_KEY as string
        ).replace(/\\n/g, "\n"),
      }),
    })
  : firebase.app();

export default admin;
