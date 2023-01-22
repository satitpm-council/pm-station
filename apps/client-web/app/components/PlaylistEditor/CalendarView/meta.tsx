import { useRef } from "react";
import { Transition } from "@headlessui/react";
import type { ValidatedDocument } from "@lemasc/swr-firestore";
import { isDocumentValid } from "@lemasc/swr-firestore";

import { ButtonRenderer } from "@station/client/layout";

import { usePrograms } from "~/utils/pm-station/programs";
import type { PlaylistRecord, Program } from "@station/shared/schema/types";
import { usePlaylistCommands } from "~/utils/pm-station/playlists";

export type PlaylistMetadataProps = {
  children?: React.ReactNode | React.ReactNode[];
  playlist: ValidatedDocument<PlaylistRecord> | null | undefined;
  animate: boolean;
  side?: boolean;
};

export const PlaylistMetadata = ({
  children,
  playlist,
  animate,
  side,
}: PlaylistMetadataProps) => {
  const appear = useRef(animate);
  const { data: programs } = usePrograms();

  const buttons = usePlaylistCommands(playlist);
  return (
    <Transition
      show={animate}
      appear={appear.current || undefined}
      as="div"
      className={`py-6 flex ${side ? "flex-col" : "flex-row lg:pt-0"} gap-4`}
      enter="transition duration-300 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-300 ease-out"
      leaveFrom="transform opacity-100"
      leaveTo="transform opacity-0"
    >
      <div className="flex flex-col flex-grow gap-2">
        <h3 data-id={playlist?.id} className="font-bold text-2xl">
          {children} {playlist && `(${playlist.totalTracks} รายการ)`}
        </h3>
        <span className="text-gray-200 leading-7">
          {playlist ? (
            <>
              รายการ:{" "}
              {
                (
                  programs?.find(
                    (v) => isDocumentValid(v) && v.id === playlist.target
                  ) as ValidatedDocument<Program>
                ).name
              }
              <br />
              สถานะ:{" "}
              {playlist.status === "played" ? "เล่นไปแล้ว" : "ยังไม่ถูกเล่น"}
            </>
          ) : (
            "ไม่มีรายการเพลง"
          )}
        </span>
      </div>
      {buttons && <ButtonRenderer buttons={buttons} />}
    </Transition>
  );
};
