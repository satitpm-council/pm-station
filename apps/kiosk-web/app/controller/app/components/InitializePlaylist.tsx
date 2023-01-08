"use client";

import { useDocument, ValidatedDocument } from "@lemasc/swr-firestore";
import { TypeOf } from "zod";
import { PlaylistRecord } from "@station/shared/schema";
import { useEffect, useMemo } from "react";
import { zodValidator } from "shared/utils";
import { controllerStore } from "../shared/store";

export default function InitializePlaylist({
  initData,
}: {
  initData: ValidatedDocument<TypeOf<typeof PlaylistRecord>>;
}) {
  const playlistId = useMemo(() => initData?.id, [initData]);

  // set fallback data to all SWR hooks.
  useDocument(playlistId ? `playlists/${playlistId}` : null, {
    validator: zodValidator(PlaylistRecord),
    fallbackData: initData,
  });

  // set playlistId to the store for other components to use
  useEffect(() => {
    controllerStore.setState({ playlistId });
  }, [playlistId]);

  // return null to prevent rendering
  return null;
}
