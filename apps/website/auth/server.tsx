import { getServerSession } from "next-auth";
import options from "@/auth";
import { isRegistered } from "./utils";
import { getDb, WithXataMetadata } from "@station/db";
import { userRole, User, userSchema } from "@/schema/user";

export const getSession = async () => {
  const session = await getServerSession(options);
  return {
    ...(session ?? {}),
    isRegistered: isRegistered(session?.user),
  };
};

const roles: string[] = userRole.options;

export const listUsers = async () => {
  const users = await getDb().db.nextauth_users.getAll();
  return users
    .map((user) => {
      try {
        const userData = userSchema.parse(user.toSerializable());
        return {
          ...userData,
          metadata: user.xata,
        };
      } catch {
        return undefined;
      }
    })
    .filter((user): user is WithXataMetadata<User> => user !== undefined)
    .sort((a, b) => {
      const roleA = a.role ? roles.indexOf(a.role) : -1;
      const roleB = b.role ? roles.indexOf(b.role) : -1;

      return roleB - roleA;
    });
};
