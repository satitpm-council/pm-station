import { useFirebaseUser } from "@station/client/firebase";
import type { TypeOf } from "zod";
import { PlaylistRecord } from "@station/shared/schema";

import { isDocumentValid, useCollection } from "@lemasc/swr-firestore";
import { orderBy, where } from "@lemasc/swr-firestore/constraints";
import { zodValidator } from "shared/utils";
import { useCallback, useMemo } from "react";
import { isEditorClaims, useUser } from "../client";
import { documentId } from "firebase/firestore";

export const usePlaylists = () => {
  const { user } = useUser();
  const firebaseUser = useFirebaseUser();
  const swr = useCollection<TypeOf<typeof PlaylistRecord>>(
    firebaseUser ? "playlists" : null,
    {
      constraints: [
        ...(isEditorClaims(user)
          ? [where("target", "==", user?.programId ?? "")]
          : []),
        orderBy("queuedDate", "asc"),
        // editor users can only see their own playlists
      ],
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
