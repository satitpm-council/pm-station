import { useEffect, useRef, useState } from "react";
import type { TrackResponse } from "~/utils/pm-station/spotify/search";
import TrackThumbnail from "../TrackThumbnail";
import { PlayIcon, PauseIcon } from "@heroicons/react/20/solid";

export function MusicPreview({
  canPlay,
  track,
  className,
}: {
  canPlay: boolean;
  track?: TrackResponse;
  className: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioInstance = useRef<HTMLAudioElement>();

  useEffect(() => {
    if (!canPlay && audioInstance.current) {
      audioInstance.current.pause();
      audioInstance.current = undefined;
    }
  }, [canPlay]);

  const onClick = () => {
    if (!track?.preview_url) return;
    if (
      !audioInstance.current ||
      audioInstance.current.src !== track.preview_url
    ) {
      // construct a new one;
      audioInstance.current = new Audio(track.preview_url as string);
      audioInstance.current.addEventListener("play", () => setIsPlaying(true));
      audioInstance.current.addEventListener("pause", () =>
        setIsPlaying(false)
      );
      audioInstance.current.addEventListener("ended", () =>
        setIsPlaying(false)
      );
    }
    if (audioInstance.current.paused || audioInstance.current.ended) {
      audioInstance.current.play();
    } else {
      audioInstance.current.pause();
    }
  };
  return (
    <TrackThumbnail
      track={track as TrackResponse}
      className={{
        wrapper: className,
        badge: "bg-green-500 md:bottom-4 md:right-4 right-2 bottom-2",
      }}
      badge={{
        onClick,
        title: "เล่นตัวอย่างเพลง",
      }}
    >
      {track?.preview_url &&
        (isPlaying ? (
          <PauseIcon className="h-5 w-5" />
        ) : (
          <PlayIcon className="h-5 w-5" />
        ))}
    </TrackThumbnail>
  );
}
