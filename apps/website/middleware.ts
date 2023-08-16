import { NextAuthMiddlewareOptions, withAuth } from "next-auth/middleware";
import { pages } from "./auth/pages";
import { NextMiddleware, NextResponse } from "next/server";
import { createCSRFToken } from "./auth/csrf";
import { isRegistered } from "./auth/utils";

export const middleware: NextMiddleware = async (request, ...args) => {
  let response;
  if (!request.nextUrl.pathname.startsWith("/auth")) {
    let userRegistered = false;
    const middlewareOptions: NextAuthMiddlewareOptions = {
      pages,
      callbacks: {
        authorized({ token }) {
          if (!token) return false;
          userRegistered = isRegistered(token);
          return true;
        },
      },
    };
    // Not an authentication page, runs the authentication middleware
    response = await (withAuth(middlewareOptions) as NextMiddleware)(
      request,
      ...args
    );

    if (response) {
      // Check if the response is a redirect
      const location = response.headers.get("location");
      if (location) {
        const url = new URL(location);
        const callbackUrl = url.searchParams.get("callbackUrl");
        if (callbackUrl) {
          if (callbackUrl === "/") {
            // If the callbackUrl is the root path, remove it, as it is unnecessary.
            url.searchParams.delete("callbackUrl");
          }
          // Apply the callbackUrl query parameter to the location header
          response.headers.set("location", url.toString());
        }
      }
    }

    if (!userRegistered) {
      // If the user is signed in but not registered, redirect to the profile registration page.
      const url = request.nextUrl.clone();
      if (url.pathname !== "/app/profile") {
        url.pathname = "/app/profile";
        response = NextResponse.redirect(url);
      }
    }
  }
  // If the response is null or undefined, we simply create a pass-through response.
  if (!response) {
    response = NextResponse.next();
  }
  // The native Response object may not have the `cookies` property,
  // so we need to cast it to the NextResponse type.
  // This shouldn't happen. But we check it just in case.
  if ((response as NextResponse).cookies) {
    // Make sure that the CSRF token is already set before start the authentication process.
    const { name, value, options } = await createCSRFToken(request.cookies);
    if (value) {
      // The function will return a cookie only if the CSRF token is not already set.
      (response as NextResponse).cookies.set(name, value, options);
    }
  }
  return response;
};

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - . (any public static files containing dots in the filename)
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     */
    "/((?!.*\\.|api|public|_next/static|_next/image).*)",
  ],
};
