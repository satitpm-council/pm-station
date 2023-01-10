import axios from "shared/axios";
import admin from "@station/server/firebase-admin";

import { getAuth } from "firebase-admin/auth";

import {
  EditorRoleClaims,
  isEditorClaims,
  User,
  UserClaims,
  UserRole,
} from "@station/shared/user";

import {
  getSession,
  commitSession,
  destroySession,
  expiresIn,
} from "./session";

export const createSession = async (
  headers: Response["headers"],
  token: string
): Promise<string> => {
  const session = await getSession(headers.get("Cookie"));
  const tokenCookie = await getAuth(admin).createSessionCookie(token, {
    expiresIn: expiresIn * 1000,
  });

  session.set("fb:token", tokenCookie);
  return await commitSession(session);
};

export const verifySession = async ({
  headers,
}: Pick<Request, "headers">): Promise<User | null | undefined> => {
  const cookie = await getSession(headers.get("Cookie"));
  if (cookie.has("fb:token")) {
    try {
      const auth = getAuth(admin);
      const { sub } = await auth.verifySessionCookie(cookie.get("fb:token"));
      const { uid, phoneNumber, customClaims, displayName } =
        await auth.getUser(sub);
      const claims = (customClaims ?? {}) as UserClaims;
      const { role, type } = claims;
      const session: User = { uid, phoneNumber, displayName, role, type };

      if (isEditorClaims(claims)) {
        const { role, programId, type } = claims;
        return {
          ...session,
          role,
          type,
          programId,
        };
      }
      return session;
    } catch (err) {
      console.error(err);
    }
    return null;
  }
  return undefined;
};

const customTokenToIdToken = async (token: string) => {
  const key = process.env.PM_STATION_FIREBASE_PUBLIC_API_KEY;
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

export const logoutSession = async (request: Request) => {
  const session = await getSession(request.headers.get("Cookie"));
  return await destroySession(session);
};
