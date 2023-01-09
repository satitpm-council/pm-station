import { headers } from "next/headers";
import { asServerMiddleware } from "@station/server/next";
import InitializeSocket from "./components/InitializeSocket";
import { loader } from "@station/server/api/app-layout";
import Image from "next/image";
import Link from "next/link";

import { getTodayPlaylist } from "kiosk-socket/utils";
import { notFound } from "next/navigation";
import InitializePlaylist from "./components/InitializePlaylist";

const fetchUser = async () => {
  const { user } = await asServerMiddleware(
    "/controller/app",
    headers(),
    loader
  );
  return user;
};

const fetchPlaylist = async () => {
  return await getTodayPlaylist().catch((err) => {
    console.error(err);
    notFound();
  });
};
export default async function ProjectorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, serverPlaylist] = await Promise.all([
    fetchUser(),
    fetchPlaylist(),
  ]);

  return (
    <div className="flex-1 flex flex-col items-stretch h-full min-h-screen bg-gradient-to-b from-[#151515] to-[#121212] text-white">
      <InitializeSocket user={user} />
      <InitializePlaylist initData={serverPlaylist} />
      <nav className="sticky top-0 bg-[#151515] z-[90] border-b flex items-center py-2 px-4 gap-4">
        <div className="flex items-center gap-4 flex-grow">
          <Image
            src="/coolkidssatit.png"
            width={40}
            height={40}
            alt="coolkidssatit"
          />
          <b className="font-bold">PM Station Kiosk</b>
        </div>
        <div className="flex items-center">
          <Link prefetch={false} href="/api/logout" className="text-sm">
            Logout
          </Link>
        </div>
      </nav>
      <main className="px-4 py-6 flex flex-col gap-6">{children}</main>
    </div>
  );
}
