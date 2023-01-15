"use client";

import { useCallback, useEffect } from "react";
import { SongRequestRecordList } from "../components/SongRequest/list";
import { usePlaylistData } from "@station/client/playlists";
import { addTrack, controllerStore } from "kiosk-web/store/controller";
import { toast } from "react-toastify";
import { ValidatedDocument } from "@lemasc/swr-firestore";
import { SongRequestRecord } from "@station/shared/schema/types";

export default function SongSelector() {
  const playlistId = controllerStore((state) => state.playlistId);
  const { tracks } = usePlaylistData(playlistId);

  const onItemClick = useCallback(
    (track: ValidatedDocument<SongRequestRecord>) => {
      addTrack(track);
      toast(<b>เพิ่มเพลง {track.name} ลงในคิวแล้ว</b>, {
        type: "success",
        pauseOnFocusLoss: false,
        autoClose: 3000,
      });
    },
    []
  );
  return (
    <>
      <SongRequestRecordList onItemClick={onItemClick} data={tracks} />
    </>
  );
}
