"use client";

import { SongRequestRecordList } from "../components/SongRequest/list";
import { usePlaylistData } from "@station/client/playlists";
import { controllerStore } from "../shared/store";

export default function SongSelector() {
  const playlistId = controllerStore((state) => state.playlistId);
  const { tracks } = usePlaylistData(playlistId);
  return (
    <>
      <SongRequestRecordList onItemClick={console.log} data={tracks} />
    </>
  );
}
