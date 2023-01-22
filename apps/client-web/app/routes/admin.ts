import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import admin from "@station/server/firebase-admin";
import { UserRole } from "@station/shared/user";
import { getAuth } from "firebase-admin/auth";
export const loader: LoaderFunction = async () => {
  const auth = getAuth(admin);
  const phoneNumbers = ["0983820286"];

  const programId = "qM7PlFKBHLZpJAj4t73Z";
  // Prefix the phone numbers with +66, and search all users with the given phone numbers.
  const { users } = await auth.getUsers(
    phoneNumbers.map((phoneNumber) => ({ phoneNumber: `+66${phoneNumber}` }))
  );

  // Add the programId to the user's customClaims.
  await Promise.all(
    users.map((user) =>
      auth.setCustomUserClaims(user.uid, {
        ...user.customClaims,
        programId,
        role: UserRole.EDITOR,
      })
    )
  );

  return json({ users });
};
