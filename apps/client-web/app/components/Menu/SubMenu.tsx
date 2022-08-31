import { useEffect } from "react";
import { useState } from "react";
import type { SubMenuProps } from "react-pro-sidebar";
import { SubMenu as Component } from "react-pro-sidebar";
import { useDefaultOpen } from "./useDefaultOpen";

export const SubMenu = ({
  route,
  ...props
}: Omit<SubMenuProps, "defaultOpen"> & { route: string }) => {
  const defaultOpen = useDefaultOpen(route);
  const [open, setOpen] = useState<boolean | undefined>(undefined);
  useEffect(() => {
    setOpen(undefined);
  }, [defaultOpen]);
  return (
    <Component
      onClick={() => setOpen(!open)}
      open={open ?? defaultOpen}
      {...props}
    />
  );
};
