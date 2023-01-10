import { Disclosure, Transition } from "@headlessui/react";
import { CheckIcon, MinusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TrackMeta } from "@station/client/songrequests";
import TrackThumbnail from "@station/client/TrackThumbnail";
import type { SongRequestRecord } from "@station/shared/schema/types";
import { classNames } from "@station/client/utils";
import type { MusicInfo } from "~/utils/pm-station/ytmusic/types";
import { EditMusic, ViewMusic } from "./item-mode";
import { syncModalStore } from "./store";

export const SyncMusicItem = ({
  track,
  index,
}: {
  track: SongRequestRecord;
  index: number;
}) => {
  const resultProp = syncModalStore((state) => state.results?.[index] ?? null);
  const [mode, setMode] = useState<"view" | "edit">("view");
  const customResult = syncModalStore((state) =>
    state.customResults.get(index)
  );
  const result = useMemo(
    () => customResult || resultProp,
    [customResult, resultProp]
  );
  const [open, setOpen] = useState(false);
  const Icon = useMemo(
    () => (result === null ? MinusIcon : result ? CheckIcon : XMarkIcon),
    [result]
  );

  useEffect(() => {
    if (result !== null) {
      setOpen(true);
    }
  }, [result]);

  useEffect(() => {
    setMode("view");
  }, [result]);

  const setCustomResult = useCallback(
    (result: MusicInfo | null) => {
      syncModalStore.setState((s) => {
        const customResults = new Map(s.customResults);
        if (result) {
          customResults.set(index, result);
        } else {
          customResults.delete(index);
        }
        return {
          ...s,
          customResults,
        };
      });
    },
    [index]
  );

  return (
    <Disclosure key={track.id}>
      <div className="flex flex-col w-full">
        <Disclosure.Button
          onClick={() => result !== null && setOpen((v) => !v)}
          className={classNames(
            "bg-white flex gap-4 p-4 border border-zinc-800",
            open
              ? "bg-opacity-20 rounded-t-lg"
              : "bg-opacity-10 hover:bg-opacity-20 rounded-lg"
          )}
        >
          <TrackThumbnail
            track={track}
            className={{
              wrapper: "basis-1/4 max-w-[70px]",
              image: "w-full h-auto rounded-lg",
            }}
          />
          <div className="text-gray-300 max-w-full text-sm flex flex-grow text-left flex-col items-start min-w-0 min-h-0 truncate">
            <TrackMeta track={track} />
          </div>
          <div className="flex flex-shrink-0 items-center justify-center">
            <Icon
              className={`h-8 w-8 ${
                result === null
                  ? "text-gray-300"
                  : result
                  ? "text-green-300"
                  : "text-red-300"
              }`}
            />
          </div>
        </Disclosure.Button>
        <Transition
          show={open}
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          {result && (
            <Disclosure.Panel
              static
              className="rounded-b-lg bg-white bg-opacity-5 p-4 space-y-2"
            >
              {mode === "view" ? (
                <ViewMusic result={result} />
              ) : (
                <EditMusic setCustomResult={setCustomResult} />
              )}
              <div className="flex gap-2 text-sm py-2">
                <button
                  className={classNames(
                    "pm-station-btn",
                    mode === "view" && "bg-blue-500 hover:bg-blue-600",
                    mode === "edit" && "bg-red-500 hover:bg-red-600"
                  )}
                  onClick={() => setMode(mode === "view" ? "edit" : "view")}
                >
                  {mode === "view" ? "แก้ไข" : "ยกเลิก"}
                </button>
                {customResult && (
                  <button
                    className="pm-station-btn bg-purple-500 hover:bg-purple-600"
                    onClick={() => setCustomResult(null)}
                  >
                    คืนค่าการค้นหาเริ่มต้น
                  </button>
                )}
              </div>
            </Disclosure.Panel>
          )}
        </Transition>
      </div>
    </Disclosure>
  );
};
