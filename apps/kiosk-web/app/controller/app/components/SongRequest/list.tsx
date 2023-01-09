import type { SongRequestSearchRecord } from "@station/shared/schema/types";
import type { ItemProps } from "@station/client/songrequests";
import { SongRequestRecordItem } from "./item";

export type ListProps<
  T extends SongRequestSearchRecord = SongRequestSearchRecord
> = Omit<ItemProps<T>, "track">;

export const SongRequestRecordList = <T extends SongRequestSearchRecord>({
  data,
  ...props
}: {
  data?: T[];
} & ListProps<T>) => {
  return (
    <div className="songrequest-container overflow-auto flex flex-col gap-4 md:flex-row md:flex-wrap md:gap-8">
      {data && (
        <div className="flex flex-row flex-wrap divide-y divide-gray-500">
          {data.map((track) => (
            <SongRequestRecordItem key={track.id} track={track} {...props} />
          ))}
        </div>
      )}
    </div>
  );
};
