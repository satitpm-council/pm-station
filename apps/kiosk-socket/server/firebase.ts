import admin from "@station/server/firebase-admin";
import { getAuth } from "firebase-admin/auth";

const auth = getAuth(admin);

export const verifyIdToken = (idToken: string, checkRevoked?: boolean) => {
  return auth.verifyIdToken(idToken, checkRevoked);
};

