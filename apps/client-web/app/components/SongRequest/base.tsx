import { useMemo } from "react";
import dayjs from "~/utils/dayjs";
import { TrackResponse } from "@station/shared/schema";
import type { SongRequestSearchRecord } from "@station/shared/schema/types";
import type { TypeOf } from "zod";

export function TrackMeta({
  track,
}: {
  track: SongRequestSearchRecord | TypeOf<typeof TrackResponse>;
}) {
  const trackResponse = useMemo(() => {
    try {
      return TrackResponse.parse(track);
    } catch {
      return undefined;
    }
  }, [track]);
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
      <span>
        {trackResponse &&
          dayjs.duration(trackResponse.duration_ms).format("mm:ss")}
      </span>
    </>
  );
}
