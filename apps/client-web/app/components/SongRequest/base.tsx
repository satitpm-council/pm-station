import type { TrackResponse } from "~/schema/pm-station/songrequests/types";
import dayjs from "~/utils/dayjs";

export function TrackMeta({ track }: { track: TrackResponse }) {
  return (
    <>
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

      <span className="truncate min-w-0 w-full">{track.artists.join("/")}</span>
      <span>{dayjs.duration(track.duration_ms).format("mm:ss")}</span>
    </>
  );
}
