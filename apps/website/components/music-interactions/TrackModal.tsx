import { Dialog } from "@headlessui/react";
import { useCallback } from "react";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";

import { MusicPreview } from "./MusicPreview";
import { Modal, ModalProps } from "../interactions/Modal";
import { songRequestModalStore } from "@/shared/modalStore";

export function TrackModal({
  children,
  className,
}: Pick<ModalProps, "children"> & {
  className?: string;
}) {
  const track = songRequestModalStore((state) => state.selectedTrack);
  const isOpen = songRequestModalStore((state) => state.show);

  const onClose = useCallback(() => {
    // The modal has been closed completely, so it is safe to remove the track from the store.
    songRequestModalStore.setState({ selectedTrack: null });
  }, []);

  const closeModal = useCallback(() => {
    songRequestModalStore.setState({ show: false });
  }, []);

  return (
    <Modal onClose={onClose} isOpen={isOpen} closeModal={closeModal}>
      {track && (
        <>
          <MusicPreview
            canPlay={isOpen}
            className="flex-shrink-0 max-w-[200px] md:max-w-none"
            track={track}
          />
          <div className="flex flex-col items-center md:items-start gap-4 text-center md:text-left">
            <div className="flex flex-col gap-3 text-sm">
              <Dialog.Title as="h3" className="text-3xl font-medium line-clamp">
                {track.title}
              </Dialog.Title>
              <span>{track.artists.join("/")}</span>
              <a
                target="_blank"
                rel="noreferrer"
                href={track.permalink}
                className="text-green-400 hover:text-green-500 underline"
              >
                <ArrowTopRightOnSquareIcon className="inline mr-2 -mt-1 w-5 h-5" />
                เปิดใน Spotify
              </a>
            </div>

            <div className={className}>{children}</div>
          </div>
        </>
      )}
    </Modal>
  );
}
