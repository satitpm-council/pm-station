import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet } from "@remix-run/react";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
} from "react-pro-sidebar";

import sidebar from "react-pro-sidebar/dist/css/styles.css";
import sidebarOverrides from "~/styles/sidebar.css";
import { Header } from "~/components/Header";
import { verifySession } from "~/utils/pm-station/auth.server";

export const loader: LoaderFunction = async ({ request: { url, headers } }) => {
  if (!(await verifySession(headers))) {
    const { pathname } = new URL(url);
    return redirect(`/pm-station/?continueUrl=${pathname}`);
  }
  return json({});
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: sidebar },
  { rel: "stylesheet", href: sidebarOverrides },
];

export default function Index() {
  return (
    <div className="overflow-hidden flex items-stretch h-screen gap-4 bg-gradient-to-b from-[#151515] to-[#121212] text-white">
      <ProSidebar breakPoint="md">
        <SidebarHeader>
          <Link to="/pm-station/app" title="PM Station">
            <Header />
          </Link>
        </SidebarHeader>
        <Menu iconShape="square">
          <MenuItem>Dashboard</MenuItem>
          <SubMenu title="Components">
            <MenuItem>Component 1</MenuItem>
            <MenuItem>Component 2</MenuItem>
          </SubMenu>
        </Menu>
      </ProSidebar>

      <main className="overflow-auto h-full min-h-screen px-8 py-12 flex-1 flex flex-col gap-6">
        <Outlet />
      </main>
    </div>
  );
}
