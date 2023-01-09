"use client";

import { SongRequestRecordList } from "../components/SongRequest/list";
import { usePlaylistData } from "@station/client/playlists";
import { addTrack, controllerStore } from "../store/store";
import { toggleShowBottomSheet } from "../store";

export default function SongSelector() {
  const playlistId = controllerStore((state) => state.playlistId);
  const { tracks } = usePlaylistData(playlistId);
  return (
    <>
      <SongRequestRecordList
        onItemClick={(track) => {
          addTrack(track);
          toggleShowBottomSheet();
        }}
        data={tracks}
      />
    </>
  );
}
