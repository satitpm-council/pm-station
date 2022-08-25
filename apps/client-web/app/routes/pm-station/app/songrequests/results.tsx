import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { isString } from "~/utils/guards";
import { searchTrack, TrackResponse } from "~/utils/spotify/search";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  if (isString(q)) {
    try {
      return json(await searchTrack(q));
    } catch (err) {
      console.error(err);
      return json({ success: false }, 500);
    }
  }
  return json({ success: false }, 400);
};

export default function TrackResults() {
  const tracks = useLoaderData() as TrackResponse[];
  return (
    <div className="flex flex-col w-full divide-y">
      {tracks.map((track) => (
        <div
          key={track.id}
          className="px-4 py-2 bg-gray-100 flex flex-row gap-4 min-w-0 min-h-0"
        >
          <div className="flex-shrink-0">
            <div>
              <img
                src={track.albumImages.at(-1)?.url}
                height={track.albumImages.at(-1)?.height}
                width={track.albumImages.at(-1)?.width}
                alt={track.name}
              />
            </div>
          </div>
          <div className="flex flex-grow text-left flex-col items-start min-w-0 min-h-0 truncate">
            <b className="truncate min-w-0 w-full max-w-[70vw]">
              {track.explicit && (
                <span className="text-sm rounded bg-gray-400 text-white py-1 px-2 inline mr-2">
                  E
                </span>
              )}
              {track.name}
            </b>

            <span>{track.artists.join("/")}</span>
            <span>{dayjs.duration(track.duration_ms).format("mm:ss")}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
