import { Dialog, Transition } from "@headlessui/react";
import { useCallback, useEffect } from "react";
import { useRef } from "react";
import { Fragment, useState } from "react";
import type { TrackResponse } from "~/utils/pm-station/spotify/search";
import { PlayIcon, PauseIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useSubmit, useTransition } from "@remix-run/react";
import { SubmitButton } from "./SubmitButton";
import { toFormData } from "~/utils/api";
import type { SelectTrackAction } from "~/utils/pm-station/api-types";
import { useAuthenticityToken } from "remix-utils";

function MusicPreview({
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

  useEffect(() => {
    if (!canPlay && audioInstance.current) {
      audioInstance.current.pause();
      audioInstance.current = undefined;
    }
  }, [canPlay]);

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
  return (
    <div className={`${className} relative`}>
      <img
        draggable={false}
        src={track?.albumImage?.url}
        alt={`${track?.name} - ${track?.artists[0]}`}
      />
      {track?.preview_url && (
        <button
          onClick={onClick}
          title="เล่นตัวอย่างเพลง"
          className="absolute right-2 bottom-2 md:bottom-4 md:right-4 z-10 rounded-full shadow-md bg-green-500 p-4 scale-75 hover:scale-90 md:scale-100 md:hover:scale-110 transition-transform focus:outline-none"
        >
          {isPlaying ? (
            <PauseIcon className="h-5 w-5" />
          ) : (
            <PlayIcon className="h-5 w-5" />
          )}
        </button>
      )}
    </div>
  );
}

export default function TrackModal({
  track: trackProp,
  onClose,
}: {
  track?: TrackResponse;
  onClose: () => void;
}) {
  const token = useAuthenticityToken();
  const submit = useSubmit();
  const track = useRef<TrackResponse>();
  const transition = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (trackProp && !track.current) {
      track.current = trackProp;
      setIsOpen(true);
    } else if (!trackProp && track.current) {
      track.current = undefined;
    }
  }, [trackProp]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const afterLeave = useCallback(() => {
    onClose();
  }, [onClose]);

  const selectTrack = useCallback(async () => {
    if (!token || !track.current) return;
    try {
      submit(
        toFormData<SelectTrackAction>({
          sessionToken: token,
          trackId: track.current.id,
        }),
        {
          action: "/pm-station/app/songrequests/select",
          method: "post",
        }
      );
    } catch (err) {
      console.error(err);
    }
  }, [token, submit, track]);

  return (
    <Transition appear show={isOpen} as={Fragment} afterLeave={afterLeave}>
      <Dialog as="div" className="relative z-[9999]" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-white bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="flex flex-col md:flex-row items-center gap-8 md:w-full mr-5 max-w-2xl transform overflow-hidden rounded-xl bg-stone-800 px-6 py-12 md:py-8 shadow-xl transition-all text-white">
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 items-center justify-center md:items-start text-center md:text-left focus:outline-none opacity-80 hover:opacity-50 transition-opacity"
                >
                  <XMarkIcon className="md:h-8 md:w-8 h-6 w-6" />
                </button>
                <MusicPreview
                  canPlay={isOpen}
                  className="flex-shrink-0 max-w-[200px] md:max-w-none"
                  track={track.current}
                />
                <div className="flex flex-col items-center md:items-start gap-4 text-center md:text-left">
                  <div className="flex flex-col gap-3">
                    <Dialog.Title
                      as="h3"
                      className="text-3xl font-medium line-clamp"
                    >
                      {track.current?.name}
                    </Dialog.Title>
                    <span className="text-sm">
                      {track.current?.artists.join("/")}
                    </span>
                  </div>

                  <div>
                    <SubmitButton
                      onClick={selectTrack}
                      loading={transition.state === "submitting"}
                    >
                      เลือกเพลงนี้
                    </SubmitButton>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
