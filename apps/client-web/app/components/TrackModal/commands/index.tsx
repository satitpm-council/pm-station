import loadable from "@loadable/component";
import { useCallback, useEffect, useState } from "react";
import type { ListParams } from "~/utils/pm-station/songrequests";
import type { SongRequestRecord } from "~/schema/pm-station/songrequests/types";
import type { CommandAction, CommandActionHandler } from "./types";

import type { TrackStatus } from "./Reject";
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
    () =>
      setTrackStatus(
        track?.lastPlayedAt
          ? track.lastPlayedAt.valueOf() === 0
            ? "rejected"
            : "played"
          : "idle"
      ),
    [track?.lastPlayedAt]
  );

  useEffect(() => {
    if (type === "addToPlaylist") {
      AddTrackToPlaylist.preload();
    } else if (type === "removeFromPlaylist") {
      RemoveTrackFromPlaylist.preload();
    }
  }, [type]);

  const onSetTrackStatus = useCallback(
    (status: TrackStatus) => {
      setTrackStatus(status);
      if (type === "removeFromPlaylist" && track) {
        onAction(track);
      }
    },
    [onAction, track, type]
  );

  return (
    <div className="flex flex-row gap-4 justify-center md:justify-start pt-4 text-sm">
      {type &&
        (type === "addToPlaylist" ? (
          <AddTrackToPlaylist track={track} onClose={onAction as () => void} />
        ) : (
          <RemoveTrackFromPlaylist track={track} onRemove={onAction} />
        ))}
      {/* If the track has already played, it can't be rejected. */}
      {!track?.lastPlayedAt?.valueOf() && (
        <RejectButton
          track={track}
          trackStatus={trackStatus}
          setTrackStatus={onSetTrackStatus}
        />
      )}
    </div>
  );
};
export default AdminCommands;
