import type { RouteMatch } from "@remix-run/react";
import { useMatches } from "@remix-run/react";
import { useMemo } from "react";

const matcher = (pathname: string, route?: RouteMatch): boolean =>
  route?.pathname === pathname;

export const useDefaultOpen = (pathname?: string, exact?: boolean) => {
  const matches = useMatches();
  const defaultOpen = useMemo(() => {
    if (!pathname) return false;
    if (exact) return matcher(pathname, matches[matches.length - 1]);
    return matches.some((route) => matcher(pathname, route));
  }, [exact, pathname, matches]);

  return defaultOpen;
};
