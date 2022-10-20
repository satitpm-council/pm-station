import { useMemo } from "react";
import loadable from "@loadable/component";
import { useDocument, isDocumentValid } from "@lemasc/swr-firestore";
import dayjs from "dayjs";
import type { TypeOf } from "zod";

import algoliasearch from "algoliasearch/lite";
import { Configure, useInfiniteHits } from "react-instantsearch-hooks-web";
import { InstantSearch, SearchBox } from "react-instantsearch-hooks-web";
import { SongRequestSearchRecord } from "~/schema/pm-station/songrequests/schema";

import InfiniteScroll from "../InfiniteScroll";
import { SongRequestRecordList } from "./list";
import type { ListProps } from "./list";
import { SortOptions } from "./admin/sort";
import type { CustomLabelComponent } from "./admin/RefinementList";
import RefinementList from "./admin/RefinementList";

import { zodValidator } from "~/utils/pm-station/zodValidator";
import { PlaylistRecord } from "~/schema/pm-station/playlists/schema";

const Stats = loadable(() => import("./admin/Stats"), {
  ssr: false,
});

if (
  !process.env.PM_STATION_ALGOLIA_APP_ID ||
  !process.env.PM_STATION_ALGOLIA_API_KEY
) {
  throw new Error("Cannot initialize Algolia, env not found.");
}

const searchClient = algoliasearch(
  process.env.PM_STATION_ALGOLIA_APP_ID,
  process.env.PM_STATION_ALGOLIA_API_KEY
);

const CustomHits = (props: ListProps) => {
  const { hits, showMore, isLastPage, results } = useInfiniteHits();
  const data = useMemo(
    () =>
      hits
        .map((item) => {
          const parsed = SongRequestSearchRecord.safeParse(item);
          if (parsed.success) return parsed.data;
          return undefined;
        })
        .filter(
          (p): p is TypeOf<typeof SongRequestSearchRecord> => p !== undefined
        ),
    [hits]
  );
  return (
    <>
      <SongRequestRecordList data={data} {...props} />
      <InfiniteScroll
        onFetch={showMore}
        isReachingEnd={!results?.__isArtificial && isLastPage}
        isRefreshing={results === undefined}
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
    <InstantSearch searchClient={searchClient} indexName="station_songrequests">
      <Configure hitsPerPage={10} />
      <div className="flex flex-row gap-4 flex-wrap text-sm max-w-6xl">
        <SortOptions />
        <SearchBox
          classNames={{
            form: "flex flex-row gap-3",
            input: "pm-station-input text-sm",
            submit: "rounded px-3 py-2 bg-green-500 hover:bg-green-600",
          }}
          placeholder="ค้นหา..."
        />
        <Stats />
      </div>
      <div className="flex flex-row items-start gap-6">
        <div className="flex flex-col w-full max-w-[15rem] divide-y divide-gray-400">
          <RefinementList title="จำนวนคำขอเพลง" attribute="submissionCount" />
          <RefinementList title="ศิลปิน" attribute="artists" searchable />{" "}
          <RefinementList
            title="รายการเพลง"
            attribute="playlistId"
            CustomLabel={PlaylistCustomLabel}
          />
        </div>
        <div className="flex-grow flex flex-col gap-4">
          <CustomHits {...props} />
        </div>
      </div>
    </InstantSearch>
  );
}
