import { ProSidebar } from "react-pro-sidebar";

import { useCallback, useEffect } from "react";
import { sidebarStore } from "../store";
import { usePathname } from "next/navigation";

type OriginalProps = React.ComponentProps<typeof ProSidebar>;
export type SidebarProps = Omit<OriginalProps, "collapsed" | "onToggle">;

export function Sidebar(props: SidebarProps) {
  const toggled = sidebarStore((state) => state.toggled);
  const collapsed = sidebarStore((state) => state.collapsed);

  const onToggle = useCallback((toggled: boolean) => {
    sidebarStore.setState({ toggled });
  }, []);

  const pathname = usePathname();

  useEffect(() => {
    sidebarStore.setState({
      toggled: false,
      collapsed: window.matchMedia("(min-width: 1024px)").matches,
    });
  }, [pathname]);

  useEffect(() => {
    const listener = () => {
      sidebarStore.setState({
        collapsed: window.matchMedia("(min-width: 1024px)").matches,
      });
    };
    const mql = window.matchMedia("(min-width: 1024px)");
    mql.addEventListener("change", listener);
    return () => mql.removeEventListener("change", listener);
  }, []);

  return (
    <ProSidebar
      collapsed={collapsed}
      toggled={toggled}
      onToggle={onToggle}
      {...props}
    />
  );
}
