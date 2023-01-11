import loadable from "@loadable/component";
import { useCallback, useEffect, useState } from "react";
import type { ListParams } from "~/utils/pm-station/songrequests";
import { getStatusFromDate } from "~/utils/pm-station/songrequests";
import type { SongRequestRecord } from "@station/shared/schema/types";
import type { CommandAction, CommandActionHandler } from "./types";

import type { TrackStatus } from "@station/client/songrequests";
import RejectButton from "./Reject";

const AddTrackToPlaylist = loadable(() => import("./AddToPlaylist"));
const RemoveTrackFromPlaylist = loadable(() => import("./RemoveFromPlaylist"));

const AdminCommands = ({
  type,
  track,
  onAction,
}: {
  track?: SongRequestRecord;
  onAction: CommandActionHandler;
  type?: CommandAction;
}) => {
  const [trackStatus, setTrackStatus] = useState<ListParams["filter"]>("idle");

  useEffect(
    () => setTrackStatus(getStatusFromDate(track?.lastPlayedAt)),
    [track?.lastPlayedAt]
  );

  useEffect(() => {
    if (type === "addToPlaylist") {
      AddTrackToPlaylist.preload();
    } else if (type === "removeFromPlaylist") {
      RemoveTrackFromPlaylist.preload();
    }
  }, [type]);

  const onSetTrackStatus = useCallback((status: TrackStatus) => {
    setTrackStatus(status);
  }, []);

  return (
    <div className="flex flex-row gap-4 justify-center md:justify-start pt-4 text-sm">
      {type &&
        (type === "addToPlaylist" ? (
          trackStatus !== "rejected" && (
            <AddTrackToPlaylist
              track={track}
              onClose={onAction as () => void}
            />
          )
        ) : (
          <RemoveTrackFromPlaylist track={track} onRemove={onAction} />
        ))}
      {/* If the track has already played, it can't be rejected. */}
      {trackStatus !== "played" && (
        <RejectButton
          track={track}
          trackStatus={trackStatus}
          setTrackStatus={onSetTrackStatus}
          onReject={onAction}
        />
      )}
    </div>
  );
};
export default AdminCommands;
