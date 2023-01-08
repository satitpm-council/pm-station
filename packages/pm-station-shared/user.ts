import type { UserRecord } from "firebase-admin/auth";

export enum UserRole {
  "USER" = 0,
  "EDITOR" = 1,
  "MODERATOR" = 2,
  "ADMIN" = 5,
}

type UserType = "guest" | "student" | "teacher";

export const isEditorClaims = (
  user?: Partial<UserClaims>
): user is EditorRoleClaims => {
  return (
    typeof user !== "undefined" &&
    user.role === UserRole.EDITOR &&
    user.type === "student"
  );
};

export type EditorRoleClaims = {
  role: UserRole.EDITOR;
  type: "student";
  programId: string;
};

export type GenericUserClaims = {
  type: UserType;
  role: UserRole;
};

export type UserClaims = GenericUserClaims | EditorRoleClaims;

export type User = Pick<UserRecord, "displayName" | "phoneNumber" | "uid"> &
  Partial<UserClaims>;
