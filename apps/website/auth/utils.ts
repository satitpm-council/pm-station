import { User } from "next-auth";
import { JWT } from "next-auth/jwt";

export const isRegistered = (user?: User | JWT | null) => {
  return !!(user && user.role && user.type);
};
