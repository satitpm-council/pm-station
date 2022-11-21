import type { ValidatedDocument } from "@lemasc/swr-firestore";
import axios from "axios";
import { useMemo } from "react";
import useSWR from "swr/immutable";
import type { Program } from "~/schema/pm-station/programs/types";
import type { SongRequestRecord } from "~/schema/pm-station/songrequests/types";
import type { DriveFile } from ".";
import type { PlaylistSyncParam } from "../api-types";
import { usePlaylistData } from "../playlists/data";
import { usePrograms } from "../programs";

export type SongRequestRecordWithSync = SongRequestRecord & {
  sync?: DriveFile;
};

export const usePlaylistWithDriveSync = () => {
  const { data: programs } = usePrograms();
  const { playlist, tracks } = usePlaylistData();
  const currentProgram = useMemo(
    () =>
      playlist?.target
        ? programs?.find(
            (p): p is ValidatedDocument<Program> =>
              p.id === playlist.target && p.validated
          )
        : undefined,
    [playlist?.target, programs]
  );
  const { data: driveSync } = useSWR(
    ["/sync", currentProgram?.playlistsDriveId, playlist?.queuedDate],
    async (endpoint, folderId, queuedDate) => {
      if (!folderId || !queuedDate) return null;
      const params: PlaylistSyncParam = {
        folderId,
        date: `${queuedDate.getDate()}.${queuedDate.getMonth() + 1}`,
      };
      const fileMap = new Map<string, DriveFile>();
      const { data } = await axios.get<DriveFile[]>(
        `/pm-station/app/songrequests/playlists${endpoint}`,
        {
          params,
        }
      );
      const uncategorized = data.filter((v) => {
        const trackId = v.appProperties?.trackId;
        if (trackId) {
          fileMap.set(trackId, v);
          return false;
        }
        return true;
      });
      return { uncategorized, fileMap };
    }
  );

  const syncedTracks = useMemo(
    () =>
      tracks?.map<SongRequestRecordWithSync>((v) => {
        if (v.id && driveSync?.fileMap.has(v.id)) {
          return {
            ...v,
            sync: driveSync?.fileMap.get(v.id),
          };
        }
        return v;
      }),
    [driveSync, tracks]
  );
  return {
    playlist,
    tracks: syncedTracks,
    uncategorized: driveSync?.uncategorized,
  };
};
