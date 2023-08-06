import { getDb, WithXataMetadata } from "@station/db";
import { userRole, User } from "@/schema/user";
import { userWithMetadata } from "./utils";

const roles: string[] = userRole.options;

export const getUser = async (id: string) => {
  const user = await getDb()
    .db.nextauth_users.filter({
      id,
    })
    .getFirst();
  return user ? userWithMetadata(user) : null;
};

export const listUsers = async () => {
  const users = await getDb().db.nextauth_users.getAll();
  return users
    .map((user) => {
      try {
        return userWithMetadata(user);
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
