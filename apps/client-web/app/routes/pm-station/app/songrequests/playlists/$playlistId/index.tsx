import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "@remix-run/react";
import { useCallback, useState } from "react";
import { PageHeader } from "~/components/Header";
import { SongRequestRecordList } from "~/components/SongRequest/list";
import { ViewTrackModal } from "~/components/TrackModal";
import axios from "~/utils/axios";
import type { SongRequestRecord } from "~/schema/pm-station/songrequests/types";
import dayjs from "~/utils/dayjs";
import { withTitle } from "~/utils/pm-station/client";
import { usePlaylistData } from "~/utils/pm-station/playlists/data";
import type { DeletePlaylistAction } from "~/utils/pm-station/api-types";

export const meta = withTitle("ดูรายการเพลง");

export default function ViewPlaylist() {
  const { playlist, tracks } = usePlaylistData();
  const navigate = useNavigate();
  const [selectedTrack, setSelectedTrack] = useState<SongRequestRecord>();
  const goToEdit = useCallback(
    () =>
      navigate(`/pm-station/app/songrequests/playlists/${playlist?.id}/edit`),
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
                  onClick: goToEdit,
                  icon: PencilIcon,
                  text: "แก้ไขรายการ",
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
