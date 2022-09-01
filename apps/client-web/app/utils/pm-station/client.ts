import type { MetaFunction } from "@remix-run/node";
import { useMatches } from "@remix-run/react";
import type { UserRecord } from "firebase-admin/auth";
import { useMemo } from "react";

export const withTitle: (title: string) => MetaFunction =
  (title: string) => () => ({
    title: `${title} - PM Station`,
  });

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

type UseUserReturn = {
  user: User | undefined;
  isRegistered: boolean;
};
export const useUser = (): UseUserReturn => {
  const matches = useMatches();
  const user: User | undefined = useMemo(
    () => matches.find((v) => v.pathname === "/pm-station/app")?.data?.user,
    [matches]
  );
  const isRegistered = useMemo(
    () => user?.role !== undefined && user?.type !== undefined,
    [user?.role, user?.type]
  );
  return { user, isRegistered };
};
