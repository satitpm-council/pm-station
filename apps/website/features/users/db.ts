import { getDb } from "@station/db";
import { userRole, userSchema } from "@/schema/user";
import { parseResultsWithMetadata, parseWithMetadata } from "@/schema/xata";

const roles: string[] = userRole.options;

export const getUser = async (id: string) => {
  const user = await getDb()
    .db.nextauth_users.filter({
      id,
    })
    .getFirst();
  return user ? parseWithMetadata(user, userSchema) : null;
};

export const listUsers = async () => {
  const users = await getDb().db.nextauth_users.getAll();
  return parseResultsWithMetadata(users, userSchema).sort((a, b) => {
    const roleA = a.role ? roles.indexOf(a.role) : -1;
    const roleB = b.role ? roles.indexOf(b.role) : -1;

    return roleB - roleA;
  });
};
