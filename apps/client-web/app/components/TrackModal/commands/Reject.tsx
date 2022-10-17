import type { SongRequestRecord } from "~/schema/pm-station/songrequests/types";
import { useCallback } from "react";
import type { ListParams } from "~/utils/pm-station/songrequests";
import { defaults, options } from "~/utils/pm-station/songrequests";
import { updateDoc } from "@lemasc/swr-firestore";
import { useSafeParams } from "~/utils/params";
import { useSongRequestMutate } from "~/utils/pm-station/songrequests/hook";

type TrackStatusState = {
  trackStatus: ListParams["filter"];
  setTrackStatus: (status: ListParams["filter"]) => void;
};

const RejectButton = ({
  track,
  trackStatus,
  setTrackStatus,
}: { track?: SongRequestRecord } & TrackStatusState) => {
  const [params] = useSafeParams(defaults, options);
  const mutate = useSongRequestMutate(params);
  const toggleReject = useCallback(
    async (wasRejected: boolean) => {
      try {
        await updateDoc<SongRequestRecord>(
          `/songrequests/${track?.id}`,
          {
            lastPlayedAt: wasRejected ? null : new Date(0),
          },
          {
            ignoreLocalMutation: true,
          }
        );
        // mutate manually.
        mutate();
        setTrackStatus(wasRejected ? "idle" : "rejected");
      } catch (err) {
        console.error(err);
      }
    },
    [track?.id, mutate, setTrackStatus]
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
