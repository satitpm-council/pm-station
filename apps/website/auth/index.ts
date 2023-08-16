import { userSchema } from "@/schema/user";
import type { AuthOptions, User } from "next-auth";
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
      if (trigger === "update") {
        try {
          // Specify fields to allow updating
          const { type, name } = userSchema
            .pick({
              name: true,
              type: true,
            })
            .parse(updateData);
          const mergedUser: AdapterUser = {
            ...(user as AdapterUser),
            name,
            type,
            // User role will never be updated by the user at this endpoint. Only at the special admin one.
            // If the current user role is null, we allow the update to "user".
            // Otherwise, we keep the current role.
            role: user.role ?? "user",
          };
          await adapter.updateUser(mergedUser);
          user = mergedUser;
        } catch (err) {
          console.error(err);
        }
      }
      console.log("TYPE", token.sub, user.type, user.role);
      // Attempt to merge changes from the user database into the token.
      token = {
        name: user.name,
        email: user.email,
        picture: user.image,
        type: user.type ?? undefined,
        role: user.role ?? undefined,
        sub: user.id,
      };
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        if (token.type) {
          session.user.type = token.type;
        }
        if (token.role) {
          session.user.role = token.role;
        }
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
