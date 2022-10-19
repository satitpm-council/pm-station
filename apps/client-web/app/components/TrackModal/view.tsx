import type { TrackModalProps } from "./base";
import TrackModal, { useStableTrack } from "./base";
import dayjs from "~/utils/dayjs";
import type { SongRequestRecord } from "~/schema/pm-station/songrequests/types";

export const ViewTrackModal = (props: TrackModalProps) => {
  const stableTrack = useStableTrack(props.track as SongRequestRecord);
  return (
    <TrackModal
      onClose={props.onClose}
      className="text-sm flex flex-col gap-1"
      {...stableTrack}
    >
      <span>คนส่งคำขอทั้งหมด {stableTrack.track?.submissionCount} คน</span>
      <span>
        เปลี่ยนแปลงล่าสุดเมื่อ{" "}
        {dayjs(stableTrack.track?.lastUpdatedAt).format("LLL น.")}
      </span>
    </TrackModal>
  );
};
