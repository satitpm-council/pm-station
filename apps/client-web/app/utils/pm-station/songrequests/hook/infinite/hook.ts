import { useEffect, useMemo } from "react";
import useSWRInfinite from "swr/infinite";
import { useFirebaseUser } from "~/utils/firebase";
import { getCollection, isDocumentValid } from "@lemasc/swr-firestore";
import type { QueryConstraint, Document } from "@lemasc/swr-firestore";
import { orderBy, startAfter, limit } from "@lemasc/swr-firestore/constraints";

import { SongRequestRecord } from "~/schema/pm-station/songrequests/schema";
import type { ListParams } from "../../types";
import { zodValidator } from "../../../zodValidator";
import { getKey } from "./key";
import type { TypeOf } from "zod";
import { getLastPlayedAtFromFilter } from "./filter";

const FETCH_LIMIT = 6;
type Record = TypeOf<typeof SongRequestRecord>;

export const useSongRequests = (params: ListParams) => {
  const context: ListParams = useMemo(() => params, [params]);

  const user = useFirebaseUser();
  const {
    data: _data,
    isValidating,
    size,
    mutate,
    ...swr
  } = useSWRInfinite<Array<Document<Record>>>(
    getKey({ user, context }),
    async (key: string, { order, sortBy, page, filter }: ListParams) => {
      const startAfterRef =
        page && _data
          ? _data[page - 1][_data[page - 1].length - 1]?.__snapshot
          : undefined;
      const constraints: QueryConstraint<Record>[] = [
        ...getLastPlayedAtFromFilter(filter),
        orderBy(sortBy, order),
        ...(sortBy !== "lastUpdatedAt"
          ? [orderBy("lastUpdatedAt", "asc")]
          : []),
        ...(startAfterRef ? [startAfter(startAfterRef)] : []),
        limit(FETCH_LIMIT),
      ];
      return await getCollection(
        key,
        { constraints },
        {
          ignoreFirestoreDocumentSnapshotField: false,
          validator: zodValidator(SongRequestRecord),
        }
      );
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

  const data = useMemo(() => _data?.flat().filter(isDocumentValid), [_data]);

  const isEmpty = useMemo(() => _data?.[0].length === 0, [_data]);

  const isReachingEnd = useMemo(
    () => isEmpty || (_data && _data[_data.length - 1]?.length < FETCH_LIMIT),
    [isEmpty, _data]
  );
  const isRefreshing = useMemo(
    () => isValidating && _data && _data.length === size,
    [isValidating, size, _data]
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
