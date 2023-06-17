/// This file is copied directly from next-auth/core/lib/cookie.ts
/// It is not possible to import it directly, as it is not exported from the package.

import { CookieSerializeOptions } from "cookie";

/** [Documentation](https://next-auth.js.org/configuration/options#cookies) */
export interface CookieOption {
  name: string;
  options: CookieSerializeOptions;
}

/** [Documentation](https://next-auth.js.org/configuration/options#cookies) */
export interface CookiesOptions {
  sessionToken: CookieOption;
  csrfToken: CookieOption;
}

/**
 * Use secure cookies if the site uses HTTPS
 * This being conditional allows cookies to work non-HTTPS development URLs
 * Honour secure cookie option, which sets 'secure' and also adds '__Secure-'
 * prefix, but enable them by default if the site URL is HTTPS; but not for
 * non-HTTPS URLs like http://localhost which are used in development).
 * For more on prefixes see https://googlechrome.github.io/samples/cookie-prefixes/
 *
 * @TODO Review cookie settings (names, options)
 */
export function internal_defaultCookies(): CookiesOptions {
  const useSecureCookies =
    process.env.NEXTAUTH_URL?.startsWith("https://") ?? !!process.env.VERCEL;
  const cookiePrefix = useSecureCookies ? "__Secure-" : "";
  return {
    // default cookie options
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    csrfToken: {
      // Default to __Host- for CSRF token for additional protection if using useSecureCookies
      // NB: The `__Host-` prefix is stricter than the `__Secure-` prefix.
      name: `${useSecureCookies ? "__Host-" : ""}next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
  };
}
