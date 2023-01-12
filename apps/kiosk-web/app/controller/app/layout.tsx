import { headers } from "next/headers";
import { asServerMiddleware } from "@station/server/next";
import InitializeSocket from "./components/InitializeSocket";
import { loader } from "@station/server/api/app-layout";
import Image from "next/image";
import Link from "next/link";

import { getTodayPlaylist } from "kiosk-socket/utils";
import { Suspense } from "react";
import InitializePlaylist from "kiosk-web/components/InitializePlaylist";
import MiniPlayer from "./components/MiniPlayer";
import BottomSheet from "./components/BottomSheet";
import Container from "./container";
import Tabs from "./components/Tabs";
import PlayerContext from "./components/PlayerContext";

const fetchUser = async () => {
  const { user } = await asServerMiddleware(
    "/controller/app",
    headers(),
    loader
  );
  return user;
};

const fetchPlaylist = async () => {
  return await getTodayPlaylist().catch(() => undefined);
};
export default async function ProjectorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await fetchUser();
  const serverPlaylist = fetchPlaylist();

  return (
    <Container>
      <InitializeSocket user={user} />
      <Suspense fallback={null}>
        {/* @ts-ignore */}
        <InitializePlaylist initDataPromise={serverPlaylist} />
      </Suspense>

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
      <main className="px-4 py-6 flex flex-col gap-6 mb-[140px]">
        {children}
      </main>

      <PlayerContext>
        <footer className="z-20 fixed bottom-0 left-0 right-0 w-full flex flex-col justify-center">
          <MiniPlayer />
          <Tabs />
        </footer>
        <BottomSheet />
      </PlayerContext>
    </Container>
  );
}
