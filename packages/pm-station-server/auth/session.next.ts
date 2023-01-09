import { createCookieSessionStorage } from "@remix-run/node";

export const expiresIn = 60 * 60 * 12;

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    // a Cookie from `createCookie` or the same CookieOptions to create one
    cookie: {
      name: "__controlSession",
      secrets: [process.env.PM_STATION_SESSION_SECRET as string],
      sameSite: "lax",
      secure: process.env.NODE_ENV !== "development",
      httpOnly: true,
      // we can't set path here because Next.js API uses /api while our app uses /controller
      maxAge: expiresIn,
    },
  });

export { getSession, commitSession, destroySession };
