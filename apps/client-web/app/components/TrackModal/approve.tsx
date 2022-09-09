import type { TrackModalProps } from "./base";
import TrackModal, { useStableTrack } from "./base";
import dayjs from "~/utils/dayjs";
import type { SongRequestRecord } from "~/utils/pm-station/spotify/select";
import { useCallback } from "react";

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
        เปลี่ยนแปลงล่าสุดเมื่อ {dayjs(track?.lastUpdatedAt).format("LL น.")}
      </span>
    </TrackModal>
  );
};
