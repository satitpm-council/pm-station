import type { SongRequestRecord } from "~/schema/pm-station/songrequests/types";
import { useCallback, useMemo } from "react";
import type { ListParams } from "~/utils/pm-station/songrequests";
import { useSongRequests } from "~/utils/pm-station/songrequests";
import InfiniteScroll from "../InfiniteScroll";
import TrackThumbnail from "../TrackThumbnail";
import { TrackMeta } from "./base";
import dayjs from "~/utils/dayjs";

export type ItemProps = {
  track: SongRequestRecord;
  onItemClick: (track: SongRequestRecord) => void;
  children?: React.ReactNode | React.ReactNode[];
};

function Item({ track, onItemClick, children }: ItemProps) {
  return (
    <button
      onClick={() => onItemClick?.(track)}
      key={track?.id}
      className="w-full md:w-[unset] songrequest-item"
    >
      <div className="songrequest-wrapper md:w-[200px] xl:w-[250px]">
        {children}
      </div>
    </button>
  );
}

type BaseProps = ListParams &
  Omit<ItemProps, "track"> & {
    className?: string;
  };

export function AdminSongRequest({
  className = "flex flex-col md:flex-row md:flex-wrap gap-4 md:gap-8",
  filter,
  order,
  sortBy,
  children,
  ...props
}: BaseProps) {
  const context: ListParams = useMemo(
    () => ({ filter, order, sortBy }),
    [filter, order, sortBy]
  );
  const { data, setSize, error, isReachingEnd, isRefreshing } =
    useSongRequests(context);
  const onFetch = useCallback(() => setSize((size) => size + 1), [setSize]);
  error && console.error(error);
  return (
    <>
      <div className={className}>
        {data && (
          <div className="flex flex-row flex-wrap gap-4">
            {data.map((track) => (
              <Item key={track.id} track={track} {...props}>
                <TrackThumbnail
                  track={track}
                  className={{
                    wrapper: "basis-1/4 min-w-[85px] relative",
                    image: "w-full h-auto rounded-lg",
                    badge:
                      "bg-yellow-400 text-gray-900 font-medium px-4 py-2 bottom-1 left-1 md:bottom-2 md:left-2",
                  }}
                  badge={{
                    title: `จำนวนผู้ส่งคำขอ ${track.submissionCount} คน`,
                  }}
                >
                  {track.submissionCount !== 1 && track.submissionCount}
                </TrackThumbnail>
                <div className="basis-3/4 text-gray-300 max-w-full text-sm flex flex-grow text-left flex-col items-start min-w-0 min-h-0 truncate">
                  <TrackMeta track={track} />
                  <span>
                    {dayjs(track.lastUpdatedAt).format("LL HH:mm น.")}
                  </span>
                </div>
              </Item>
            ))}
          </div>
        )}
      </div>

      <InfiniteScroll
        isReachingEnd={isReachingEnd}
        isRefreshing={isRefreshing}
        onFetch={onFetch}
      />
    </>
  );
}
