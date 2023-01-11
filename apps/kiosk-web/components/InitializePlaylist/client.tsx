"use client";

import { usePathname } from "next/navigation";
import { ValidatedDocument } from "@lemasc/swr-firestore";
import { TypeOf } from "zod";
import { PlaylistRecord } from "@station/shared/schema";
import { useEffect, useMemo } from "react";
import { controllerStore } from "kiosk-web/store/controller";
import { usePlaylist } from "@station/client/playlists";
import { useProgram } from "../../shared/useProgram";

export function ClientInitializePlaylist({
  initData,
}: {
  initData: ValidatedDocument<TypeOf<typeof PlaylistRecord>>;
}) {
  const playlistId = useMemo(() => initData?.id, [initData]);
  const programId = useMemo(() => initData?.target, [initData]);

  // set fallback data to all SWR hooks.
  usePlaylist(playlistId, {
    fallbackData: initData,
  });

  // prefetch the program from the playlist target
  useProgram(programId);

  // set playlistId an programId to the store for other components to use
  useEffect(() => {
    controllerStore.setState({ playlistId, programId });
  }, [playlistId, programId]);

  // return null to prevent rendering
  return null;
}
