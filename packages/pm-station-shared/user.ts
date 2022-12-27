import type { UserRecord } from "firebase-admin/auth";

export enum UserRole {
  "USER" = 0,
  "EDITOR" = 1,
  "MODERATOR" = 2,
  "ADMIN" = 5,
}

export type UserClaims = {
  type: "guest" | "student" | "teacher";
  role: UserRole;
};
export type User = Pick<UserRecord, "displayName" | "phoneNumber" | "uid"> &
  Partial<UserClaims>;
