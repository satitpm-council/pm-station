import { useCallback } from "react";
import { updateDoc } from "@lemasc/swr-firestore";
import type { SongRequestRecord } from "~/schema/pm-station/songrequests/types";
import type { ListParams } from "~/utils/pm-station/songrequests";
import { LastPlayedDate } from "~/utils/pm-station/songrequests/date";
import { useInstantSearch } from "react-instantsearch-hooks-web";

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
  const { refresh } = useInstantSearch();
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
        setTimeout(() => {
          refresh();
        }, 1000);
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
    [track, setTrackStatus, refresh, onReject]
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
