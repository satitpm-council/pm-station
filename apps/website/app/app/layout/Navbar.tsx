"use client";

import { Bars4Icon } from "@heroicons/react/20/solid";
import Link from "next/link";

import { Header } from "@/components";
import { sidebarStore } from "@/app/components/Sidebar";

export default function Navbar() {
  const openMenu = () => {
    sidebarStore.setState({ toggled: true });
  };
  return (
    <nav className={`flex flex-row lg:hidden gap-1 items-center px-4 py-2`}>
      <button
        title={"เปิดแถบนำทาง"}
        onClick={openMenu}
        className="rounded-full bg-white bg-opacity-10 hover:bg-opacity-20 transition-colors p-2.5"
      >
        <Bars4Icon className="h-5 w-5" />
      </button>
      <Link href="/app" title="PM Station" className="scale-90">
        <Header />
      </Link>
    </nav>
  );
}
