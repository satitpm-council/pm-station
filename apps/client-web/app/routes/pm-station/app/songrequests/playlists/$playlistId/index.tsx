import { useState } from "react";
import { PageHeader } from "@station/client/layout";
import { SongRequestRecordList } from "~/components/SongRequest/list";
import { ViewTrackModal } from "~/components/TrackModal";
import type { SongRequestRecord } from "@station/shared/schema/types";
import dayjs from "shared/dayjs";
import { withTitle } from "~/utils/pm-station/client";
import { usePlaylistData } from "@station/client/playlists";
import {
  usePlaylistCommands,
  usePlaylistParam,
} from "~/utils/pm-station/playlists";

export const meta = withTitle("ดูรายการเพลง");

export default function ViewPlaylist() {
  const playlistId = usePlaylistParam();
  const { playlist, tracks } = usePlaylistData(playlistId);
  const [selectedTrack, setSelectedTrack] = useState<SongRequestRecord>();

  const buttons = usePlaylistCommands(playlist, true);
  return (
    <>
      <ViewTrackModal
        track={selectedTrack}
        onClose={() => setSelectedTrack(undefined)}
      />
      <PageHeader title={`ดูข้อมูลรายการเพลง`} button={buttons}>
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
