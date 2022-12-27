import { useCallback, useRef } from "react";
import { useNavigate } from "@remix-run/react";
import { Transition } from "@headlessui/react";
import {
  ArrowPathIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import type { ValidatedDocument } from "@lemasc/swr-firestore";
import { isDocumentValid } from "@lemasc/swr-firestore";

import { ButtonRenderer } from "@station/client/layout";

import axios from "shared/axios";
import { usePrograms } from "~/utils/pm-station/programs";
import type { PlaylistRecord, Program } from "@station/shared/schema/types";
import type { DeletePlaylistAction } from "@station/shared/api";
import { getAppContainer } from "~/utils/pm-station/client";

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

  const navigate = useNavigate();
  const goToSubPage = useCallback(
    (page: "edit" | "sync") => {
      navigate(
        `/pm-station/app/songrequests/playlists/${playlist?.id}/${page}`
      );
      getAppContainer()?.scrollTo(0, 0);
    },
    [navigate, playlist]
  );
  const remove = useCallback(async () => {
    if (playlist && confirm("ต้องการลบรายการหรือไม่")) {
      await axios.post<any, any, DeletePlaylistAction>(
        "/pm-station/app/songrequests/playlists/delete",
        {
          playlistId: playlist?.id,
        }
      );
      navigate(`/pm-station/app/songrequests/playlists`);
    }
  }, [navigate, playlist]);

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
        <h3 className="font-bold text-2xl">
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
      {playlist && playlist.status === "queued" && (
        <ButtonRenderer
          buttons={[
            {
              className: "bg-blue-500 hover:bg-blue-600",
              onClick: () => goToSubPage("edit"),
              icon: PencilIcon,
              text: "แก้ไข",
            },
            {
              className: "bg-green-500 hover:bg-green-600",
              onClick: () => goToSubPage("sync"),
              icon: ArrowPathIcon,
              text: "ซิงก์",
            },
            {
              className: "bg-red-500 hover:bg-red-600",
              onClick: remove,
              text: "ลบ",
              icon: TrashIcon,
            },
          ]}
        />
      )}
    </Transition>
  );
};
