import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useMatches } from "@remix-run/react";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
} from "~/components/Menu";

import sidebar from "react-pro-sidebar/dist/css/styles.css";
import sidebarOverrides from "~/styles/sidebar.css";
import { Header } from "~/components/Header";
import type { User } from "~/utils/pm-station/auth.server";
import { verifySession } from "~/utils/pm-station/auth.server";
import {
  ArrowLeftOnRectangleIcon,
  Bars4Icon,
  MusicalNoteIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";

type UserStore = {
  user: User;
};

export const unstable_shouldReload = () => true;

export const loader: LoaderFunction = async ({ request: { url, headers } }) => {
  const user = await verifySession(headers);

  const { pathname } = new URL(url);
  if (!user) {
    return redirect(`/pm-station/?continueUrl=${pathname}`);
  }
  console.log("P", pathname);
  /*if ((!user.role || !user.type) && pathname !== "/pm-station/app/profile") {
    // WARN: We can't prevent client-side transitions. This is for server only.
    return redirect("/pm-station/app/profile");
  }*/

  return json<UserStore>({ user });
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: sidebar },
  { rel: "stylesheet", href: sidebarOverrides },
];

export default function Index() {
  const [open, setOpen] = useState(false);
  const matches = useMatches();
  useEffect(() => {
    setOpen(false);
  }, [matches]);
  return (
    <div className="overflow-hidden flex  items-stretch h-screen gap-4 bg-gradient-to-b from-[#151515] to-[#121212] text-white">
      <ProSidebar toggled={open} onToggle={setOpen} breakPoint="md">
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
            <MenuItem route="/pm-station/app/songrequests">
              ส่งคำขอเปิดเพลง
            </MenuItem>
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
      </ProSidebar>
      <div className="flex flex-col overflow-auto h-full min-h-screen w-full">
        <nav className="flex flex-row gap-1 items-center px-4 py-2">
          <button
            onClick={() => setOpen(true)}
            className="rounded-full bg-white bg-opacity-10 hover:bg-opacity-20 transition-colors p-2.5"
          >
            <Bars4Icon className="h-5 w-5" />
          </button>
          <Link to="/pm-station/app" title="PM Station" className="scale-90">
            <Header />
          </Link>
        </nav>
        <main className="px-6 md:px-8 py-4 md:pt-12 pb-12 flex-1 flex flex-col gap-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
