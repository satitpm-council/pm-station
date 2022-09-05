import { captureException } from "@sentry/remix";
import { useEffect, useRef } from "react";
import { useInViewport } from "react-in-viewport";
import dayjs from "~/utils/dayjs";

import { useSongRequests } from "~/utils/pm-station/songrequests";

export default function ListSongRequestComponent() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { inViewport } = useInViewport(ref);

  const { data, error, setSize, isReachingEnd, size, isRefreshing } =
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
      {data && (
        <div className="flex flex-row flex-wrap gap-4">
          {data.map((track) => (
            <button
              key={track?.id}
              className="w-full md:w-[unset] md:flex items-center justify-center bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 min-w-0 min-h-0 transition-colors"
            >
              <div className="items-center md:items-baseline px-4 py-3 md:p-6 flex flex-row md:flex-col gap-4 min-w-0 min-h-0 md:w-[200px] xl:w-[250px]">
                <div className="basis-1/4 min-w-[85px]">
                  <img
                    draggable={false}
                    className="w-full h-auto rounded-lg"
                    src={track.albumImage?.url}
                    alt={track.name}
                    title={`${track.name} - ${track.artists[0]}`}
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
