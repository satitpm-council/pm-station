import { useCallback } from "react";
import { updateDoc } from "@lemasc/swr-firestore";
import type { SongRequestRecord } from "~/schema/pm-station/songrequests/types";
import type { ListParams } from "~/utils/pm-station/songrequests";
import { LastPlayedDate } from "~/utils/pm-station/songrequests/date";

export type TrackStatus = ListParams["filter"];
type TrackStatusState = {
  trackStatus: TrackStatus;
  setTrackStatus: (status: TrackStatus) => void;
};

const RejectButton = ({
  track,
  trackStatus,
  setTrackStatus,
}: { track?: SongRequestRecord } & TrackStatusState) => {
  const toggleReject = useCallback(
    async (wasRejected: boolean) => {
      try {
        await updateDoc<SongRequestRecord>(`songrequests/${track?.id}`, {
          lastPlayedAt: wasRejected
            ? LastPlayedDate.Idle
            : LastPlayedDate.Rejected,
        });

        setTrackStatus(wasRejected ? "idle" : "rejected");
      } catch (err) {
        console.error(err);
      }
    },
    [track?.id, setTrackStatus]
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
