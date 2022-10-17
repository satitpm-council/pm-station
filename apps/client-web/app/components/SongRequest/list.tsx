import type { SongRequestRecord } from "~/schema/pm-station/songrequests/types";
import TrackThumbnail from "../TrackThumbnail";
import { TrackMeta } from "./base";
import dayjs from "~/utils/dayjs";
import { Item } from "./item";
import type { ItemProps } from "./item";

export type ListProps = Omit<ItemProps, "track">;

export const SongRequestRecordList = ({
  data,
  ...props
}: {
  data?: SongRequestRecord[];
} & ListProps) => {
  return (
    <div className="flex flex-col md:flex-row md:flex-wrap gap-4 md:gap-8">
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
                <span>{dayjs(track.lastUpdatedAt).format("ll HH:mm น.")}</span>
                {track.lastPlayedAt?.valueOf?.() ? (
                  <span>
                    เล่นล่าสุดเมื่อ{" "}
                    {dayjs(track.lastPlayedAt).format("ll")}
                  </span>
                ) : null}
              </div>
            </Item>
          ))}
        </div>
      )}
    </div>
  );
};
