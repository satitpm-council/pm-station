import { useCallback } from "react";
import { updateDoc } from "@lemasc/swr-firestore";
import type { SongRequestRecord } from "@station/shared/schema/types";
import type { ListParams } from "~/utils/pm-station/songrequests";
import { LastPlayedDate } from "~/utils/pm-station/songrequests";
import { SongRequestListStore } from "~/components/SongRequest/admin/store";

export type TrackStatus = ListParams["filter"];
type TrackStatusState = {
  trackStatus: TrackStatus;
  setTrackStatus: (status: TrackStatus) => void;
  onReject: (track: SongRequestRecord) => void;
};

const RejectButton = ({
  track,
  trackStatus,
  setTrackStatus,
  onReject,
}: { track?: SongRequestRecord } & TrackStatusState) => {
  const toggleReject = useCallback(
    async (wasRejected: boolean) => {
      try {
        const updatedDoc: Partial<SongRequestRecord> = {
          lastPlayedAt: wasRejected
            ? LastPlayedDate.Idle
            : LastPlayedDate.Rejected,
        };
        await updateDoc<SongRequestRecord>(
          `songrequests/${track?.id}`,
          updatedDoc
        );
        setTrackStatus(wasRejected ? "idle" : "rejected");
        SongRequestListStore.setState({
          refresh: true,
        });
        if (track && !wasRejected) {
          onReject({
            ...track,
            ...updatedDoc,
          });
        }
      } catch (err) {
        console.error(err);
      }
    },
    [track, setTrackStatus, onReject]
  );
  return (
    <button
      title={`${
        trackStatus === "rejected" ? "ยกเลิกการ" : ""
      }ปฎิเสธคำขอเพลงนี้`}
      className="bg-red-500 text-white px-5 py-3 rounded-lg hover:bg-red-600 focus:outline-none"
      onClick={() => toggleReject(trackStatus === "rejected")}
    >
      {trackStatus === "rejected" ? "ยกเลิกการ" : ""}ปฏิเสธเพลงนี้
    </button>
  );
};

export default RejectButton;
