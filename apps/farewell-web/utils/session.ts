import type { IronSessionOptions } from "iron-session";
import { UserRecord } from "firebase-admin/auth";

if (!process.env.SESSION_PASSWORD) {
  throw new Error("Session password not found");
}

export type User = Pick<UserRecord, "displayName" | "uid"> & {
  level: string;
  room: string;
  studentId: string;
};
export const sessionOptions: IronSessionOptions = {
  password: process.env.SESSION_PASSWORD,
  cookieName: "pm-farewell",
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    expires: undefined,
  },
};
