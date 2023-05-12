import { withAuth } from "next-auth/middleware";
import { pages } from "./auth/pages";
import { NextMiddleware, NextResponse } from "next/server";
import { createCSRFToken } from "./auth/csrf";

export const middleware: NextMiddleware = async (request, ...args) => {
  console.log(request.nextUrl.pathname);
  let response;
  if (!request.nextUrl.pathname.startsWith("/auth")) {
    // Not an authentication page, runs the authentication middleware
    response = await (
      withAuth({
        pages,
      }) as NextMiddleware
    )(request, ...args);

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
