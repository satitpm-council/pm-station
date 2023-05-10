import { PagesOptions } from "next-auth";

export const pages: Omit<PagesOptions, "verifyRequest"> = {
  signIn: "/auth/sign-in",
  error: "/auth/error", // Error code passed in query string as ?error=
  signOut: "/auth/sign-out",
  //newUser: "/app/profile",
};
