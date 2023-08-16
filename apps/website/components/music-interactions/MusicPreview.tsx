"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { TrackResponse } from "@/schema/songrequests";
import { PlayIcon, PauseIcon } from "@heroicons/react/20/solid";
import { TrackThumbnail } from "./TrackThumbnail";

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

  const stopPlaying = useCallback(() => {
    if (audioInstance.current) {
      audioInstance.current.pause();
      audioInstance.current = undefined;
      setIsPlaying(false);
    }
  }, []);

  useEffect(() => {
    if (!canPlay) {
      stopPlaying();
    }
  }, [canPlay, stopPlaying]);

  // Stop playing on unmount
  useEffect(() => {
    return () => {
      stopPlaying();
    };
  }, [stopPlaying]);

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
  if (!track) return null;
  return (
    <TrackThumbnail
      track={track}
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
