import admin from "~/utils/pm-station/firebase-admin.server";
import cookie from "cookie";
import { isString } from "../guards";
import type { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import type { FirebaseError } from "firebase-admin";
import { getAuth } from "firebase-admin/auth";

export const createSession = async (token: string): Promise<string> => {
  const expiresIn = 60 * 60 * 24 * 1000;
  const session = await getAuth(admin).createSessionCookie(token, {
    expiresIn,
  });

  return cookie.serialize("session", session, {
    secure: process.env.NODE_ENV !== "development",
    httpOnly: true,
    path: "/pm-station",
  });
};

export const verifySession = async (
  headers: Response["headers"]
): Promise<DecodedIdToken | undefined> => {
  const header = headers.get("Cookie");
  const { session }: { session?: string } = header ? cookie.parse(header) : {};
  if (isString(session)) {
    try {
      return await getAuth(admin).verifySessionCookie(session);
    } catch (err) {
      console.error(err);
    }
  }
  return undefined;
};

export const verifyIdToken = async (
  headers: Response["headers"],
  idToken: string
): Promise<DecodedIdToken> => {
  const user = await verifySession(headers);
  if (!user) throw new Error("No user!");
  const result = await getAuth(admin).verifyIdToken(idToken);
  if (result.sub !== user.uid) throw new Error("User not match.");
  return result;
};

export const isFirebaseError = (err: unknown): err is FirebaseError => {
  return (
    err instanceof Error &&
    (err as any as FirebaseError).code !== null &&
    typeof (err as any as FirebaseError).code === "string"
  );
};
