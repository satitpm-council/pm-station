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
  // TODO: To be implemented
  const isRegistered = false;
  const active = useDefaultOpen(route, true);
  return (
    <Component active={active} {...props}>
      {/* We don't allow navigation if user doesn't registered yet. */}
      {route && isRegistered ? (
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
