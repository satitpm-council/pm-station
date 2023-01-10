"use client";

import { useCallback, useEffect } from "react";
import { SongRequestRecordList } from "../components/SongRequest/list";
import { usePlaylistData } from "@station/client/playlists";
import { addTrack, controllerStore } from "../store/store";
import { toast } from "react-toastify";
import { ValidatedDocument } from "@lemasc/swr-firestore";
import { SongRequestRecord } from "@station/shared/schema/types";

const ToastId = "playlist-track-added";

export default function SongSelector() {
  const playlistId = controllerStore((state) => state.playlistId);
  const { tracks } = usePlaylistData(playlistId);

  const onItemClick = useCallback(
    (track: ValidatedDocument<SongRequestRecord>) => {
      addTrack(track);
      setTimeout(() => {
        toast(<b>เพิ่มเพลง {track.name} ลงในคิวแล้ว</b>, {
          type: "success",
          pauseOnFocusLoss: false,
          toastId: ToastId,
        });
      }, 200);
    },
    []
  );
  return (
    <>
      <SongRequestRecordList onItemClick={onItemClick} data={tracks} />
    </>
  );
}
