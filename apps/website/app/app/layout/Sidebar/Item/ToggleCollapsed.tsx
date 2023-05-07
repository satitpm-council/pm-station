"use client";

import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/20/solid";
import { Menu, MenuItem, sidebarStore } from "@/app/components/Sidebar";

export function ToggleCollapsedMenu() {
  const collapsed = sidebarStore((state) => state.collapsed);
  const toggleCollapsed = () => {
    sidebarStore.setState(({ collapsed }) => ({ collapsed: !collapsed }));
  };
  return (
    <Menu
      className="border-gray-600"
      iconShape={collapsed ? undefined : "circle"}
    >
      <button
        type="button"
        onClick={toggleCollapsed}
        title="เปิด/ปิด"
        className="w-full"
        id="toggle-sidebar"
      >
        <MenuItem
          icon={
            collapsed ? (
              <ChevronDoubleLeftIcon className="h-4 w-4" />
            ) : (
              <ChevronDoubleRightIcon className="h-4 w-4" />
            )
          }
        >
          เปิด/ปิด
        </MenuItem>
      </button>
    </Menu>
  );
}
