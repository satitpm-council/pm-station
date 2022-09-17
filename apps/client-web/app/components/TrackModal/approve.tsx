import type { TrackModalProps } from "./base";
import TrackModal, { useStableTrack } from "./base";
import dayjs from "~/utils/dayjs";
import type { SongRequestRecord } from "~/schema/pm-station/songrequests/types";
import { useCallback } from "react";
import { isAlreadyPlayed } from "~/utils/pm-station/songrequests";

export type ApproveTrackModalProps = Omit<TrackModalProps, "track"> & {
  track?: SongRequestRecord;
};

export const ApproveTrackModal = (props: ApproveTrackModalProps) => {
  const stableTrack = useStableTrack(props.track);
  const { track } = stableTrack;

  const copyId = useCallback(() => {
    navigator.clipboard.writeText(`/songrequests/${track?.id}`);
  }, [track]);
  return (
    <TrackModal
      className="text-sm flex flex-col gap-1"
      {...props}
      {...stableTrack}
    >
      <span onClick={copyId}>ID: {track?.id}</span>
      <span>คนส่งคำขอทั้งหมด {track?.submissionCount} คน</span>
      <span>
        เปลี่ยนแปลงล่าสุดเมื่อ {dayjs(track?.lastUpdatedAt).format("LLL น.")}
      </span>
      {isAlreadyPlayed(track?.lastPlayedAt) && (
        <span>เปิดล่าสุดเมื่อ {dayjs(track?.lastPlayedAt).format("LL")}</span>
      )}
      {track?.playlistId && (
        <span>Playlist ID: {track.playlistId.join(" , ")}</span>
      )}
    </TrackModal>
  );
};
