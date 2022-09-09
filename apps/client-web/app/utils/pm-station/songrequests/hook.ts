import { useEffect, useMemo } from "react";
import useSWRInfinite from "swr/infinite";
import { useFirebase } from "~/utils/firebase";
import type {
  QueryConstraint,
  QueryDocumentSnapshot,
  Timestamp,
  DocumentSnapshot,
} from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { getDocs } from "firebase/firestore";
import {
  collection,
  orderBy,
  query,
  startAfter,
  getFirestore,
  limit,
} from "firebase/firestore";
import { useOutletContext } from "@remix-run/react";
import type { SongRequestRecord } from "../spotify/select";
import { onIdTokenChanged } from "firebase/auth";
import type { ListParams, SongRequestSummary } from "./types";
import useSWR from "swr";

type WithTimestamp<T> = {
  [P in keyof T]: T[P] | Timestamp;
};

type Result<T extends Record<string, any>> = T & {
  __snapshot: QueryDocumentSnapshot;
};

const FETCH_LIMIT = 6;

const convertFirestoreData = <T extends Record<string, any>>(
  __snapshot: DocumentSnapshot
): Result<T> => {
  const data = __snapshot.data() as WithTimestamp<T>;
  return {
    __snapshot,
    ...data,
    lastUpdatedAt: (data.lastUpdatedAt as Timestamp).toDate().toISOString(),
  } as Result<T>;
};
export const useSongRequestSummary = () => {
  const { app, auth } = useFirebase("pm-station");
  const db = useMemo(() => getFirestore(app), [app]);
  const swr = useSWR<Result<SongRequestSummary>>(
    "/songrequests/summary",
    (key) => {
      return getDoc(doc(db, key)).then((v) =>
        convertFirestoreData<SongRequestSummary>(v)
      );
    },
    {
      revalidateOnMount: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      revalidateIfStale: false,
    }
  );
  const { mutate } = swr;
  useEffect(
    () =>
      onIdTokenChanged(auth, (user) => {
        mutate();
      }),
    [auth, mutate]
  );
  return swr;
};

export const useSongRequests = () => {
  const { order, sortBy } = useOutletContext<ListParams>();
  const { app, auth } = useFirebase("pm-station");

  const db = useMemo(() => getFirestore(app), [app]);
  const {
    data: _data,
    isValidating,
    size,
    mutate,
    ...swr
  } = useSWRInfinite<Array<Result<SongRequestRecord> | undefined>>(
    (
      pageIndex,
      previousPageData: Array<Result<SongRequestRecord> | undefined>
    ) => {
      if (previousPageData && !previousPageData.length) return null; // reached the end

      const params: ListParams = {
        order,
        sortBy,
        page: pageIndex,
      };
      return params;
    },
    async ({ order, sortBy, page }: ListParams) => {
      if (!auth.currentUser) throw new Error("Unauthorized");
      const startAfterRef =
        page &&
        _data &&
        _data[page - 1][_data[page - 1].length - 1]?.__snapshot;
      const constraints: QueryConstraint[] = [
        orderBy(sortBy, order),
        ...(sortBy !== "lastUpdatedAt"
          ? [orderBy("lastUpdatedAt", "asc")]
          : []),
        ...(startAfterRef ? [startAfter(startAfterRef)] : []),
        limit(FETCH_LIMIT),
      ];
      const q = query(collection(db, "songrequests"), ...constraints);
      const { docs } = await getDocs(q);
      return docs.map((__snapshot) => {
        if (__snapshot.id === "summary") return undefined;
        return convertFirestoreData<SongRequestRecord>(__snapshot);
      });
    },
    {
      initialSize: 1,
      revalidateOnMount: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      revalidateIfStale: false,
    }
  );
  const data = useMemo(
    () =>
      _data?.flat().filter((v) => Boolean(v)) as Result<SongRequestRecord>[],
    [_data]
  );

  const isEmpty = useMemo(() => _data?.[0].length === 0, [_data]);

  const isReachingEnd = useMemo(
    () => isEmpty || (_data && _data[_data.length - 1]?.length < FETCH_LIMIT),
    [isEmpty, _data]
  );
  const isRefreshing = useMemo(
    () => isValidating && _data && _data.length === size,
    [isValidating, size, _data]
  );

  useEffect(
    () =>
      onIdTokenChanged(auth, (user) => {
        mutate();
      }),
    [auth, mutate]
  );
  return {
    ...swr,
    data,
    isEmpty,
    isReachingEnd,
    isRefreshing,
    isValidating,
    size,
    mutate,
  };
};
