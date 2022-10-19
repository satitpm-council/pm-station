import { useFirebaseUser } from "~/utils/firebase";
import type { TypeOf } from "zod";
import { PlaylistRecord } from "~/schema/pm-station/playlists/schema";

import { useCollection } from "@lemasc/swr-firestore";
import { orderBy } from "@lemasc/swr-firestore/constraints";
import { zodValidator } from "../zodValidator";

export const usePlaylists = () => {
  const user = useFirebaseUser();
  return useCollection<TypeOf<typeof PlaylistRecord>>(
    user ? "playlists" : null,
    {
      constraints: [orderBy("queuedDate", "asc")],
    },
    {
      listen: true,
      validator: zodValidator(PlaylistRecord),
    }
  );
};
