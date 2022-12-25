import admin from "@station/server/firebase-admin";

import { getAuth } from "firebase-admin/auth";

import { createAuthenticityToken, verifyAuthenticityToken } from "remix-utils";
import { createCookieSessionStorage } from "@remix-run/node"; // or cloudflare/deno
import axios from "../axios";
import type { User, UserClaims } from "./client";
import { captureException } from "@sentry/remix";

const expiresIn = 60 * 60 * 24 * 1000;

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
      maxAge: expiresIn,
    },
  });

export const createSession = async (
  headers: Response["headers"],
  token: string
): Promise<string> => {
  const session = await getSession(headers.get("Cookie"));
  const tokenCookie = await getAuth(admin).createSessionCookie(token, {
    expiresIn,
  });

  session.set("fb:token", tokenCookie);
  return await commitSession(session);
};

export const verifySession = async ({
  headers,
}: Request): Promise<User | null | undefined> => {
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
      captureException(err);
      console.error(err);
    }
    return null;
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
  const user = await verifySession(request);
  if (!user) throw new Error("No user!");
  const session = await getSession(request.headers.get("Cookie"));
  await verifyAuthenticityToken(request, session, "sessionToken");
  return user;
};

export const logoutSession = async (request: Request) => {
  const session = await getSession(request.headers.get("Cookie"));
  return await destroySession(session);
};

const customTokenToIdToken = async (token: string) => {
  const key = process.env.PM_STATION_FIREBASE_PUBLIC_API_KEY;
  try {
    const { data } = await axios.post<{ idToken: string }>(
      "/accounts:signInWithCustomToken",
      {
        token,
        returnSecureToken: true,
      },
      {
        baseURL: "https://identitytoolkit.googleapis.com/v1",
        params: {
          key,
        },
      }
    );
    return data.idToken;
  } catch (err) {
    captureException(err);
    throw err;
  }
};

export const updateProfile = async (
  request: Request,
  uid: string,
  { displayName, role, type }: Pick<User, "displayName"> & UserClaims
) => {
  const auth = getAuth(admin);
  await auth.updateUser(uid, {
    displayName,
  });
  const claims: UserClaims = { role, type };
  await auth.setCustomUserClaims(uid, claims);
  const token = await auth.createCustomToken(uid, claims);
  return createSession(request.headers, await customTokenToIdToken(token));
};

export const createClientSignInToken = async ({ uid, role, type }: User) => {
  const auth = getAuth(admin);
  const claims: Partial<UserClaims> = { role, type };
  const token = await auth.createCustomToken(uid, claims);
  return token;
};
