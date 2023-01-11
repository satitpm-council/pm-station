"use client";

import { useEffect } from "react";
import { AudioPlayerProvider, useAudioPlayer } from "react-use-audio-player";
import { controllerStore, setMediaStatus } from "kiosk-web/store/controller";

const onend = () => {
  console.log("onEnd");
  // remove the current track from the queue
  controllerStore.setState((state) => {
    const queue = new Set(state.queue);
    if (state.playingTrack) {
      queue.delete(state.playingTrack);
    }
    const queueArray = Array.from(queue.values());
    return {
      ...state,
      playingTrack: queueArray.length > 0 ? queueArray[0] : undefined,
      mediaStatus: null,
      queue,
    };
  });
};

function PlayListener() {
  const { load, stop } = useAudioPlayer();

  useEffect(
    () =>
      controllerStore.subscribe(
        (state) => state.playingTrack?.youtubeId,
        (videoId) => {
          console.log(videoId);
          if (videoId) {
            console.log("Should load");
            load({
              src: `/api/stream?v=${videoId}`,
              format: "ogg",
              xhr: {
                withCredentials: true,
              },
              html5: true,
              autoplay: true,
              onloaderror: () => setMediaStatus("error"),
              onplayerror: () => setMediaStatus("error"),
              onplay: () => setMediaStatus("playing"),
              onpause: () => setMediaStatus("paused"),
              onstop: () => setMediaStatus("paused"),
              onend,
            });
          } else {
            stop();
          }
        }
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return null;
}
export default function PlayerContext({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) {
  return (
    <AudioPlayerProvider>
      <>
        {children}
        <PlayListener />
      </>
    </AudioPlayerProvider>
  );
}
