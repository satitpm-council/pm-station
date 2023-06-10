import { useEffect, useRef } from "react";
import { useAudioPlayer } from "react-use-audio-player";
import {
  controllerStore,
  setMediaStatus,
  stopTrack,
} from "kiosk-web/store/controller";
import { TrackResponse } from "@station/shared/schema";
import {
  sendPlayEvent,
  sendStopEvent,
} from "kiosk-web/realtime/controller/server";

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

export default function usePlayListener() {
  const { play, load, stop, pause, player } = useAudioPlayer();
  // Calling load on the same source will not trigger a play event.
  // So we need to store the last played source ourselves, and trigger play manually.
  // This will mostly be used when the user stop the same track and play it again.
  const lastPlaySrc = useRef<string>();

  // When the playingTrack changes, we need to load and play the new track.
  useEffect(
    () =>
      controllerStore.subscribe(
        (state) => state.playingTrack?.youtubeId,
        (videoId, previousVideoId) => {
          console.log(videoId);
          // Not the same videoId, pause and just think what to do next.
          if (previousVideoId !== videoId) {
            pause();
          }
          // The current track has a videoId, play it.
          if (videoId) {
            const src = `/api/stream?v=${videoId}`;
            // Same source as before, trigger play
            if (lastPlaySrc.current === src) {
              console.log("Same source, trigger play");
              play();
              return;
            }
            // Not the same source, load with autoplay.
            console.log("Should start play");
            lastPlaySrc.current = src;
            // Howler has problems while playing new, fresh audio stream.
            // Preload the stream with a fetch request to avoid this.
            fetch(src)
              .then(() => {
                load({
                  src,
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
                  onstop: () => stopTrack(),
                  onend,
                });
              })
              .catch(() => setMediaStatus("error"));
          } else {
            stop();
          }
        }
      ),
    [load, play, pause, stop]
  );

  // When mediaStatus changes, we need to send updates to the socket server.
  useEffect(
    () =>
      controllerStore.subscribe(
        (state) => state.mediaStatus,
        (mediaStatus, previousMediaStatus) => {
          const { playingTrack } = controllerStore.getState();
          console.log(mediaStatus, previousMediaStatus, playingTrack);
          if (mediaStatus === "playing" && playingTrack) {
            const track = TrackResponse.parse(playingTrack);
            // we use duration from the player to get the exact time left.
            track.duration_ms =
              player && player.duration() > 0
                ? Math.floor((player.duration() - player.seek()) * 1000)
                : track.duration_ms;
            const trackEndTime = Date.now() + track.duration_ms;
            sendPlayEvent({ track, trackEndTime });
          } else if (
            mediaStatus !== "playing" &&
            previousMediaStatus === "playing"
          ) {
            sendStopEvent();
          }
        }
      ),
    [player]
  );

  useEffect(() => {
    const { playingTrack } = controllerStore.getState();
    if (!playingTrack) {
      sendStopEvent();
    }
  }, []);
}
