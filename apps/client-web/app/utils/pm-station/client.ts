import type { MetaFunction } from "@remix-run/node";
import { useMatches } from "@remix-run/react";
import { useMemo } from "react";
import type { User } from "./auth.server";

export const withTitle: (title: string) => MetaFunction =
  (title: string) => () => ({
    title: `${title} - PM Station`,
  });

type UseUser = {
  user: User | undefined;
  isRegistered: boolean;
};
export const useUser = (): UseUser => {
  const matches = useMatches();
  const user: User | undefined = useMemo(
    () => matches.find((v) => v.pathname === "/pm-station/app")?.data?.user,
    [matches]
  );
  const isRegistered = useMemo(
    () => Boolean(user?.role && user?.type),
    [user?.role, user?.type]
  );
  return { user, isRegistered };
};
