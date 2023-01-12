import { getTodayPlaylist } from "kiosk-socket/utils";
import { Suspense } from "react";
import Container from "./container";
import InitializePlaylist from "kiosk-web/components/InitializePlaylist";
import Initialize from "./components/Initialize";

export const dynamic = "force-dynamic"

export default async function ControllerLayout({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) {
  const playlist = getTodayPlaylist();

  return (
    <Container>
      <Initialize />
      <Suspense fallback={null}>
        {/* @ts-ignore */}
        <InitializePlaylist initDataPromise={playlist} />
      </Suspense>
      {children}
    </Container>
  );
}
