import { createCookieSessionStorage } from "@remix-run/node";

/**
 * The cookie expire time in SECONDS.
 */
export const expiresIn = 60 * 60 * 24 * 7;
// 60 seconds (1 minute) * 60 minutes (1 hour) * 24 hours (1 day) * 7 days

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

export { getSession, commitSession, destroySession };
