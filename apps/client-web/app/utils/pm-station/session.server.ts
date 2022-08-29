import admin from "~/utils/pm-station/firebase-admin.server";
import cookie from "cookie";
import { isString } from "../guards";

export const createSession = async (token: string) => {
  const expiresIn = 60 * 60 * 24 * 1000;
  const session = await admin.auth().createSessionCookie(token, { expiresIn });

  return cookie.serialize("session", session, {
    secure: process.env.NODE_ENV !== "development",
    httpOnly: true,
    path: "/pm-station",
  });
};
export const verifySession = async (headers: Response["headers"]) => {
  const header = headers.get("Cookie");
  const { session }: { session?: string } = header ? cookie.parse(header) : {};
  if (isString(session)) {
    try {
      await admin.auth().verifySessionCookie(session);
      return true;
    } catch (err) {
      console.error(err);
    }
  }
  return false;
};
