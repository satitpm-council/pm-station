import type { AuthOptions } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import adapter from "./adapter";

import { pages } from "./pages";
import { providers } from "./providers";

const options: AuthOptions = {
  adapter,
  providers,
  callbacks: {
    async jwt({ token, user, trigger, session: updateData }) {
      // TODO: Add update profile logic
      if (!user && token.sub) {
        // The user object may not be defined if the refreshing the session.
        // Fetch the user from the database.
        user = (await adapter.getUser(token.sub)) as AdapterUser;
      }
      console.log("TYPE", token.sub, user.type);
      // Attempt to merge changes from the user database into the token.
      token = {
        name: user.name,
        email: user.email,
        picture: user.image,
        type: user.type ?? undefined,
        sub: user.id,
      };
      return token;
    },
    session({ session, token }) {
      if (session.user && token.type) {
        session.user.type = token.type;
      }
      return session;
    },
  },
  pages,
  session: {
    strategy: "jwt",
  },
};
export default options;
