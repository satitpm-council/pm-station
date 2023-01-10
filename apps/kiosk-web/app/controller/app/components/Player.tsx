import { PlayIcon, StopIcon } from "@heroicons/react/24/solid";
import TrackThumbnail from "@station/client/TrackThumbnail";
import { useEffect } from "react";
import { useAudioPlayer } from "react-use-audio-player";
import { controllerStore } from "../store";

export default function Player() {
  const currentTrack = controllerStore((state) => state.playingTrack);
  const { togglePlayPause, load, stop } = useAudioPlayer();
  useEffect(() => {
    console.log(currentTrack);
    if (currentTrack?.youtubeId) {
      load({
        src: `/api/stream?v=${currentTrack.youtubeId}`,
        autoplay: true,
        xhr: {
          withCredentials: true,
        },
        html5: true,
      });
    }
  }, [currentTrack, load]);
  return currentTrack ? (
    <div className="flex flex-col items-center justify-center gap-6">
      <TrackThumbnail
        track={currentTrack}
        className={{
          wrapper: "basis-1/4 min-w-[85px] max-w-[250px] relative",
          image: "w-full h-auto rounded-lg",
        }}
      />
      <div className="flex flex-col gap-2 text-center">
        <b className="font-bold text-3xl">{currentTrack.name}</b>
        <span className="text-gray-200">{currentTrack.artists.join("/")}</span>
      </div>
      <div className="flex flex-row gap-4">
        <button onClick={togglePlayPause}>
          <PlayIcon className="h-20 w-20" />
        </button>
        <button onClick={() => stop()}>
          <StopIcon className="h-20 w-20" />
        </button>
      </div>
    </div>
  ) : null;
}
