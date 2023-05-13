import type { ISODateString } from "next-auth";
import { z } from "zod";

export const userType = z.enum(["student", "teacher", "guest"]);

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  image: z.string().url(),
  type: userType.nullable(),
});

export type UserType = z.infer<typeof userType>;

declare module "next-auth/jwt" {
  interface JWT {
    type?: UserType;
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
