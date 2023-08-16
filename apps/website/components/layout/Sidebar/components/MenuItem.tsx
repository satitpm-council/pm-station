import { isRegistered } from "@/auth/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import type { MenuItemProps } from "react-pro-sidebar";
import { MenuItem as Component } from "react-pro-sidebar";
import { useDefaultOpen } from "../useDefaultOpen";

export const MenuItem = ({
  route,
  children,
  ...props
}: Omit<MenuItemProps, "active"> & {
  route?: string;
}) => {
  const { data } = useSession();
  const userRegistered = isRegistered(data?.user);
  const active = useDefaultOpen(route, true);
  return (
    <Component active={active} {...props}>
      {/* We don't allow navigation if user doesn't registered yet. */}
      {route && userRegistered ? (
        <Link
          title={typeof children === "string" ? children : undefined}
          href={route}
        >
          {children}
        </Link>
      ) : (
        children
      )}
    </Component>
  );
};
