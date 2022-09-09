import { captureException } from "@sentry/remix";
import { useEffect, useRef, useState } from "react";
import { useInViewport } from "react-in-viewport";
import TrackThumbnail from "~/components/TrackThumbnail";
import dayjs from "~/utils/dayjs";

import { useSongRequests } from "~/utils/pm-station/songrequests";
import type { ApproveTrackModalProps } from "~/components/TrackModal";

import loadable from "@loadable/component";
import type { SongRequestRecord } from "~/utils/pm-station/spotify/select";

const TrackModal = loadable<ApproveTrackModalProps>(() =>
  import("~/components/TrackModal").then((c) => c.ApproveTrackModal)
);

export default function ListSongRequestComponent() {
  const [track, viewTrack] = useState<SongRequestRecord>();
  const ref = useRef<HTMLDivElement | null>(null);
  const { inViewport } = useInViewport(ref);

  const { data, error, setSize, isReachingEnd, isRefreshing } =
    useSongRequests();

  useEffect(() => {
    if (error) {
      console.error(error);
      captureException(error);
    }
  }, [error]);

  const isInitial = useRef<boolean>(false);
  useEffect(() => {
    if (isReachingEnd === undefined || isReachingEnd === undefined) return;
    if (!isInitial.current) {
      isInitial.current = true;
      return;
    }
    if (inViewport && !isReachingEnd && !isRefreshing) {
      setSize((size) => size + 1);
    }
  }, [inViewport, isRefreshing, isReachingEnd, setSize]);

  return (
    <>
      <TrackModal track={track} onClose={() => viewTrack(undefined)} />
      {data && (
        <div className="flex flex-row flex-wrap gap-4">
          {data.map((track) => (
            <button
              onClick={() => viewTrack(track)}
              key={track?.id}
              className="w-full md:w-[unset] md:flex items-center justify-center bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 min-w-0 min-h-0 transition-colors"
            >
              <div className="items-center md:items-baseline px-4 py-3 md:p-6 flex flex-row md:flex-col gap-4 min-w-0 min-h-0 md:w-[200px] xl:w-[250px]">
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
                  <b className="text-white text-base truncate min-w-0 w-full mb-1">
                    {track.explicit && (
                      <span
                        title="Explict"
                        className="text-sm bg-gray-500 text-white py-1 px-2 inline mr-2"
                      >
                        E
                      </span>
                    )}
                    {track.name}
                  </b>

                  <span className="truncate min-w-0 w-full">
                    {track.artists.join("/")}
                  </span>
                  <span>
                    {dayjs.duration(track.duration_ms).format("mm:ss")}
                  </span>
                  <span>
                    {dayjs(track.lastUpdatedAt).format("LL HH:mm น.")}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <div ref={ref} className="w-full">
        {isReachingEnd ? "ข้อมูลแสดงครบแล้ว" : "กำลังโหลด..."}
      </div>
    </>
  );
}
