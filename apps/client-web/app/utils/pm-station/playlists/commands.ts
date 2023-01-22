import { useCallback, useMemo } from "react";
import { useNavigate } from "@remix-run/react";
import {
  ArrowPathIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";

import type { ValidatedDocument } from "@lemasc/swr-firestore";

import axios from "shared/axios";
import type { DeletePlaylistAction } from "@station/shared/api";
import type { PlaylistRecord } from "@station/shared/schema/types";
import type { ButtonProps } from "@station/client/layout";
import { UserRole, useUser } from "../client";

type CommandSubPage = "edit" | "sync";
type CommandsTemplate = Omit<ButtonProps, "onClick"> & {
  type: CommandSubPage | "remove";
  minRole?: UserRole;
};
const commands: CommandsTemplate[] = [
  {
    className: "bg-blue-500 hover:bg-blue-600",
    type: "edit",
    icon: PencilIcon,
    text: "แก้ไข",
  },
  {
    className: "bg-green-500 hover:bg-green-600",
    type: "sync",
    icon: ArrowPathIcon,
    text: "ซิงก์",
    minRole: UserRole.MODERATOR,
  },
  {
    className: "bg-red-500 hover:bg-red-600",
    type: "remove",
    text: "ลบ",
    icon: TrashIcon,
  },
];

export const usePlaylistCommands = (
  playlist?: ValidatedDocument<PlaylistRecord> | null,
  full?: boolean
) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const goToSubPage = useCallback(
    (page: CommandSubPage) => {
      navigate(
        `/pm-station/app/songrequests/playlists/${playlist?.id}/${page}`
      );
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

  const buttons: ButtonProps[] | undefined = useMemo(
    () =>
      user &&
      (user?.role === UserRole.ADMIN ||
        (playlist && playlist.status === "queued"))
        ? commands
            .filter(({ minRole }) => (minRole ? user.role >= minRole : true))
            .map(({ type, text, ...v }) => {
              return {
                ...v,
                text: full ? text + "รายการ" : text,
                onClick: type === "remove" ? remove : () => goToSubPage(type),
              };
            })
        : undefined,
    [user, playlist, full, remove, goToSubPage]
  );
  return buttons;
};
