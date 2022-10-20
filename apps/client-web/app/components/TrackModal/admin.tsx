import { useCallback, useEffect, useMemo, useState } from "react";
import loadable from "@loadable/component";
import { useSWRConfig } from "swr";
import { getDocument, isDocumentValid } from "@lemasc/swr-firestore";
import type { TypeOf } from "zod";
import dayjs from "~/utils/dayjs";

import type { SongRequestSearchRecord } from "~/schema/pm-station/songrequests/types";
import { SongRequestRecord } from "~/schema/pm-station/songrequests/schema";
import { useSafeParams } from "~/utils/params";
import { UserRole, useUser } from "~/utils/pm-station/client";
import { defaults, options } from "~/utils/pm-station/songrequests";
import { getStatusFromLastPlayedDate } from "~/utils/pm-station/songrequests/date";
import { zodValidator } from "~/utils/pm-station/zodValidator";

import type { TrackModalProps } from "./base";
import TrackModal, { useStableTrack } from "./base";
import type { CommandAction, CommandActionProps } from "./commands/types";

export type AdminTrackModalProps<
  A extends CommandAction | undefined,
  T extends SongRequestSearchRecord
> = Omit<TrackModalProps, "track"> & {
  track?: T;
  type?: A;
} & CommandActionProps<A>;

const Commands = loadable(() => import("./commands"));

export const AdminTrackModal = <
  A extends CommandAction | undefined,
  T extends SongRequestSearchRecord
>(
  props: AdminTrackModalProps<A, T>
) => {
  const { user } = useUser();
  const [record, setRecord] = useState<TypeOf<typeof SongRequestRecord>>();
  const stableTrack = useStableTrack(record);
  const { mutate } = useSWRConfig();

  useEffect(() => {
    if (props.track) {
      try {
        setRecord(SongRequestRecord.parse(props.track));
      } catch {
        // This is not a full SongRequestRecord.
        // Fetch a new one before continue.
        getDocument(`songrequests/${props.track.id}`, {
          validator: zodValidator(SongRequestRecord),
          mutate,
        }).then((doc) => {
          if (doc && isDocumentValid(doc)) {
            setRecord(doc);
          }
        });
      }
    } else {
      setRecord(undefined);
    }
  }, [props.track, mutate]);

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
        (props as unknown as CommandActionProps<"removeFromPlaylist">).onAction(
          track
        );
      }
      closeModal();
    }
  }, [props, track, closeModal]);

  return (
    <TrackModal
      className="text-sm flex flex-col gap-1"
      onClose={props.onClose}
      {...stableTrack}
    >
      <span>คนส่งคำขอทั้งหมด {track?.submissionCount} คน</span>
      <span>
        เปลี่ยนแปลงล่าสุดเมื่อ {dayjs(track?.lastUpdatedAt).format("LLL น.")}
      </span>
      {getStatusFromLastPlayedDate(track?.lastPlayedAt) === "played" && (
        <span>เปิดล่าสุดเมื่อ {dayjs(track?.lastPlayedAt).format("LL")}</span>
      )}
      {canShowCommands && (
        <Commands type={props.type} track={track} onAction={actionHandler} />
      )}
    </TrackModal>
  );
};
