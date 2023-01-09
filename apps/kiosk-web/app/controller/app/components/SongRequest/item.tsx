import TrackThumbnail from "@station/client/TrackThumbnail";
import {
  TrackMeta,
  Item,
  getStatusFromDate,
} from "@station/client/songrequests";
import dayjs from "shared/dayjs";
import type { SongRequestSearchRecord } from "@station/shared/schema/types";

import type { ItemProps } from "@station/client/songrequests";

export const SongRequestRecordItem = <T extends SongRequestSearchRecord>({
  track,
  ...props
}: ItemProps<T>) => {
  return (
    <Item responsive={false} track={track} {...props}>
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
        <span>{dayjs(track.lastUpdatedAt).format("ll HH:mm น.")}</span>
        {getStatusFromDate(track.lastPlayedAt) === "played" ? (
          <span>เล่นล่าสุดเมื่อ {dayjs(track.lastPlayedAt).format("ll")}</span>
        ) : null}
      </div>
    </Item>
  );
};
