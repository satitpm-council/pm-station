import { usePathname } from "next/navigation";

export const useDefaultOpen = (pathname?: string, exact?: boolean) => {
  const path = usePathname();
  if (!pathname) return false;
  return exact ? pathname === path : path.startsWith(pathname);
};
