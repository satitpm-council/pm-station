import dayjs from "@/shared/dayjs";
import { ParsedTrackMetadata } from "./parse";

export function TrackMeta(meta: ParsedTrackMetadata) {
  return (
    <div className="basis-3/4 text-gray-300 max-w-full text-sm flex flex-grow text-left flex-col items-start min-w-0 min-h-0 truncate">
      <b className="text-white text-base truncate min-w-0 w-full mb-1">
        {meta.data.explicit && (
          <span
            title="Explict"
            className="text-sm bg-gray-500 text-white py-1 px-2 inline mr-2"
          >
            E
          </span>
        )}
        {meta.data.title}
      </b>
      <span className="truncate min-w-0 w-full">
        {meta.data.artists?.join("/")}
      </span>
      {meta.type === "record" && (
        <span>{dayjs(meta.metadata.updatedAt).format("ll HH:mm น.")}</span>
      )}
    </div>
  );
}
