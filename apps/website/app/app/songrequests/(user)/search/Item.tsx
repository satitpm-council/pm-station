"use client";

import { songRequestModalStore } from "@/shared/modalStore";
import { TrackResponse } from "@/schema/songrequests";
import Image from "next/image";

export default function SongRequestItem({ track }: { track: TrackResponse }) {
  return (
    <button
      onClick={() => {
        songRequestModalStore.setState({ selectedTrack: track, show: true });
      }}
      className="md:flex justify-center bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors"
    >
      <div className="items-center md:items-baseline px-4 py-3 md:p-6 flex flex-row md:flex-col gap-4 md:w-[200px] xl:w-[250px]">
        <div className="basis-1/4 min-w-[85px]">
          <Image
            draggable={false}
            className="w-full h-auto rounded-lg"
            src={track.thumbnail_url ?? ""}
            width={track.thumbnail_width ?? 120}
            height={track.thumbnail_height ?? 120}
            alt={track.title ?? ""}
            title={`${track.title} - ${track.artists?.[0]}`}
            crossOrigin="anonymous"
          />
        </div>
        <div className="basis-3/4 text-gray-300 max-w-full text-sm flex flex-grow text-left flex-col items-start min-w-0 min-h-0 truncate">
          <b className="text-white text-base truncate min-w-0 w-full mb-1">
            {track.explicit && (
              <span
                title="Explict"
                className="text-sm bg-gray-500 text-white py-1 px-2 inline mr-2"
              >
                E
              </span>
            )}
            {track.title}
          </b>
          <span className="truncate min-w-0 w-full">
            {track.artists?.join("/")}
          </span>
        </div>
      </div>
    </button>
  );
}
