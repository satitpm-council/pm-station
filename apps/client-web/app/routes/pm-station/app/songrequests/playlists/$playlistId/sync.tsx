import { ArrowPathIcon } from "@heroicons/react/20/solid";
import { useMemo, useState } from "react";
import { PageHeader } from "@station/client/layout";
import { SyncMusicModal, ViewTrackModal } from "~/components/TrackModal";
import type { SongRequestRecord } from "@station/shared/schema/types";
import { withTitle } from "~/utils/pm-station/client";
import { usePlaylistData } from "@station/client/playlists";
import { usePlaylistParam } from "~/utils/pm-station/playlists/param";
import { isDocumentValid } from "@lemasc/swr-firestore";
import type { ListProps } from "~/components/SongRequest/list";
import { SongRequestRecordList } from "~/components/SongRequest/list";
import dayjs from "dayjs";

export const meta = withTitle("ซิงก์รายการเพลง");

type CategorizedTracks = {
  unsynced: SongRequestRecord[];
  synced: SongRequestRecord[];
};

function TrackList({
  data,
  onItemClick,
  children,
}: { data: SongRequestRecord[] } & ListProps<SongRequestRecord>) {
  return (
    <>
      {data.length > 0 && (
        <>
          <h2 className="font-medium text-lg">
            {children} ({data.length} รายการ)
          </h2>

          <SongRequestRecordList data={data} onItemClick={onItemClick} />
        </>
      )}
    </>
  );
}
export default function ViewPlaylist() {
  const playlistId = usePlaylistParam();
  const { tracks, playlist } = usePlaylistData(playlistId, true);
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
          categorizedTracks && categorizedTracks.unsynced.length > 0
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
      >
        {playlist
          ? `วันที่ ${dayjs(playlist.queuedDate).format("LL")} (จำนวน ${
              playlist.totalTracks
            } รายการ)`
          : ``}
      </PageHeader>
      {categorizedTracks && (
        <>
          <TrackList
            data={categorizedTracks.unsynced}
            onItemClick={setSelectedTrack}
          >
            รายการเพลงที่ยังไม่ได้ซิงก์
          </TrackList>
          <TrackList
            data={categorizedTracks.synced}
            onItemClick={setSelectedTrack}
          >
            รายการเพลงที่ซิงก์แล้ว
          </TrackList>
        </>
      )}
    </>
  );
}
