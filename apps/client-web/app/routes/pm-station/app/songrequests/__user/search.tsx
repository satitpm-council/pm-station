import type { ErrorBoundaryComponent, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { isString } from "shared/utils";
import type { TrackResponse } from "~/utils/pm-station/spotify/search";
import { searchTrack } from "~/utils/pm-station/spotify/index.server";
import loadable from "@loadable/component";
import { useState } from "react";
import { captureException } from "@sentry/remix";
import type { TrackModalProps } from "~/components/TrackModal";
import { TrackMeta } from "@station/client/songrequests";

const TrackModal = loadable<TrackModalProps>(() =>
  import("~/components/TrackModal").then((c) => c.SelectTrackModal)
);

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
            className="songrequest-item"
          >
            <div className="songrequest-wrapper md:w-[200px] xl:w-[250px]">
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
                <TrackMeta track={track} />
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
  captureException(error);
  return (
    <div className="flex flex-col">
      <h4>ไม่สามารถโหลดรายการเพลงได้</h4>
    </div>
  );
};
