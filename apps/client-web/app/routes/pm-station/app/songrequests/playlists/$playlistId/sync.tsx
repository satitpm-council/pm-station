import { ArrowPathIcon } from "@heroicons/react/20/solid";
import { useMemo, useState } from "react";
import { PageHeader } from "~/components/Header";
import { SyncMusicModal, ViewTrackModal } from "~/components/TrackModal";
import type { SongRequestRecord } from "~/schema/pm-station/songrequests/types";
import { withTitle } from "~/utils/pm-station/client";
import { usePlaylistData } from "~/utils/pm-station/playlists/data";
import { usePlaylistParam } from "~/utils/pm-station/playlists/param";
import { isDocumentValid } from "@lemasc/swr-firestore";
import { SongRequestRecordList } from "~/components/SongRequest/list";

export const meta = withTitle("ซิงก์รายการเพลง");

type CategorizedTracks = {
  unsynced: SongRequestRecord[];
  synced: SongRequestRecord[];
};
export default function ViewPlaylist() {
  const playlistId = usePlaylistParam();
  const { tracks } = usePlaylistData(playlistId);
  const [selectedTrack, setSelectedTrack] = useState<SongRequestRecord>();

  const [isOpen, setOpen] = useState(false);

  const categorizedTracks = useMemo(
    () =>
      tracks
        ?.filter((v) => isDocumentValid(v))
        .reduce(
          (prev, cur) => {
            if (cur.youtubeId) {
              prev.synced.push(cur);
            } else {
              prev.unsynced.push(cur);
            }
            return prev;
          },
          {
            synced: [],
            unsynced: [],
          } as CategorizedTracks
        ),
    [tracks]
  );

  return (
    <>
      <SyncMusicModal
        tracks={categorizedTracks?.unsynced ?? []}
        closeModal={() => setOpen(false)}
        isOpen={isOpen}
      />
      <ViewTrackModal
        track={selectedTrack}
        onClose={() => setSelectedTrack(undefined)}
      />
      <PageHeader
        title={`ซิงก์รายการเพลง`}
        button={
          categorizedTracks?.unsynced
            ? [
                {
                  onClick: () => setOpen(true),
                  text: "ซิงก์รายการ",
                  icon: ArrowPathIcon,
                  className: "bg-green-500 hover:bg-green-600",
                },
              ]
            : undefined
        }
      ></PageHeader>
      {categorizedTracks && (
        <>
          {categorizedTracks.unsynced.length > 0 && (
            <>
              <h2 className="font-medium text-lg">
                รายการเพลงที่ยังไม่ได้ซิงก์
              </h2>

              <SongRequestRecordList
                data={categorizedTracks.unsynced}
                onItemClick={setSelectedTrack}
              />
            </>
          )}
          {categorizedTracks.synced.length > 0 && (
            <>
              <h2 className="font-medium text-lg">รายการเพลงที่ซิงก์แล้ว</h2>
              <SongRequestRecordList
                data={categorizedTracks.synced}
                onItemClick={setSelectedTrack}
              />
            </>
          )}
        </>
      )}
    </>
  );
}
