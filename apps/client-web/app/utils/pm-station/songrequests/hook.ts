import { useEffect, useMemo } from "react";
import useSWRInfinite from "swr/infinite";
import { useFirebase } from "~/utils/firebase";
import type { QueryConstraint } from "firebase/firestore";
import { where } from "firebase/firestore";
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
import {
  SongRequestRecord,
  SongRequestSummary,
} from "~/schema/pm-station/songrequests/schema";
import { onIdTokenChanged } from "firebase/auth";
import type { ListParams } from "./types";
import useSWR from "swr";
import type { TypeOf } from "zod";
import { ZodError } from "zod";
import type { Result } from "./result";
import { convertFirestoreData } from "./result";

const FETCH_LIMIT = 6;

const getLastPlayedAtFromFilter = (
  filter: ListParams["filter"]
): QueryConstraint[] => {
  if (filter === "idle") return [where("lastPlayedAt", "==", null)];
  if (filter === "played" || filter === "rejected") {
    return [
      where("lastPlayedAt", filter === "played" ? ">=" : "==", new Date(0)),
      orderBy("lastPlayedAt", "asc"),
    ];
  }
  return [];
};

export const useSongRequestSummary = () => {
  const { app, auth } = useFirebase("pm-station");
  const db = useMemo(() => getFirestore(app), [app]);
  const swr = useSWR(
    "/songrequests/summary",
    (key) => {
      return getDoc(doc(db, key)).then((v) =>
        convertFirestoreData<typeof SongRequestSummary>(v, SongRequestSummary)
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
  const context = useOutletContext<ListParams>();
  const { app, auth } = useFirebase("pm-station");

  const db = useMemo(() => getFirestore(app), [app]);
  const {
    data: _data,
    isValidating,
    size,
    mutate,
    ...swr
  } = useSWRInfinite<
    Array<Result<TypeOf<typeof SongRequestRecord>> | undefined>
  >(
    (pageIndex, previousPageData) => {
      if (previousPageData && !previousPageData.length) return null; // reached the end
      const { order, sortBy, filter } = context;
      const params: ListParams = {
        order,
        sortBy,
        page: pageIndex,
        filter,
      };
      return params;
    },
    async ({ order, sortBy, page, filter }: ListParams) => {
      if (!auth.currentUser) throw new Error("Unauthorized");
      const startAfterRef =
        page &&
        _data &&
        _data[page - 1][_data[page - 1].length - 1]?.__snapshot;
      const constraints: QueryConstraint[] = [
        ...getLastPlayedAtFromFilter(filter),
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
        try {
          const converted = convertFirestoreData<typeof SongRequestRecord>(
            __snapshot,
            SongRequestRecord
          );
          return converted;
        } catch (err) {
          console.error(err);
          if (err instanceof ZodError) {
            return undefined;
          }
          throw err;
        }
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

  useEffect(() => {
    mutate();
  }, [context, mutate]);

  const data = useMemo(
    () =>
      _data?.flat().filter((v) => Boolean(v)) as Result<
        TypeOf<typeof SongRequestRecord>
      >[],
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
