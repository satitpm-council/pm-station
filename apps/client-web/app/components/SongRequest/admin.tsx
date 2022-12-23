import { useCallback, useEffect, useRef, useState } from "react";
import loadable from "@loadable/component";
import { useSWRConfig } from "swr";
import { useDocument, isDocumentValid } from "@lemasc/swr-firestore";
import dayjs from "dayjs";
import type { TypeOf } from "zod";

import {
  Configure,
  useInfiniteHits,
  useInstantSearch,
} from "react-instantsearch-hooks-web";
import { SearchBox } from "react-instantsearch-hooks-web";
import { SongRequestSearchRecord } from "~/schema/pm-station/songrequests/schema";

import InfiniteScroll from "../InfiniteScroll";
import { SongRequestRecordList } from "./list";
import type { ListProps } from "./list";
import { SongRequestListStore } from "./admin/store";
import { FilterOptions, SortOptions } from "./admin/sort";
import type { CustomLabelComponent } from "./admin/components";
import {
  RefinementsPanel,
  RefinementList,
  RefreshButton,
} from "./admin/components";

import { zodValidator } from "~/utils/pm-station/zodValidator";
import { getStatusFromDate } from "~/utils/pm-station/songrequests";
import { PlaylistRecord } from "~/schema/pm-station/playlists/schema";

const Stats = loadable(() => import("./admin/Stats"), {
  ssr: false,
});

const CustomHits = (props: ListProps) => {
  const { cache } = useSWRConfig();
  const { status } = useInstantSearch();
  const { hits, showMore, isLastPage, results } = useInfiniteHits();

  const cachedRecords = useRef<
    Map<string, TypeOf<typeof SongRequestSearchRecord>>
  >(new Map());

  const isRefreshing = useRef(false);
  const [data, setData] = useState<TypeOf<typeof SongRequestSearchRecord>[]>(
    []
  );

  const processData = useCallback(() => {
    isRefreshing.current = true;
    const { firestoreRecords, filterStatus } = SongRequestListStore.getState();
    let data = hits
      .map((item) => {
        if (firestoreRecords.has(item.objectID)) {
          // Firestore record found. Load from SWR cache.
          const swrRecord = cache.get(`songrequests/${item.objectID}`);
          if (swrRecord) {
            return swrRecord;
          }
        }
        // Get the cached parsed record.
        const record = cachedRecords.current.get(item.objectID);
        if (record) return record;
        // Parse Algolia hit into search record, and save it to cache.
        const parsed = SongRequestSearchRecord.safeParse(item);
        if (parsed.success) {
          cachedRecords.current.set(item.objectID, parsed.data);
          return parsed.data;
        } else if (process.env.NODE_ENV === "development") {
          console.warn(
            `Warning: Document ID ${item.id} from Algolia not passing the defined schema`,
            item,
            parsed.error
          );
        }
        return undefined;
      })
      .filter(
        (p): p is TypeOf<typeof SongRequestSearchRecord> => p !== undefined
      );

    if (filterStatus !== "all") {
      // filter dates cause sometimes Algolia returns staled data.
      data = data.filter(
        (v) => getStatusFromDate(v.lastPlayedAt) === filterStatus
      );
    }
    setData(data);
  }, [cache, hits]);

  useEffect(() => {
    isRefreshing.current = false;
    SongRequestListStore.setState({ refresh: undefined });
  }, [data]);

  useEffect(() => {
    processData();
    return SongRequestListStore.subscribe((state, prev) => {
      if (
        (state.firestoreRecords.size !== prev.firestoreRecords.size ||
          state.refresh) &&
        !isRefreshing.current
      ) {
        processData();
      }
    });
  }, [processData]);

  return (
    <>
      {data && data.length > 0 && (
        <SongRequestRecordList data={data} {...props} />
      )}
      <InfiniteScroll
        onFetch={showMore}
        isReachingEnd={isLastPage}
        isRefreshing={status === "loading"}
        isEmpty={!results?.__isArtificial && results?.nbHits === 0}
      />
    </>
  );
};

const PlaylistCustomLabel: CustomLabelComponent = ({ value: path }) => {
  const { data } = useDocument(path, {
    validator: zodValidator(PlaylistRecord),
  });
  if (data && isDocumentValid(data)) {
    return <>{dayjs(data.queuedDate).format("DD/MM/YYYY")}</>;
  }
  return <></>;
};

export function AdminSongRequest(props: ListProps) {
  return (
    <>
      <Configure hitsPerPage={10} />
      <div className="flex flex-row gap-4 flex-wrap text-sm max-w-6xl">
        <SortOptions />
        <FilterOptions />
        <RefreshButton />
        <SearchBox
          classNames={{
            form: "flex flex-row gap-3",
            input: "pm-station-input text-sm",
            submit: "rounded px-3 py-2 bg-green-500 hover:bg-green-600",
          }}
          placeholder="ค้นหา..."
        />
      </div>
      <div className="flex flex-col lg:flex-row items-start gap-4 sm:gap-8">
        <aside className="flex flex-row items-center justify-center lg:items-start gap-4 lg:gap-0 lg:flex-col">
          <Stats />
          <RefinementsPanel>
            <RefinementList title="จำนวนคำขอเพลง" attribute="submissionCount" />
            <RefinementList title="ศิลปิน" attribute="artists" searchable />
            <RefinementList
              title="รายการเพลง"
              attribute="playlistId"
              CustomLabel={PlaylistCustomLabel}
            />
          </RefinementsPanel>
        </aside>
        <div className="flex-grow flex flex-col gap-4 max-w-[85vw] sm:max-w-[unset]">
          <CustomHits {...props} />
        </div>
      </div>
    </>
  );
}
