import TrackThumbnail from "@station/client/TrackThumbnail";
import {
  TrackMeta,
  Item,
  getStatusFromDate,
} from "@station/client/songrequests";
import dayjs from "shared/dayjs";
import type { SongRequestRecord } from "@station/shared/schema/types";

import type { ItemProps } from "@station/client/songrequests";

export const MiniPlayerItem = ({
  track,
  ...props
}: Omit<ItemProps<SongRequestRecord>, "onItemClick">) => {
  return (
    <div className="flex flex-row items-center gap-4 min-w-0 min-h-0">
      <TrackThumbnail
        track={track}
        className={{
          wrapper: "basis-1/4 max-w-[150px] relative",
          image: "w-full h-auto rounded",
        }}
      />
      <div className="basis-3/4 text-gray-300 max-w-full text-sm flex flex-grow text-left flex-col items-start min-w-0 min-h-0 truncate">
        <TrackMeta track={{ ...track, duration_ms: undefined }} />
      </div>
    </div>
  );
};
