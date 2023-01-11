import { FetchHookOptions, useDocument } from "@lemasc/swr-firestore";
import { TypeOf } from "zod";
import { PlaylistRecord } from "@station/shared/schema";
import { zodValidator } from "shared/utils";
import { SWRConfiguration } from "swr";

export const usePlaylist = (
  playlistId?: string,
  config: FetchHookOptions<TypeOf<typeof PlaylistRecord>> &
    SWRConfiguration = {}
) => {
  return useDocument<TypeOf<typeof PlaylistRecord>>(
    playlistId ? `playlists/${playlistId}` : null,
    {
      ...config,
      validator: zodValidator(PlaylistRecord),
    }
  );
};
