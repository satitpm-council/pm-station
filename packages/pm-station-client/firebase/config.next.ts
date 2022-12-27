export const getFirebaseConfig = () => {
  return {
    apiKey: process.env.PM_STATION_FIREBASE_PUBLIC_API_KEY,
    authDomain: process.env.PM_STATION_FIREBASE_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.PM_STATION_FIREBASE_PUBLIC_PROJECT_ID,
    storageBucket: process.env.PM_STATION_FIREBASE_PUBLIC_STORAGE_BUCKET,
    messagingSenderId:
      process.env.PM_STATION_FIREBASE_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.PM_STATION_FIREBASE_PUBLIC_APP_ID,
    measurementId: process.env.PM_STATION_FIREBASE_PUBLIC_MEASUREMENT_ID,
  };
};
