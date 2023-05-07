import Link from "next/link";
import {
  Menu,
  MenuItem,
  Sidebar as ProSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@/app/components/Sidebar";
import { ArrowLeftOnRectangleIcon, UserIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { SongRequestItem, ToggleCollapsedMenu } from "./Item";

// We didn't use the 1.x version of react-pro-sidebar
// because it uses `emotion` CSS-in-JS library which is not compatible with React Server Components.

export default function Sidebar() {
  return (
    <ProSidebar collapsedWidth={83} breakPoint="lg">
      <SidebarHeader>
        <Link href="/app" title="PM Station">
          <div className="px-2 py-3 flex gap-3 items-center overflow-hidden h-20">
            <div className="flex-shrink-0">
              <Image
                draggable={false}
                src="/logo.png"
                alt="Logo"
                width="40"
                height="40"
              />
            </div>
            <h1 className={`text-xl leading-6 font-bold`}>PM Station</h1>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <Menu iconShape="circle">
          <MenuItem
            icon={<UserIcon className="h-4 w-4" />}
            route="/app/profile"
          >
            ข้อมูลส่วนตัว
          </MenuItem>
          <SongRequestItem />
        </Menu>
      </SidebarContent>
      <SidebarFooter>
        <button className="w-full" type="button" title="ออกจากระบบ">
          <Menu className="border-gray-600">
            <MenuItem icon={<ArrowLeftOnRectangleIcon className="h-4 w-4" />}>
              ออกจากระบบ
            </MenuItem>
          </Menu>
        </button>
        <ToggleCollapsedMenu />
      </SidebarFooter>
    </ProSidebar>
  );
}
