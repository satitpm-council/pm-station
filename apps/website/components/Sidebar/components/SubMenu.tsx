import { useRef, useEffect, useState } from "react";
import type { SubMenuProps } from "react-pro-sidebar";
import { SubMenu as Component } from "react-pro-sidebar";
import { useDefaultOpen } from "../useDefaultOpen";

export const SubMenu = ({
  route,
  ...props
}: Omit<SubMenuProps, "defaultOpen"> & { route: string }) => {
  const defaultOpen = useDefaultOpen(route);
  const [open, setOpen] = useState<boolean | undefined>(undefined);
  useEffect(() => {
    setOpen(defaultOpen);
  }, [defaultOpen]);

  const ref = useRef<HTMLLIElement | null>();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const onClick = () => setOpen((open) => !open);
    const target = element.children.item(0);
    target?.addEventListener("click", onClick);
    return () => target?.removeEventListener("click", onClick);
  }, []);

  return <Component ref={ref} open={open} {...props} />;
};
