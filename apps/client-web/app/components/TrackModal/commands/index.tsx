import loadable from "@loadable/component";
import { useMatch } from "react-router";
import { useEffect, useState } from "react";
import type { ListParams } from "~/utils/pm-station/songrequests";
import type { SongRequestRecord } from "~/schema/pm-station/songrequests/types";
import type { CommandActionHandler } from "./types";

import RejectButton from "./Reject";

const AddTrackToPlaylist = loadable(() => import("./AddToPlaylist"));
const RemoveTrackFromPlaylist = loadable(() => import("./RemoveFromPlaylist"));

const AdminCommands = ({
  track,
  onAction,
}: {
  track?: SongRequestRecord;
  onAction: CommandActionHandler;
}) => {
  const [trackStatus, setTrackStatus] = useState<ListParams["filter"]>("idle");
  const addToPlaylistMatch = useMatch(
    "/pm-station/app/songrequests/editor/playlists/selectSong"
  );
  const playlistEditorMatch = useMatch(
    "/pm-station/app/songrequests/editor/playlists"
  );

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
    if (addToPlaylistMatch !== null) {
      AddTrackToPlaylist.preload();
    } else if (playlistEditorMatch !== null) {
      RemoveTrackFromPlaylist.preload();
    }
  }, [addToPlaylistMatch, playlistEditorMatch]);

  return (
    <div className="flex flex-row gap-4 justify-center md:justify-start pt-4 text-sm">
      {trackStatus === "idle" &&
      (playlistEditorMatch !== null || addToPlaylistMatch !== null) &&
      addToPlaylistMatch ? (
        <AddTrackToPlaylist track={track} onClose={onAction as any} />
      ) : (
        <RemoveTrackFromPlaylist track={track} onRemove={onAction} />
      )}
      <RejectButton trackStatus={trackStatus} setTrackStatus={setTrackStatus} />
    </div>
  );
};
export default AdminCommands;
