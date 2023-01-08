import { useMemo } from "react";
import {
  isDocumentValid,
  useCollection,
  useDocument,
} from "@lemasc/swr-firestore";
import { where } from "@lemasc/swr-firestore/constraints";
import { doc } from "firebase/firestore";
import { useFirebase } from "@station/client/firebase";

import type { TypeOf } from "zod";
import { zodValidator } from "shared/utils";
import { PlaylistRecord } from "@station/shared/schema";
import { SongRequestRecord } from "@station/shared/schema";

export const usePlaylistData = (playlistId?: string, listen = false) => {
  const { data: playlistData } = useDocument(
    playlistId ? `playlists/${playlistId}` : null,
    { validator: zodValidator(PlaylistRecord) }
  );
  const { db } = useFirebase();
  const { data } = useCollection<TypeOf<typeof SongRequestRecord>>(
    playlistId ? "songrequests" : null,
    {
      constraints: playlistId
        ? [
            where(
              "playlistId",
              "array-contains",
              doc(db, `/playlists/${playlistId}`)
            ),
          ]
        : [],
    },
    {
      validator: zodValidator(SongRequestRecord),
      listen,
    }
  );

  const tracks = useMemo(() => data?.filter(isDocumentValid), [data]);
  const playlist = useMemo(
    () => (playlistData && isDocumentValid(playlistData) ? playlistData : null),
    [playlistData]
  );

  return {
    tracks,
    playlist,
  };
};
