"use client";

import { useEffect } from "react";
import { AudioPlayerProvider, useAudioPlayer } from "react-use-audio-player";
import { controllerStore } from "../store";

function PlayListener({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) {
  const videoId = controllerStore((state) => state.playingTrack?.youtubeId);
  const { load, stop } = useAudioPlayer();

  useEffect(() => {
    console.log(videoId);
    if (videoId) {
      console.log("Should load");
      load({
        src: `/api/stream?v=${videoId}`,
        format: "ogg",
        autoplay: true,
        xhr: {
          withCredentials: true,
        },
        html5: true,
        onend: () => {
          // remove the current track from the queue
          controllerStore.setState((state) => {
            let nextPlayingTrack = undefined;
            const queue = new Set(state.queue);
            if (state.playingTrack) {
              queue.delete(state.playingTrack);
            }
            const queueArray = Array.from(queue.values());
            if (queueArray.length > 0) {
              nextPlayingTrack = queueArray[0];
            }
            return {
              ...state,
              playingTrack: nextPlayingTrack,
              queue,
            };
          });
        },
      });
    } else {
      stop();
    }
  }, [videoId, load, stop]);

  return <>{children}</>;
}
export default function PlayerContext({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) {
  return (
    <AudioPlayerProvider>
      <PlayListener>{children}</PlayListener>
    </AudioPlayerProvider>
  );
}
