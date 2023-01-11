import { useCallback, useMemo, MouseEventHandler } from "react";

import TrackThumbnail from "@station/client/TrackThumbnail";
import { TrackMeta } from "@station/client/songrequests";
import type { SongRequestRecord } from "@station/shared/schema/types";

import type { ItemProps } from "@station/client/songrequests";
import { controllerStore, MediaStatus } from "kiosk-web/store/controller";
import {
  ExclamationTriangleIcon,
  PauseIcon,
  PlayIcon,
} from "@heroicons/react/20/solid";
import { useAudioPlayer } from "react-use-audio-player";
import { classNames } from "@station/client/utils";

export const MiniPlayerItem = ({
  track,
}: Omit<ItemProps<SongRequestRecord>, "onItemClick">) => {
  return (
    <div className="flex flex-row items-center gap-4 min-w-0 min-h-0">
      <TrackThumbnail
        track={track}
        className={{
          wrapper: "basis-1/4 max-w-[100px] relative",
          image: "w-full h-auto rounded",
        }}
      />
      <div
        style={{ zoom: 0.9 }}
        className="basis-3/4 text-gray-300 max-w-full text-sm flex flex-grow text-left flex-col items-start min-w-0 min-h-0 truncate"
      >
        <TrackMeta track={{ ...track, duration_ms: undefined }} />
      </div>
    </div>
  );
};

const Icon: Record<
  NonNullable<MediaStatus>,
  (props: React.ComponentProps<"svg">) => JSX.Element
> = {
  error: ExclamationTriangleIcon,
  paused: PlayIcon,
  playing: PauseIcon,
};

export const MediaStatusButtonIcon = ({ className }: { className: string }) => {
  const mediaStatus = controllerStore((state) => state.mediaStatus);
  const { togglePlayPause } = useAudioPlayer();
  const isError = useMemo(() => mediaStatus === "error", [mediaStatus]);
  const StatusIcon = useMemo(
    () => (mediaStatus ? Icon[mediaStatus] : () => null),
    [mediaStatus]
  );

  const onClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      e.stopPropagation();
      togglePlayPause();
    },
    [togglePlayPause]
  );
  return (
    <>
      {mediaStatus && (
        <button
          className={classNames("flex justify-center items-center", className)}
          disabled={isError}
          onClick={isError ? undefined : onClick}
        >
          <StatusIcon className="w-6 h-6" />
        </button>
      )}
    </>
  );
};
