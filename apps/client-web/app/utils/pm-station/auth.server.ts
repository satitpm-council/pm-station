import admin from "~/utils/pm-station/firebase-admin.server";
import type { FirebaseError } from "firebase-admin";
import type { UserRecord } from "firebase-admin/auth";
import { getAuth } from "firebase-admin/auth";

import { createAuthenticityToken, verifyAuthenticityToken } from "remix-utils";
import { createCookieSessionStorage } from "@remix-run/node"; // or cloudflare/deno

export type UserClaims = {
  type: "guest" | "student" | "teacher";
  role: "user" | "editor" | "moderator" | "admin";
};
export type User = Pick<UserRecord, "displayName" | "phoneNumber" | "uid"> &
  Partial<UserClaims>;

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    // a Cookie from `createCookie` or the same CookieOptions to create one
    cookie: {
      name: "__session",
      secrets: [process.env.PM_STATION_SESSION_SECRET as string],
      sameSite: "lax",
      secure: process.env.NODE_ENV !== "development",
      httpOnly: true,
      path: "/pm-station",
    },
  });

export const createSession = async (
  headers: Response["headers"],
  token: string
): Promise<string> => {
  const session = await getSession(headers.get("Cookie"));
  const expiresIn = 60 * 60 * 24 * 1000;
  const tokenCookie = await getAuth(admin).createSessionCookie(token, {
    expiresIn,
  });

  session.set("fb:token", tokenCookie);
  return await commitSession(session);
};

export const verifySession = async (
  headers: Response["headers"]
): Promise<User | undefined> => {
  const cookie = await getSession(headers.get("Cookie"));
  if (cookie.has("fb:token")) {
    try {
      const auth = getAuth(admin);
      const { sub } = await auth.verifySessionCookie(cookie.get("fb:token"));
      const { uid, phoneNumber, customClaims, displayName } =
        await auth.getUser(sub);
      const { role, type } = (customClaims ?? {}) as Partial<UserClaims>;
      return { uid, phoneNumber, displayName, role, type };
    } catch (err) {
      console.error(err);
    }
  }
  return undefined;
};

export const createCSRFToken = async (headers: Request["headers"]) => {
  const session = await getSession(headers.get("Cookie"));
  return {
    csrf: createAuthenticityToken(session, "sessionToken"),
    headers: async () => ({
      headers: { "Set-Cookie": await commitSession(session) },
    }),
  };
};

export const verifyCSRFToken = async (request: Request) => {
  const user = await verifySession(request.headers);
  if (!user) throw new Error("No user!");
  const session = await getSession(request.headers.get("Cookie"));
  await verifyAuthenticityToken(request, session, "sessionToken");
  return user;
};

export const isFirebaseError = (err: unknown): err is FirebaseError => {
  return (
    err instanceof Error &&
    (err as any as FirebaseError).code !== null &&
    typeof (err as any as FirebaseError).code === "string"
  );
};

export const logoutSession = async (request: Request) => {
  const session = await getSession(request.headers.get("Cookie"));
  return await destroySession(session);
};
