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
          selectedTrack: parsed.data,
          show: true,
        });
      }}
      className="md:flex justify-center bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors"
    >
      <div className="items-center md:items-baseline px-4 py-3 md:p-6 flex flex-row md:flex-col gap-4 md:w-[200px] xl:w-[250px]">
        <TrackThumbnail
          track={parsed.data}
          className={{
            wrapper: "basis-1/4 min-w-[85px]",
            image: "w-full h-auto rounded-lg",
          }}
        ></TrackThumbnail>
        <TrackMeta {...parsed} />
      </div>
    </button>
  );
}
