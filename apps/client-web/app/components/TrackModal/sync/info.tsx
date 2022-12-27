import { useMemo } from "react";
import dayjs from "shared/dayjs";
import type { TrackThumbnailProps } from "~/components/TrackThumbnail";
import TrackThumbnail from "~/components/TrackThumbnail";
import type { MusicInfo } from "~/utils/pm-station/ytmusic/types";
import { videoIdToURL } from "~/utils/pm-station/ytmusic/client";

export const MusicInfoComponent = ({ info }: { info: MusicInfo }) => {
  const streamPreview: TrackThumbnailProps["track"] | undefined = useMemo(
    () => ({
      albumImage: info.thumbnails.at(-1) as any,
      artists: info.artists.map((v) => v.id),
      name: info.title,
    }),
    [info]
  );

  return (
    <div className="flex gap-4 items-center">
      <TrackThumbnail
        track={streamPreview}
        className={{
          wrapper: "basis-1/4 max-w-[120px]",
          image: "w-full h-auto rounded-lg",
        }}
      />
      <div className="flex flex-col gap-0.5 text-sm">
        <b className="text-lg py-1">{info.title}</b>
        <span>{info.artists.map((v) => v.name).join("/")}</span>
        <span>
          {dayjs.duration(info.duration_seconds, "seconds").format("mm:ss")}
        </span>
        <a
          href={videoIdToURL(info.videoId)}
          title="View on YouTube"
          className="text-red-400 underline"
          target={"_blank"}
          rel="noreferrer noopener"
        >
          {videoIdToURL(info.videoId)}
        </a>
      </div>
    </div>
  );
};
