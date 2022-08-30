import type { ErrorBoundaryComponent, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { isString } from "~/utils/guards";
import type { TrackResponse } from "~/utils/pm-station/spotify/search";
import { searchTrack } from "~/utils/pm-station/spotify/index.server";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import loadable from "@loadable/component";
import { useState } from "react";

dayjs.extend(duration);

const TrackModal = loadable(() => import("~/components/TrackModal"));

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  if (isString(q)) {
    return json(await searchTrack(q));
  }
  return redirect("/pm-station/app/songrequests");
};

export default function TrackResults() {
  const [track, viewTrack] = useState<TrackResponse>();
  const tracks = useLoaderData<TrackResponse[]>();

  return (
    <>
      <TrackModal track={track} onClose={() => viewTrack(undefined)} />
      <span>เลือกรายการเพลงที่ต้องการส่งคำขอ</span>
      <div className="flex flex-col md:flex-row md:flex-wrap gap-4 md:gap-8">
        {tracks.map((track) => (
          <button
            onClick={() => viewTrack(track)}
            key={track.id}
            className="md:flex items-center justify-center bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 min-w-0 min-h-0 transition-colors"
          >
            <div className="items-center md:items-baseline px-4 py-2 md:p-6 flex flex-row md:flex-col gap-4 min-w-0 min-h-0 md:w-[200px] xl:w-[250px]">
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
                <span>{dayjs.duration(track.duration_ms).format("mm:ss")}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  console.error(error);
  return (
    <div className="flex flex-col">
      <h4>ไม่สามารถโหลดรายการเพลงได้</h4>
    </div>
  );
};
