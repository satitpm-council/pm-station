import { ChevronUpDownIcon, SpeakerWaveIcon } from "@heroicons/react/20/solid";
import { ItemProps } from "@station/client/songrequests";
import { classNames } from "@station/client/utils";
import { Reorder, useDragControls } from "framer-motion";
import {
  controllerStore,
  removeTrack,
  Track,
} from "kiosk-web/store/controller";
import { useCallback } from "react";
import { useLongPress } from "use-long-press";
import { SongRequestRecordItem } from "./item";

export const ReorderItem = ({ track, ...props }: ItemProps<Track>) => {
  const currentTrack = controllerStore((state) => state.playingTrack);
  const controls = useDragControls();
  const dragHandler = useCallback(
    (e: React.PointerEvent) => {
      controls.start(e);
    },
    [controls]
  );

  const onLongPress = useCallback(() => {
    if (currentTrack === track) return;
    const remove = confirm(`ต้องการลบ "${track.name}" จากคิวเพลงหรือไม่`);
    if (remove) {
      removeTrack(track);
    }
  }, [track, currentTrack]);

  const bind = useLongPress(onLongPress);
  return (
    <Reorder.Item
      draggable={false}
      value={track}
      className="flex flex-row select-none"
      dragListener={false}
      dragControls={controls}
      style={{
        userSelect: "none",
        touchAction: "pan-x",
      }}
    >
      <div className="flex-grow flex-shrink-0" {...bind()}>
        <SongRequestRecordItem track={track} {...props} />
      </div>
      <div
        className={classNames(
          "px-4 flex items-center justify-center",
          currentTrack === track
            ? "bg-[#27cf65] bg-opacity-80"
            : "bg-zinc-700 bg-opacity-50"
        )}
        onPointerDown={currentTrack !== track ? dragHandler : undefined}
      >
        {currentTrack === track ? (
          <SpeakerWaveIcon className="h-8 w-8 text-white" />
        ) : (
          <ChevronUpDownIcon className="h-8 w-8 text-white" />
        )}
      </div>
    </Reorder.Item>
  );
};
