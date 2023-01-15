"use client";

import { useEffect } from "react";
import { AudioPlayerProvider, useAudioPlayer } from "react-use-audio-player";
import { controllerStore, setMediaStatus } from "kiosk-web/store/controller";
import { TrackResponse } from "@station/shared/schema";

const onend = () => {
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
  const { player, load, stop, stopped } = useAudioPlayer();

  useEffect(
    () =>
      controllerStore.subscribe(
        (state) => state.playingTrack?.youtubeId,
        (videoId) => {
          console.log(videoId);
          if (videoId) {
            console.log("Should load");
            // Howler has problems while playing new, fresh audio stream.
            // Preload the stream with a fetch request to avoid this.
            fetch(`/api/stream?v=${videoId}`)
              .then(() => {
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
              })
              .catch(() => setMediaStatus("error"));
          } else {
            stop();
          }
        }
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(
    () =>
      controllerStore.subscribe(
        (state) => state.mediaStatus,
        (mediaStatus, previousMediaStatus) => {
          const { socket, playingTrack } = controllerStore.getState();
          console.log(mediaStatus, previousMediaStatus, playingTrack);
          if (socket) {
            if (mediaStatus === "playing" && playingTrack) {
              const track = TrackResponse.parse(playingTrack);
              // we use duration from the player to get the exact time left.
              track.duration_ms =
                player && player.duration() > 0
                  ? Math.floor((player.duration() - player.seek()) * 1000)
                  : track.duration_ms;
              const trackEndTime = Date.now() + track.duration_ms;
              socket.emit("play", track, trackEndTime);
            } else if (
              mediaStatus !== "playing" &&
              previousMediaStatus === "playing"
            ) {
              socket.emit("stop");
            }
          }
        }
      ),
    [player]
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
