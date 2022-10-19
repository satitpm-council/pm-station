import { Menu, MenuItem, SubMenu, SidebarHeader } from "~/components/Menu";
import {
  ArrowLeftOnRectangleIcon,
  MusicalNoteIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import { Header } from "~/components/Header";
import { Link } from "@remix-run/react";
import { UserRole, useUser } from "~/utils/pm-station/client";

export default function Sidebar() {
  const { user, isRegistered } = useUser();
  return (
    <>
      <SidebarHeader>
        <Link to="/pm-station/app" title="PM Station">
          <Header />
        </Link>
      </SidebarHeader>

      <Menu iconShape="circle">
        <MenuItem
          icon={<UserIcon className="h-4 w-4" />}
          route="/pm-station/app/profile"
        >
          ข้อมูลส่วนตัว
        </MenuItem>
        <SubMenu
          route="/pm-station/app/songrequests"
          title="PM Music Request"
          icon={<MusicalNoteIcon className="h-4 w-4" />}
        >
          <MenuItem route="/pm-station/app/songrequests/">
            ส่งคำขอเปิดเพลง
          </MenuItem>
          {isRegistered &&
            user?.role !== undefined &&
            user.role >= UserRole.MODERATOR && (
              <>
                <MenuItem route="/pm-station/app/songrequests/editor">
                  จัดการคำขอเพลง
                </MenuItem>
                <MenuItem route="/pm-station/app/songrequests/playlists">
                  จัดการรายการคำขอเพลง
                </MenuItem>
              </>
            )}
        </SubMenu>
      </Menu>
      <Menu className="border-t border-gray-600">
        <MenuItem icon={<ArrowLeftOnRectangleIcon className="h-4 w-4" />}>
          <form method="post" action="/pm-station/app/logout">
            <button type="submit" title="ออกจากระบบ">
              ออกจากระบบ
            </button>
          </form>
        </MenuItem>
      </Menu>
    </>
  );
}
