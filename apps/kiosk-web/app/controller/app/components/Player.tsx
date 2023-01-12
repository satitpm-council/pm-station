import { StopIcon } from "@heroicons/react/20/solid";
import TrackThumbnail from "@station/client/TrackThumbnail";
import { controllerStore } from "kiosk-web/store/controller";
import { useAudioPosition } from "react-use-audio-player";
import { MediaStatusButtonIcon } from "./MiniPlayer/item";

const formatTime = (seconds: number) => {
  const floored = Math.floor(seconds);
  let from = 14;
  let length = 5;
  // Display hours only if necessary.
  if (floored >= 3600) {
    from = 11;
    length = 8;
  }

  return new Date(floored * 1000).toISOString().substr(from, length);
};

const Duration = () => {
  const { position, duration, percentComplete } = useAudioPosition();
  return (
    <span>
      {formatTime(position)}/{formatTime(duration)} (
      {Math.floor(percentComplete)}%)
    </span>
  );
};
export default function Player() {
  const currentTrack = controllerStore((state) => state.playingTrack);

  return currentTrack ? (
    <div className="flex flex-col items-center justify-center gap-6">
      <b className="text-lg">เพลงปัจจุบัน:</b>
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
        <MediaStatusButtonIcon className="rounded-full bg-zinc-700 h-20 w-20 hover:bg-zinc-800" />
        <button
          className="flex justify-center items-center rounded-full bg-zinc-700 h-20 w-20 hover:bg-zinc-800"
          onClick={() => stop()}
        >
          <StopIcon className="w-6 h-6" />
        </button>
      </div>
      <Duration />
    </div>
  ) : null;
}
