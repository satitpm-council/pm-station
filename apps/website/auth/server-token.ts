import { decode } from "next-auth/jwt";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { internal_defaultCookies } from "./internal/cookie";

const sessionCookie = internal_defaultCookies().sessionToken;

const getTokenFromCookies = (cookies: ReadonlyRequestCookies) => {
  const cookie = cookies.get(sessionCookie.name);
  return cookie?.value;
};

/**
 * An edge-compatible function that decodes the JWT from the cookie and returns the current user.
 */
export async function getUser(cookies: ReadonlyRequestCookies) {
  try {
    const tokendata = await decode({
      secret: process.env.NEXTAUTH_SECRET,
      token: getTokenFromCookies(cookies),
    });
    if (tokendata?.sub) return tokendata;
  } catch {}

  return null;
}
