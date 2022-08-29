import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet } from "@remix-run/react";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
} from "react-pro-sidebar";

import pmStation from "~/styles/pm-station.css";
import sidebar from "react-pro-sidebar/dist/css/styles.css";
import sidebarOverrides from "~/styles/sidebar.css";

export const loader: LoaderFunction = async ({ request: { url } }) => {
  console.log("Hello", url);
  //return redirect("/pm-station");
  return json({});
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: pmStation },
  { rel: "stylesheet", href: sidebar },
  { rel: "stylesheet", href: sidebarOverrides },
];

export default function Index() {
  return (
    <div className="overflow-hidden flex items-stretch h-screen gap-6 bg-gradient-to-b from-[#151515] to-[#121212] text-white">
      <ProSidebar breakPoint="sm">
        <SidebarHeader className="px-2 py-3">
          <Link
            to="/pm-station/app"
            title="PM Station"
            className="flex gap-2 items-center"
          >
            <img src="/logo.png" alt="Logo" width="40" height="40" />
            <h1 className="text-xl font-bold">PM Station</h1>
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

      <main className="overflow-auto h-full min-h-screen px-4 lg:px-6 py-10 flex-1 flex flex-col gap-6">
        <Outlet />
      </main>
    </div>
  );
}
