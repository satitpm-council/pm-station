import { useFirebaseUser } from "~/utils/firebase";
import type { TypeOf } from "zod";
import { PlaylistRecord } from "~/schema/pm-station/playlists/schema";

import { isDocumentValid, useCollection } from "@lemasc/swr-firestore";
import { orderBy } from "@lemasc/swr-firestore/constraints";
import { zodValidator } from "../zodValidator";
import { useCallback, useMemo } from "react";

export const usePlaylists = () => {
  const user = useFirebaseUser();
  const swr = useCollection<TypeOf<typeof PlaylistRecord>>(
    user ? "playlists" : null,
    {
      constraints: [orderBy("queuedDate", "asc")],
    },
    {
      listen: true,
      validator: zodValidator(PlaylistRecord),
    }
  );

  const { map, set } = useMemo(() => {
    const set = new Set<string>();
    const map = new Map<string, number>();
    swr.data?.forEach((data, index) => {
      if (!isDocumentValid(data)) return;
      set.add(data.queuedDate.toDateString());
      map.set(data.queuedDate.toDateString(), index);
    });
    return { map, set };
  }, [swr.data]);

  const getRecordFromDate = useCallback(
    (date: Date) => {
      const record = swr.data?.[map.get(date.toDateString()) ?? -1];
      if (record && isDocumentValid(record)) {
        return record;
      }
      return record === null ? null : undefined;
    },
    [map, swr.data]
  );
  return { ...swr, getRecordFromDate, datesSet: set };
};
