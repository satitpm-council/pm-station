import { useMemo } from "react";
import loadable from "@loadable/component";
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
import { FilterOptions, SortOptions } from "./admin/sort";
import RefinementsPanel from "./admin/RefinementsPanel";
import type { CustomLabelComponent } from "./admin/RefinementList";
import RefinementList from "./admin/RefinementList";

import { zodValidator } from "~/utils/pm-station/zodValidator";
import { PlaylistRecord } from "~/schema/pm-station/playlists/schema";

const Stats = loadable(() => import("./admin/Stats"), {
  ssr: false,
});

const CustomHits = (props: ListProps) => {
  const { status } = useInstantSearch();
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
      {data && data.length > 0 && (
        <SongRequestRecordList data={data} {...props} />
      )}
      <InfiniteScroll
        onFetch={showMore}
        isReachingEnd={!results?.__isArtificial && isLastPage}
        isRefreshing={status === "loading"}
        isEmpty={results?.nbHits === 0}
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
