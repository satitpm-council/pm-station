import { PagesOptions } from "next-auth";

/**
 * @see https://next-auth.js.org/configuration/pages
 *
 * We omited the following pages:
 * - `verifyRequest`: we don't have email provider enabled, so no verification is needed
 * - `signOut`: users can only sign out inside the app from our UI, so no need for a page
 */
export const pages: Omit<PagesOptions, "verifyRequest" | "signOut"> = {
  signIn: "/auth/sign-in",
  error: "/auth/sign-in", // Error code passed in query string as ?error=
  newUser: "/app/profile",
};
