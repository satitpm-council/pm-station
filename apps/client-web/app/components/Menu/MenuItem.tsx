import { Link } from "@remix-run/react";
import type { MenuItemProps } from "react-pro-sidebar";
import { MenuItem as Component } from "react-pro-sidebar";
import { useUser } from "~/utils/pm-station/client";
import { useDefaultOpen } from "./useDefaultOpen";

export const MenuItem = ({
  route,
  children,
  ...props
}: Omit<MenuItemProps, "active"> & {
  route?: string;
}) => {
  const { isRegistered } = useUser();
  const active = useDefaultOpen(route, true);
  return (
    <Component active={active} {...props}>
      {/* We don't allow navigation if user doesn't registered yet. */}
      {route && isRegistered ? (
        <Link
          title={typeof children === "string" ? children : undefined}
          to={route}
        >
          {children}
        </Link>
      ) : (
        children
      )}
    </Component>
  );
};
