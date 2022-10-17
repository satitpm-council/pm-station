import { useCallback, useMemo } from "react";
import type { ListParams } from "~/utils/pm-station/songrequests";
import { useSongRequests } from "~/utils/pm-station/songrequests";
import InfiniteScroll from "../InfiniteScroll";
import { SongRequestRecordList } from "./list";
import type { ListProps } from "./list";

type BaseProps = ListParams & ListProps;

export function AdminSongRequest({
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
      <SongRequestRecordList data={data} {...props} />
      <InfiniteScroll
        isReachingEnd={isReachingEnd}
        isRefreshing={isRefreshing}
        onFetch={onFetch}
      />
    </>
  );
}
