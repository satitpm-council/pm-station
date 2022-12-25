import { useEffect, useRef, useState } from "react";
import { SongRequestRecordList } from "~/components/SongRequest/list";
import { ViewTrackModal } from "~/components/TrackModal";
import type { SongRequestRecord } from "@station/shared/schema/types";
import { withTitle } from "~/utils/pm-station/client";
import { usePlaylistData } from "~/utils/pm-station/playlists/data";

export const meta = withTitle("ดูรายการเพลง");

export default function PlaylistDetail({
  playlistId,
  scrollRef,
}: {
  playlistId?: string;
  scrollRef: React.MutableRefObject<HTMLElement | null>;
}) {
  const { tracks } = usePlaylistData(playlistId);
  const [selectedTrack, setSelectedTrack] = useState<SongRequestRecord>();
  // use to persisted playlist heights on layout shifts
  const playlistHeight = useRef<undefined | number>();

  const listRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (tracks && tracks.length > 0) {
      setTimeout(
        () => scrollRef.current?.scrollIntoView({ behavior: "smooth" }),
        250
      );

      if (listRef.current && listRef.current.offsetHeight !== 0) {
        playlistHeight.current = listRef.current.offsetHeight;
      }
    }
  }, [tracks, scrollRef]);

  return (
    <>
      <ViewTrackModal
        track={selectedTrack}
        onClose={() => setSelectedTrack(undefined)}
      />
      <div
        className="flex-1 w-full max-w-[89vw] sm:max-w-[unset]"
        ref={listRef}
        style={{ minHeight: playlistId ? playlistHeight.current : undefined }}
      >
        {tracks && tracks.length > 0 && (
          <SongRequestRecordList data={tracks} onItemClick={setSelectedTrack} />
        )}
      </div>
    </>
  );
}
