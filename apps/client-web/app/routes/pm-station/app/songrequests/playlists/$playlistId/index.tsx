import {
  ArrowPathIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { useNavigate } from "@remix-run/react";
import { useCallback, useState } from "react";
import { PageHeader } from "@station/client/layout";
import { SongRequestRecordList } from "~/components/SongRequest/list";
import { ViewTrackModal } from "~/components/TrackModal";
import axios from "shared/axios";
import type { SongRequestRecord } from "@station/shared/schema/types";
import dayjs from "shared/dayjs";
import { withTitle } from "~/utils/pm-station/client";
import { usePlaylistData } from "@station/client/playlists";
import { usePlaylistParam } from "~/utils/pm-station/playlists/param";
import type { DeletePlaylistAction } from "@station/shared/api";

export const meta = withTitle("ดูรายการเพลง");

export default function ViewPlaylist() {
  const playlistId = usePlaylistParam();
  const { playlist, tracks } = usePlaylistData(playlistId);
  const navigate = useNavigate();
  const [selectedTrack, setSelectedTrack] = useState<SongRequestRecord>();
  const goToSubPage = useCallback(
    (page: "edit" | "sync") => {
      navigate(
        `/pm-station/app/songrequests/playlists/${playlist?.id}/${page}`
      );
    },
    [navigate, playlist]
  );
  const remove = useCallback(async () => {
    if (playlist && confirm("ต้องการลบรายการหรือไม่")) {
      await axios.post<any, any, DeletePlaylistAction>(
        "/pm-station/app/songrequests/playlists/delete",
        {
          playlistId: playlist.id,
        }
      );
      navigate(`/pm-station/app/songrequests/playlists`);
    }
  }, [navigate, playlist]);

  return (
    <>
      <ViewTrackModal
        track={selectedTrack}
        onClose={() => setSelectedTrack(undefined)}
      />
      <PageHeader
        title={`ดูข้อมูลรายการเพลง`}
        button={
          playlist && playlist.status === "queued"
            ? [
                {
                  className: "bg-blue-500 hover:bg-blue-600",
                  onClick: () => goToSubPage("edit"),
                  icon: PencilIcon,
                  text: "แก้ไขรายการ",
                },
                {
                  className: "bg-green-500 hover:bg-green-600",
                  onClick: () => goToSubPage("sync"),
                  icon: ArrowPathIcon,
                  text: "ซิงก์รายการ",
                },
                {
                  className: "bg-red-500 hover:bg-red-600",
                  onClick: remove,
                  text: "ลบรายการ",
                  icon: TrashIcon,
                },
              ]
            : undefined
        }
      >
        {playlist
          ? `วันที่ ${dayjs(playlist.queuedDate).format("LL")} (${
              playlist.status === "played" ? "เล่นไปแล้ว" : "ยังไม่ถูกเล่น"
            })`
          : ``}
      </PageHeader>

      {tracks && tracks.length > 0 && (
        <SongRequestRecordList data={tracks} onItemClick={setSelectedTrack} />
      )}
    </>
  );
}
