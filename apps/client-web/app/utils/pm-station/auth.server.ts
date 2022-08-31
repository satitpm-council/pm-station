import admin from "~/utils/pm-station/firebase-admin.server";
import type { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import type { FirebaseError } from "firebase-admin";
import { getAuth } from "firebase-admin/auth";

import { createAuthenticityToken, verifyAuthenticityToken } from "remix-utils";
import { createCookieSessionStorage } from "@remix-run/node"; // or cloudflare/deno

const { getSession, commitSession } = createCookieSessionStorage({
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
): Promise<DecodedIdToken | undefined> => {
  const cookie = await getSession(headers.get("Cookie"));
  if (cookie.has("fb:token")) {
    try {
      return await getAuth(admin).verifySessionCookie(cookie.get("fb:token"));
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

export const verifyCSRFToken = async (
  request: Request,
  csrfToken: string
): Promise<DecodedIdToken> => {
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
