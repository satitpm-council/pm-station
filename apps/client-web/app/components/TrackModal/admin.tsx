import type { TrackModalProps } from "./base";
import TrackModal, { useStableTrack } from "./base";
import dayjs from "~/utils/dayjs";
import type { SongRequestRecord } from "~/schema/pm-station/songrequests/types";
import { useCallback, useEffect, useMemo } from "react";
import { defaults, options } from "~/utils/pm-station/songrequests";
import { useSafeParams } from "~/utils/params";
import loadable from "@loadable/component";
import { UserRole, useUser } from "~/utils/pm-station/client";
import type { CommandAction, CommandActionProps } from "./commands/types";

export type AdminTrackModalProps<T extends CommandAction | undefined> = Omit<
  TrackModalProps,
  "track"
> & {
  track?: SongRequestRecord;
  type?: T;
} & CommandActionProps<T>;

const Commands = loadable(() => import("./commands"));

export const AdminTrackModal = <T extends CommandAction | undefined>(
  props: AdminTrackModalProps<T>
) => {
  const { user } = useUser();
  const stableTrack = useStableTrack(props.track);
  const [params] = useSafeParams(defaults, options);

  const { track, closeModal } = stableTrack;

  useEffect(() => {
    closeModal();
  }, [params.filter, closeModal]);

  const canShowCommands = useMemo(
    () => user && user.role && user.role >= UserRole.EDITOR,
    [user]
  );

  useEffect(() => {
    if (canShowCommands) {
      Commands.preload();
    }
  }, [canShowCommands]);

  const actionHandler = useCallback(() => {
    if (props.type) {
      if (track && props.type === "removeFromPlaylist") {
        (props as CommandActionProps<"removeFromPlaylist">).onAction(track);
      }
      closeModal();
    }
  }, [props, track, closeModal]);

  return (
    <TrackModal
      className="text-sm flex flex-col gap-1"
      {...props}
      {...stableTrack}
    >
      <span>คนส่งคำขอทั้งหมด {track?.submissionCount} คน</span>
      <span>
        เปลี่ยนแปลงล่าสุดเมื่อ {dayjs(track?.lastUpdatedAt).format("LLL น.")}
      </span>
      {track?.lastPlayedAt && track.lastPlayedAt.valueOf() > 0 ? (
        <span>เปิดล่าสุดเมื่อ {dayjs(track?.lastPlayedAt).format("LL")}</span>
      ) : (
        canShowCommands && <Commands track={track} onAction={actionHandler} />
      )}
    </TrackModal>
  );
};
