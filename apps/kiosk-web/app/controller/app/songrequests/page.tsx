"use client";
import { SongRequestRecordList } from "../components/SongRequest/list";
import { usePlaylistData } from "@station/client/playlists";
import { controllerStore } from "../shared/store";

export default function SongRequestTab() {
  const playlistId = controllerStore((state) => state.playlistId);
  const { tracks } = usePlaylistData(playlistId);
  return (
    <>
      <h1 className="font-bold text-4xl">รายการเพลง</h1>
      <SongRequestRecordList onItemClick={console.log} data={tracks} />
    </>
  );
}
