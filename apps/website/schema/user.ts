import type { ISODateString } from "next-auth";
import { z } from "zod";

export const userType = z.enum(["student", "teacher", "guest"]);

/**
 * User role in the system. Should be sorted from the least privileged to the most privileged.
 */
export const userRole = z.enum(["user", "editor", "admin"]);

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  image: z.string().url(),
  type: userType.nullable(),
  role: userRole.nullable(),
});

export type User = z.infer<typeof userSchema>;
export type UserType = z.infer<typeof userType>;
export type UserRole = z.infer<typeof userRole>;

declare module "next-auth/jwt" {
  interface JWT {
    type?: UserType;
    role?: UserRole;
  }
}
declare module "next-auth" {
  interface User extends z.infer<typeof userSchema> {}
  interface DefaultSession {
    expires: ISODateString;
  }
  interface Session extends DefaultSession {
    user: User;
  }
}
