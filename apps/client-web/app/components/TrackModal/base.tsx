import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowTopRightOnSquareIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";

import type { TrackResponse } from "~/utils/pm-station/spotify/search";
import { MusicPreview } from "./preview";

type BaseProps = {
  onClose: () => void;
};
export type TrackModalProps = Pick<UseStableTrack, "track"> & BaseProps;

export type UseStableTrack<T extends TrackResponse = TrackResponse> = {
  track: T | undefined;
  isOpen: boolean;
  closeModal: () => void;
};

export function useStableTrack<T extends TrackResponse>(
  trackProp?: T
): UseStableTrack<T> {
  const track = useRef<T>();

  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (trackProp && !track.current) {
      track.current = trackProp;
      setIsOpen(true);
    } else if (!trackProp && track) {
      track.current = undefined;
    }
  }, [trackProp]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return { track: track.current, isOpen, closeModal };
}

export default function TrackModal({
  track,
  isOpen,
  closeModal,
  onClose,
  children,
  className,
}: BaseProps &
  UseStableTrack & {
    className?: string;
    children: React.ReactNode;
  }) {
  const afterLeave = useCallback(() => {
    onClose();
  }, [onClose]);
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
              <Dialog.Panel className="flex flex-col md:flex-row items-center gap-8 w-full max-w-sm mr-5 sm:max-w-md md:max-w-2xl transform overflow-hidden rounded-xl bg-stone-800 px-6 py-12 md:py-8 shadow-xl transition-all text-white">
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 items-center justify-center md:items-start text-center md:text-left focus:outline-none opacity-80 hover:opacity-50 transition-opacity"
                >
                  <XMarkIcon className="md:h-8 md:w-8 h-6 w-6" />
                </button>
                <MusicPreview
                  canPlay={isOpen}
                  className="flex-shrink-0 max-w-[200px] md:max-w-none"
                  track={track}
                />
                <div className="flex flex-col items-center md:items-start gap-4 text-center md:text-left">
                  <div className="flex flex-col gap-3 text-sm">
                    <Dialog.Title
                      as="h3"
                      className="text-3xl font-medium line-clamp"
                    >
                      {track?.name}
                    </Dialog.Title>
                    <span>{track?.artists.join("/")}</span>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={track?.external_urls}
                      className="text-green-400 hover:text-green-500 underline"
                    >
                      <ArrowTopRightOnSquareIcon className="inline mr-2 -mt-1 w-5 h-5" />
                      เปิดใน Spotify
                    </a>
                  </div>

                  <div className={className}>{children}</div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
