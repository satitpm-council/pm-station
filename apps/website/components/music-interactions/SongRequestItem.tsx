"use client";

import { songRequestModalStore } from "@/shared/modalStore";
import { TrackThumbnail } from "./TrackThumbnail";
import { TrackMeta } from "./TrackMeta";
import { parseMetadata, TrackOrSongRequest } from "./parse";

export function SongRequestItem({ data }: { data: TrackOrSongRequest }) {
  const parsed = parseMetadata(data);
  return (
    <button
      onClick={() => {
        songRequestModalStore.setState({
          selected: parsed,
          show: true,
        });
      }}
      className="md:flex justify-center bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors"
    >
      <div className="items-center md:items-baseline px-4 py-3 md:p-6 flex flex-row md:flex-col gap-4 md:w-[200px] xl:w-[250px]">
        <TrackThumbnail
          track={parsed.data}
          className={{
            wrapper: "basis-1/4 min-w-[85px] relative",
            image: "w-full h-auto rounded-lg",
            ...(parsed.type === "record"
              ? {
                  badge:
                    "bg-yellow-400 text-gray-900 font-medium px-4 py-2 bottom-1 left-1 md:bottom-2 md:left-2",
                }
              : {}),
          }}
          badge={
            parsed.type === "record"
              ? {
                  title: `จำนวนผู้ส่งคำขอ ${parsed.data.submissionCount} คน`,
                }
              : undefined
          }
        >
          {parsed.type === "record" &&
            parsed.data.submissionCount !== 1 &&
            parsed.data.submissionCount}
        </TrackThumbnail>
        <TrackMeta {...parsed} />
      </div>
    </button>
  );
}
