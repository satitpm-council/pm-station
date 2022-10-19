import { Dialog } from "@headlessui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";

import type { TrackResponse } from "~/utils/pm-station/spotify/search";
import { MusicPreview } from "./preview";
import type { ModalProps, ModalState } from "../Modal";
import Modal from "../Modal";

export type TrackModalProps = Pick<UseStableTrack, "track"> &
  Pick<ModalProps, "onClose">;

export type UseStableTrack<T extends TrackResponse = TrackResponse> = {
  track: T | undefined;
} & ModalState;

/**
 * Creates a stable track reference for using inside the modal, preventing UI shifts.
 * @param trackProp Current track state
 */
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
}: ModalProps &
  UseStableTrack & {
    className?: string;
  }) {
  return (
    <Modal onClose={onClose} isOpen={isOpen} closeModal={closeModal}>
      <MusicPreview
        canPlay={isOpen}
        className="flex-shrink-0 max-w-[200px] md:max-w-none"
        track={track}
      />
      <div className="flex flex-col items-center md:items-start gap-4 text-center md:text-left">
        <div className="flex flex-col gap-3 text-sm">
          <Dialog.Title as="h3" className="text-3xl font-medium line-clamp">
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
    </Modal>
  );
}
